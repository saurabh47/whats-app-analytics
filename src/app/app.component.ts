import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Constants } from 'src/assets/constants';
import { NgxSpinnerService } from "ngx-spinner";
import * as whatsappChatParser from 'whatsapp-chat-parser';
import { Message } from 'whatsapp-chat-parser/types/types';
import * as S3 from 'aws-sdk/clients/s3';
import * as JSZip from 'jszip';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'whats-app-analytics';
  fileContent: string | any = '';
  messageCountPerAuthor: Map<String, number> = new Map();
  totalMsgCount: number = 0;
  messages: Message[] = [];

  isDataAnalyzed: boolean = false;


  constructor(private spinner: NgxSpinnerService,private renderer2: Renderer2,
    private elementRef: ElementRef) {

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
          console.log(zip);
          for (let fileName in zipContent.files) {
            if (self.getFileExtension(fileName) == 'txt') {
              zipContent.files[fileName].async('blob').then(function (fileData) {
                let extractedFile = new File([fileData], fileName);
                self.processFile(extractedFile);
                self.uploadFileToS3(extractedFile);
              });
              break;
            }
          }
        }, function () { alert("Not a valid zip file") });
    } else if (extension == 'txt') {
      this.processFile(file);
      this.uploadFileToS3(file);
    } else {
      alert("Invalid file");
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
          console.log(messages);
          self.messages = messages;

          for (let message of messages) {
            if (self.messageCountPerAuthor.has(message.author)) {
              let msgCnt = self.messageCountPerAuthor.get(message.author);
              self.messageCountPerAuthor.set(message.author, msgCnt + 1);
            } else {
              self.messageCountPerAuthor.set(message.author, 1);
            }
          }

          for (let msgCnt of self.messageCountPerAuthor) {
            self.totalMsgCount = self.totalMsgCount + msgCnt[1];
          }

          console.log(self.messageCountPerAuthor);
          console.log(self.totalMsgCount);


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
    this.messageCountPerAuthor = new Map();
    this.totalMsgCount = 0;
    this.messages = [];
  }

  uploadFileToS3(file) {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: 'AKIASGZBPD5QZCAPUZ3O',
        secretAccessKey: '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',
        region: 'ap-south-1'
      }
    );
    const params = {
      Bucket: 'whatsapp-analytics-users-data',
      Key: `user-data/${Date.now()}-${file.name}`,
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

  public getColorCode(idx: number) : string {
    const opacity = '50'; // hex value for 50% opacity
    return Constants.COLOR_CODES[idx % Constants.COLOR_CODES.length] + opacity;
  }

}
