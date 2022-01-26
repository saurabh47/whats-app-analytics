import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts.src.js';
import { Constants } from 'src/assets/constants';

@Component({
  selector: 'app-daily-chats-anlysis',
  templateUrl: './daily-chats-anlysis.component.html',
  styleUrls: ['./daily-chats-anlysis.component.scss']
})
export class DailyChatsAnlysisComponent implements OnInit {
  updateFlag = true;
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  data = [];
  chartCallback = (chart) => {
      setTimeout(() => {
        console.log('Reflowing Pie Chart');
        chart.reflow();
      }, 0);
    };

  lineChartOptions = {

    chart: {
      zoomType: 'x',
      backgroundColor: '#fafafa',
    },

    title: {
      text: 'Messages between 5 Aug 2018 - 5 March 2020'
    },


    tooltip: {
      valueDecimals: 2
    },
    yAxis: {
      title: {
        text: 'No. of messages'
      },
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      },
    },
    series: [{
      data: [],
      lineWidth: 0.5,
      name: 'Messages',
      showInLegend: false,
    }],
    credits: {
      enabled: false
    },
  }


  constructor() { }

  ngOnInit() {
    this.lineChartOptions.series[0].data = Constants.msgVsDate;
  }


  fileContent: string | any = '';

  public onChange(fileList: FileList): void {
    let data = [];
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
        if(firstMsgDateTime.toUTCString() == 'Invalid Date' || secondMsgDateTime.toUTCString() == 'Invalid Date'  ){
          continue;
        }
        else if (firstMsgDateTime.getDate() == secondMsgDateTime.getDate() &&
          firstMsgDateTime.getMonth() == secondMsgDateTime.getMonth() &&
          firstMsgDateTime.getFullYear() == secondMsgDateTime.getFullYear()) {
          msgCount++;
        } else {
          msgVSDate.push([Date.UTC(firstMsgDateTime.getFullYear(),firstMsgDateTime.getMonth(),firstMsgDateTime.getDate()), msgCount]);
          msgCount = 1;
        }
      }
      self.lineChartOptions.series[0].data = msgVSDate;
      localStorage.setItem('data',JSON.stringify(msgVSDate));
      self.updateFlag = true;
    }
    fileReader.readAsText(file);
  }

  getData(n) {
    let arr = [],
      i,
      x,
      a,
      b,
      c,
      spike;
    for (
      i = 0, x = Date.UTC(new Date().getUTCFullYear(), 0, 1) - n * 36e5;
      i < n;
      i = i + 1, x = x + 36e5
    ) {
      if (i % 100 === 0) {
        a = 2 * Math.random();
      }
      if (i % 1000 === 0) {
        b = 2 * Math.random();
      }
      if (i % 10000 === 0) {
        c = 2 * Math.random();
      }
      if (i % 50000 === 0) {
        spike = 10;
      } else {
        spike = 0;
      }
      arr.push([
        x,
        2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
      ]);
    }
    return arr;
  }

}
