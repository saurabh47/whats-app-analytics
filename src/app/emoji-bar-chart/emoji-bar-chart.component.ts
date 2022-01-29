import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts.src.js';
import { Constants } from 'src/assets/constants';
import { Message } from 'whatsapp-chat-parser/types/types';

@Component({
  selector: 'app-emoji-bar-chart',
  templateUrl: './emoji-bar-chart.component.html',
  styleUrls: ['./emoji-bar-chart.component.scss']
})
export class EmojiBarChartComponent implements OnInit {

  @Input('messages') messages: Message[] = [];
  @Input('messageCountPerAuthor') messageCountPerAuthor: Map<string, number> = new Map();

  emojiCategories = ['❤️', '😘', '😍', '🤣', '😅', '😂', '👍'];


  updateFlag = true;
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  chartCallback = (chart) => {
    setTimeout(() => {
      chart.reflow();
    }, 0);
  };


  chartOptions = {
    chart: {
      type: 'bar',
      backgroundColor: '#fafafa',

    },
    title: {
      text: "Emoji's Used"
    },

    accessibility: {
      point: {
        valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.'
      }
    },
    xAxis: [{
      categories: this.emojiCategories,
      reversed: false,
      labels: {
        step: 1
      },
    }, { // mirror axis on right side
      opposite: true,
      reversed: false,
      categories: this.emojiCategories,
      linkedTo: 0,
      labels: {
        step: 1
      },
    }],
    yAxis: {
      title: {
        text: null
      },
      labels: {
        formatter: function () {
          return Math.abs(this.value);
        }
      },
      accessibility: {
        description: 'Percentage population',
      }
    },

    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },

    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + ' ' + this.point.category + '</b><br/>' +
          'Emoji Count: ' + Highcharts.numberFormat(Math.abs(this.point.y), 1);
      }
    },
    colors: Constants.COLOR_CODES,
    series: [],
    credits: {
      enabled: false
    },
  }

  constructor() {

  }

  ngOnInit() {
    //TODO: Optimize this code (n^3) complexity
    let toggle = false;
    for (let msgCntAuth of this.messageCountPerAuthor) {
      const emojiCountPerUser = [];
      for (let emoji of this.emojiCategories) {
        let emojiCnt = 0;
        for (let msg of this.messages) {
          if (msg.author == msgCntAuth[0] && msg.message.indexOf(emoji) != -1) {
            emojiCnt++;
          }
        }
        emojiCountPerUser.push(toggle ? emojiCnt : -emojiCnt);
      }

      this.chartOptions.series.push({
        name: msgCntAuth[0],
        data: emojiCountPerUser
      });
      console.log(this.chartOptions.series);

      toggle = !toggle;
    }
    this.updateFlag = true;
  }

}
