import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/assets/constants';
import { NgxSpinnerService } from "ngx-spinner";
import * as whatsappChatParser from 'whatsapp-chat-parser';
import { Message } from 'whatsapp-chat-parser/types/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'whats-app-analytics';
  fileContent: string | any = '';
  // saurabhMsgs = Constants.saurabhMsgCount;
  // poojaMsgs = Constants.poojaMsgCount;
  // totalMsgs = Constants.totalMsgCount;

  constructor(private spinner: NgxSpinnerService) {

  }

  messageCountPerAuthor: Map<String, number> = new Map();
  totalMsgCount: number = 0;
  messages: Message[] = [];

  isDataAnalyzed: boolean = false;

  public onChange(fileList: FileList): void {
    this.isDataAnalyzed = false;
    this.resetState();
    let file = fileList[0];
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
          // Do whatever you want with messages
        })
        .catch(err => {
          // Something went wrong
        });

      // let lines = self.fileContent.split('\n');
      // let msgVSDate = [];
      // let msgCount = 1;
      // for (let x = 0; x < lines.length - 1; x++) {
      //   let firstMsgDateTime = new Date(lines[x].split(' - ')[0]);
      //   let secondMsgDateTime = new Date(lines[x + 1].split(' - ')[0]);

      //   if (firstMsgDateTime.getDate() == secondMsgDateTime.getDate() &&
      //     firstMsgDateTime.getMonth() == secondMsgDateTime.getMonth() &&
      //     firstMsgDateTime.getFullYear() == secondMsgDateTime.getFullYear()) {
      //     msgCount++;
      //   } else {
      //     msgVSDate.push({ date: firstMsgDateTime, count: msgCount });
      //     msgCount = 1;
      //   }
      // }
      // console.log(msgVSDate);
    }
    fileReader.readAsText(file);
  }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);
  }

  private resetState() {
    this.messageCountPerAuthor = new Map();
    this.totalMsgCount = 0;
    this.messages = [];
  }
}
