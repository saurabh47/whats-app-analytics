import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import * as whatsappChatParser from 'whatsapp-chat-parser';
import { Message } from 'whatsapp-chat-parser/types/types';
import * as S3 from 'aws-sdk/clients/s3';
import * as JSZip from 'jszip';
import * as confetti from 'canvas-confetti';
import { ActivatedRoute, Router } from '@angular/router';
import { AWS_KEY, AWS_S3_BUCKET, AWS_S3_BUCKET_DIRECTORY, AWS_SECRET, COLOR_CODES } from 'src/@common/constant/config';
import { getEmojiFrequency, getWordCount } from './util';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "whats-app-analytics";
  fileContent: string | any = "";
  totalMsgCount: number = 0;
  messages: Message[] = [];

  analysisPerAuthor: Map<String, DataAnalysis> = new Map();

  isDataAnalyzed: boolean = false;

  showDemoModal = false;

  sanitizedDemoURL;

  queryParamSubscription: Subscription;

  isDemoApp = false;

  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    const demoAppURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}?showDemo=true`;

    this.sanitizedDemoURL =
      this.sanitizer.bypassSecurityTrustResourceUrl(demoAppURL);

    this.queryParamSubscription = this.route.queryParams.subscribe((params) => {
      if (params["showDemo"]) {
        this.spinner.show();
        this.isDemoApp = true;
        this.httpClient
          .get("assets/demo-chat.txt", { responseType: "text" })
          .subscribe((data) => this.parseChatAndAnalyze(data));
      }
    });
  }

  ngOnDestroy(): void {
    this.queryParamSubscription.unsubscribe();
  }

  public onFileSelect(fileList: FileList): void {
    this.spinner.show();
    const self = this;
    this.isDataAnalyzed = false;
    this.resetState();
    let file = fileList[0];

    let extension = this.getFileExtension(file.name);

    if (extension == "zip") {
      let zip = new JSZip();
      zip
        .loadAsync(file) /* = file blob */
        .then(
          function (zipContent) {
            // process ZIP file content here
            for (let fileName in zipContent.files) {
              if (self.getFileExtension(fileName) == "txt") {
                zipContent.files[fileName]
                  .async("blob")
                  .then(function (fileData) {
                    let extractedFile = new File([fileData], fileName);
                    self.processAndUploadFileToS3(extractedFile);
                  });
                break;
              }
            }
          },
          function () {
            alert("Not a valid zip file");
          }
        );
    } else if (extension == "txt") {
      this.processAndUploadFileToS3(file);
    } else {
      alert("Invalid file");
    }
  }

  onScrollTo(location: string) {
    setTimeout(() => {
      this.router.navigate([], {
        fragment: location,
        queryParamsHandling: "preserve",
      });
    }, 500);
  }

  private processAndUploadFileToS3(file) {
    this.processFile(file);

    if (this.route.snapshot.queryParams.analyze) {
      this.uploadFileToS3(file);
    }
  }

  private processFile(file) {
    this.spinner.show();

    let fileReader: FileReader = new FileReader();

    fileReader.onloadend = (x) => {
      this.parseChatAndAnalyze(fileReader.result.toString());
    };
    fileReader.readAsText(file);
  }

  private parseChatAndAnalyze(filecontent: string) {
    this.spinner.show();
    whatsappChatParser
      .parseString(filecontent)
      .then((messages) => {
        this.messages = messages;

        for (let message of messages) {
          if (this.analysisPerAuthor.has(message.author)) {
            this.analysisPerAuthor.get(message.author).addMessage(message);
          } else {
            const authorsAnlysis = new DataAnalysis(message.author);
            authorsAnlysis.addMessage(message);
            this.analysisPerAuthor.set(message.author, authorsAnlysis);
          }
        }

        // Remove System user Analysis
        this.analysisPerAuthor.delete("System");

        for (let analysis of this.analysisPerAuthor) {
          this.totalMsgCount = this.totalMsgCount + analysis[1].messageCount;
        }

        console.log(this.analysisPerAuthor);

        this.isDataAnalyzed = true;

        this.spinner.hide();
        this.surprise();
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  }

  private resetState() {
    this.analysisPerAuthor = new Map();
    this.totalMsgCount = 0;
    this.messages = [];
  }

  private uploadFileToS3(file) {
    const contentType = file.type;
    const bucket = new S3({
      accessKeyId: AWS_KEY,
      secretAccessKey: AWS_SECRET,
      region: "ap-south-1",
    });
    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: `${AWS_S3_BUCKET_DIRECTORY}/${Date.now()}-${file.name}`,
      Body: file,
      ACL: "public-read",
      ContentType: contentType,
    };
    bucket.upload(params, function (err, data) {
      if (err) {
        console.log("There was an error uploading your file: ", err);
        return false;
      }
      console.log("Successfully uploaded file.", data);
      return true;
    });
  }

  private getFileExtension(fileName: string) {
    return fileName.split(".").pop();
  }

  clicked = false;
  public surprise(): void {
    confetti.create(undefined, { resize: true, useWorker: false })({
      shapes: ["square"],
      particleCount: 200,
      spread: 90,
      origin: {
        y: 0.5,
        x: 0.5,
      },
    });
  }

  public getColorCode(idx: number): string {
    const opacity = "50";
    return COLOR_CODES[idx % COLOR_CODES.length] + opacity;
  }
}

export class DataAnalysis {
  author: string;

  messages: Message[] = [];

  msg: string[] = [];

  emojiCountMap: object = {};


  hourlyMessageCount: number[] = Array(24).fill(0);

  weekDayMessageCount: number[] = Array(7).fill(0);

  wordCount: Map<string, number> = new Map();

  get messageCount() {
    return this.messages.length;
  }

  constructor(author: string, messages: Message[] = []) {
    this.author = author;
    this.messages = messages;
  }

  addMessage(message: Message) {
    getEmojiFrequency(this.emojiCountMap, message.message);

    getWordCount(this.wordCount, message.message);

    this.hourlyMessageCount[message.date.getHours()] += 1;

    this.weekDayMessageCount[message.date.getDay()] += 1;

    this.messages.push(message);
    this.msg.push(message.message);
  }

  ngOnDestory() {}
}