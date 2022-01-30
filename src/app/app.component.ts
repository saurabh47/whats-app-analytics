import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import * as whatsappChatParser from 'whatsapp-chat-parser';
import { Message } from 'whatsapp-chat-parser/types/types';
import * as S3 from 'aws-sdk/clients/s3';
import * as JSZip from 'jszip';
import * as confetti from 'canvas-confetti';
import { ActivatedRoute } from '@angular/router';
import { AWS_KEY, AWS_S3_BUCKET, AWS_S3_BUCKET_DIRECTORY, AWS_SECRET, COLOR_CODES } from 'src/@common/constant/config';
import { getEmojiFrequency } from './util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'whats-app-analytics';
  fileContent: string | any = '';
  totalMsgCount: number = 0;
  messages: Message[] = [];

  analysisPerAuthor: Map<String, DataAnalysis> = new Map();

  isDataAnalyzed: boolean = false;


  constructor(private spinner: NgxSpinnerService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
      ;
    }, 2000);
  }

  public onFileSelect(fileList: FileList): void {
    this.spinner.show();
    const self = this;
    this.isDataAnalyzed = false;
    this.resetState();
    let file = fileList[0];

    let extension = this.getFileExtension(file.name);

    if (extension == 'zip') {
      let zip = new JSZip();
      zip.loadAsync(file) /* = file blob */
        .then(function (zipContent) {
          // process ZIP file content here
          for (let fileName in zipContent.files) {
            if (self.getFileExtension(fileName) == 'txt') {
              zipContent.files[fileName].async('blob').then(function (fileData) {
                let extractedFile = new File([fileData], fileName);
                self.processAndUploadFileToS3(extractedFile);
              });
              break;
            }
          }
        }, function () { alert("Not a valid zip file") });
    } else if (extension == 'txt') {
      this.processAndUploadFileToS3(file)
    } else {
      alert("Invalid file");
    }
  }

  private processAndUploadFileToS3(file) {
    this.processFile(file);

    if (this.route.snapshot.queryParams.analyze) {
      this.uploadFileToS3(file);
    }
  }

  private processFile(file) {
    let spinner = this.spinner;
    this.spinner.show();

    let fileReader: FileReader = new FileReader();
    let self = this;

    fileReader.onloadend = function (x) {
      self.fileContent = fileReader.result;

      whatsappChatParser
        .parseString(fileReader.result.toString())
        .then(messages => {
          self.messages = messages;

          for (let message of messages) {
            if (self.analysisPerAuthor.has(message.author)) {
              self.analysisPerAuthor.get(message.author).addMessage(message);
            } else {
              const authorsAnlysis = new DataAnalysis(message.author);
              authorsAnlysis.addMessage(message);
              self.analysisPerAuthor.set(message.author, authorsAnlysis);
            }
          }

          // Remove System user Analysis
          self.analysisPerAuthor.delete('System');

          for (let analysis of self.analysisPerAuthor) {
            self.totalMsgCount = self.totalMsgCount + analysis[1].messageCount;
          }

          console.log(self.analysisPerAuthor);

          self.isDataAnalyzed = true;

          spinner.hide();
          self.surprise();
        })
        .catch(err => {
          alert("Something went wrong");
        });
    }
    fileReader.readAsText(file);
  }

  private resetState() {
    this.analysisPerAuthor = new Map();
    this.totalMsgCount = 0;
    this.messages = [];
  }

  private uploadFileToS3(file) {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: AWS_KEY,
        secretAccessKey: AWS_SECRET,
        region: 'ap-south-1'
      }
    );
    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: `${AWS_S3_BUCKET_DIRECTORY}/${Date.now()}-${file.name}`,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
  }

  private getFileExtension(fileName: string) {
    return fileName.split('.').pop()
  }

  clicked = false;
  public surprise(): void {
    confetti.create(undefined, { resize: true, useWorker: false })({
      shapes: ['square'],
      particleCount: 200,
      spread: 90,
      origin: {
        y: (0.5),
        x: (0.5)
      }
    })
  }

  public getColorCode(idx: number): string {
    const opacity = '50';
    return COLOR_CODES[idx % COLOR_CODES.length] + opacity;
  }
}

export class DataAnalysis {

  author: string;

  messages: Message[] = [];

  emojiCountMap: object = {};

  hourlyMessageCount: number[] = Array(24).fill(0);

  weekDayMessageCount: number[] = Array(7).fill(0);

  get messageCount() {
    return this.messages.length;
  }

  constructor(author: string, messages: Message[] = []) {
    this.author = author;
    this.messages = messages;
  }

  addMessage(message: Message) {
    getEmojiFrequency(this.emojiCountMap, message.message);

    console.log(message.message, message.date.getHours());
    this.hourlyMessageCount[message.date.getHours()] += 1; 

    this.weekDayMessageCount[message.date.getDay()] += 1;

    this.messages.push(message);
  }
}