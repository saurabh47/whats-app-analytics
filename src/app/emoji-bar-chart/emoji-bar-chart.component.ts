import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts.src.js';
import { COLOR_CODES } from 'src/@common/constant/config';
import { Message } from 'whatsapp-chat-parser/types/types';
import { DataAnalysis } from '../app.component';

@Component({
  selector: 'app-emoji-bar-chart',
  templateUrl: './emoji-bar-chart.component.html',
  styleUrls: ['./emoji-bar-chart.component.scss']
})
export class EmojiBarChartComponent implements OnInit {

  @Input('analysisPerAuthor') analysisPerAuthor: Map<String, DataAnalysis> = new Map();

  //['❤️', '😘', '😍', '🤣', '😅', '😂', '👍'];

  emojiCategories = []; 


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
      type: 'column',
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
    xAxis: {
      categories: this.emojiCategories,
      reversed: false,
      labels: {
        step: 1
      },
    },
    yAxis: {
      title: {
        text: "No. of emoji's"
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
        let tooltip = `${this.points[0].x}<br/><br/>`;
        for(let point of this.points) {
          tooltip+= `<b>${point.series.name} : ${point.y} </b><br/>`
        }
        tooltip+= `<b> Total Emoji Count : ${this.points[0].total} </b>`;
        return tooltip
      },
      shared: true
    },
    colors: COLOR_CODES,
    series: [],
    credits: {
      enabled: false
    },
  }

  constructor() {

  }

  ngOnInit() {

    const totalEmojisCntMap: Map<string,number> = new Map();

    for (let analysis of this.analysisPerAuthor) { 
      for(let emoji in analysis[1].emojiCountMap){
        totalEmojisCntMap.set(emoji,(totalEmojisCntMap.get(emoji) || 0 ) +  analysis[1].emojiCountMap[emoji])
      }
    }

    totalEmojisCntMap.delete("🏻"); // Remove invalid emoji
    // get top 7 emojis used
    const topEmojis = [...totalEmojisCntMap.entries()].sort((a, b) => b[1] - a[1]).map(kv => kv[0]).slice(0,7);

    this.emojiCategories = topEmojis;

    this.chartOptions.xAxis.categories = this.emojiCategories;

    console.log(topEmojis)

    for (let analysis of this.analysisPerAuthor) {
      const emojiCountPerUser = [];
      for (let emoji of this.emojiCategories) {
        let emojiCnt = analysis[1].emojiCountMap[emoji] || 0;
        
        emojiCountPerUser.push(emojiCnt);
      }

      this.chartOptions.series.push({
        name: analysis[0],
        data: emojiCountPerUser
      });
    }
    this.updateFlag = true;
  }

}
