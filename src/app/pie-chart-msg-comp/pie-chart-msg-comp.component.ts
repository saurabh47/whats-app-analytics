import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts.src.js';
import { COLOR_CODES } from 'src/@common/constant/config';
import { DataAnalysis } from '../app.component';

@Component({
  selector: 'app-pie-chart-msg-comp',
  templateUrl: './pie-chart-msg-comp.component.html',
  styleUrls: ['./pie-chart-msg-comp.component.scss']
})
export class PieChartMsgCompComponent implements OnInit {

  @Input('totalMsgCount') totalMsgCount = 0;
  @Input('analysisPerAuthor') analysisPerAuthor:  Map<String, DataAnalysis> = new Map();

  updateFlag = true;
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  data = [];
  chartCallback = (chart) => {
    setTimeout(() => {
      chart.reflow();
    }, 0);
  };

  chartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: '#fafafa',
    },
    title: {
      text: `Total Messages ${this.totalMsgCount}`
    },
    subtitle: {
      // text: 'Saurabh Vs Pooja'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 25,
        dataLabels: {
          enabled: true,
          formatter: () => {
            //console.log(this);
            // return this.util.dataLabelFormatter(data.series,data.point,data.y);
          },
          useHTML: true,
          style: {
            fontFamily: 'roboto'
          },
          distance: 5
        },
        showInLegend: true,
        innerSize: 100
      }
    },
    colors: COLOR_CODES,
    series: [{
      type: 'pie',
      name: 'Messages',
      innerSize: '50%',
      data: []
    }],
    credits: {
      enabled: false
    },
  };
  constructor() { }

  ngOnInit() {
    this.chartOptions.title.text = `Total Messages ${this.totalMsgCount}`;

    this.chartOptions.series[0].data = [];

    for (let analysis of this.analysisPerAuthor) {
      this.chartOptions.series[0].data.push({ name: analysis[0], 'y': analysis[1].messageCount })
    }

    this.updateFlag = true;
  }


}
