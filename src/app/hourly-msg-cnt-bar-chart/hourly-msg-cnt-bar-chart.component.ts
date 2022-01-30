import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts.src';
import { COLOR_CODES } from 'src/@common/constant/config';
import { DataAnalysis } from '../app.component';

@Component({
  selector: 'app-hourly-msg-cnt-bar-chart',
  templateUrl: './hourly-msg-cnt-bar-chart.component.html',
  styleUrls: ['./hourly-msg-cnt-bar-chart.component.scss']
})
export class HourlyMsgCntBarChartComponent implements OnInit {

  @Input('analysisPerAuthor') analysisPerAuthor: Map<String, DataAnalysis> = new Map();

  hourlyCategories = ['0', '1', '2', '3', '4', '5', '6', '7', '8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];


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
      text: "Total Messages by Hour of Day"
    },

    // accessibility: {
    //   point: {
    //     valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.'
    //   }
    // },
    xAxis: [{
      title: {
        text: 'Hour'
      },
      categories: this.hourlyCategories,
      reversed: false,
      labels: {
        step: 1
      },
    }],
    yAxis: {
      title: {
        text: 'No. of messages'
      },
      labels: {
        formatter: function () {
          return Math.abs(this.value);
        }
      },
    },

    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    tooltip: {
      formatter: function () {
        let tooltip = '';
        for(let point of this.points) {
          tooltip+= `<b> ${point.series.name} : ${point.y} </b><br/>`
        }
        tooltip+= `<b> Total Messages Count : ${this.points[0].total} </b>`;
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
    for (let analysis of this.analysisPerAuthor) {
      this.chartOptions.series.push({
        name: analysis[1].author,
        data: analysis[1].hourlyMessageCount
      });
    }
    this.updateFlag = true;
  }
}
