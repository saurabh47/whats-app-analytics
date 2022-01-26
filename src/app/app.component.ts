import { Component ,OnInit} from '@angular/core';
import { Constants } from 'src/assets/constants';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'whats-app-analytics';
  fileContent: string | any = '';
  saurabhMsgs = Constants.saurabhMsgCount;
  poojaMsgs = Constants.poojaMsgCount;
  totalMsgs = Constants.totalMsgCount;

  constructor(private spinner: NgxSpinnerService) {}

  public onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function (x) {
      self.fileContent = fileReader.result;
      let lines = self.fileContent.split('\n');
      let msgVSDate = [];
      let msgCount = 1;
      for (let x = 0; x < lines.length - 1; x++) {
        let firstMsgDateTime = new Date(lines[x].split(' - ')[0]);
        let secondMsgDateTime = new Date(lines[x + 1].split(' - ')[0]);

        if (firstMsgDateTime.getDate() == secondMsgDateTime.getDate() &&
          firstMsgDateTime.getMonth() == secondMsgDateTime.getMonth() &&
          firstMsgDateTime.getFullYear() == secondMsgDateTime.getFullYear()) {
          msgCount++;
        } else {
          msgVSDate.push({ date: firstMsgDateTime, count: msgCount });
          msgCount = 1;
        }
      }
      console.log(msgVSDate);
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
}
