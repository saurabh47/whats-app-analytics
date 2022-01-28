import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts.src.js';
import { Constants } from 'src/assets/constants';

@Component({
  selector: 'app-pie-chart-msg-comp',
  templateUrl: './pie-chart-msg-comp.component.html',
  styleUrls: ['./pie-chart-msg-comp.component.scss']
})
export class PieChartMsgCompComponent implements OnInit {

  @Input('totalMsgCount') totalMsgCount = 0;
  @Input('messageCountPerAuthor') messageCountPerAuthor: Map<String, number>;

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
    // colors: ['#9ECFE0', '#F4AFBF'],
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

    for (let authMsg of this.messageCountPerAuthor) {
      this.chartOptions.series[0].data.push({ name: authMsg[0], 'y': authMsg[1] })
    }


    // this.chartOptions.series[0].data = [{ name: 'Saurabh', 'y': Constants.saurabhMsgCount }, { name: 'Pooja', 'y': Constants.poojaMsgCount }];
    this.updateFlag = true;
  }


}
