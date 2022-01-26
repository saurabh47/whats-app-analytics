import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts.src.js';

@Component({
  selector: 'app-emoji-bar-chart',
  templateUrl: './emoji-bar-chart.component.html',
  styleUrls: ['./emoji-bar-chart.component.scss']
})
export class EmojiBarChartComponent implements OnInit {
  updateFlag = true;
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  chartCallback = (chart) => {
      setTimeout(() => {
        chart.reflow();
      }, 0);
    };

  categories = [
  '❤️','😘','😍','🤣','😅','😂'
];

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
        categories: this.categories,
        reversed: false,
        labels: {
            step: 1
        },
    }, { // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: this.categories,
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
            return '<b>' + this.series.name +' '+ this.point.category + '</b><br/>' +
                'Emoji Count: ' + Highcharts.numberFormat(Math.abs(this.point.y), 1);
        }
    },
    colors: ['#9ECFE0', '#F4AFBF'],

    series: [{
        name: 'Saurabh',
        data: [
            -2,-11,-30,-196,-571,-1156
        ]
    }, {
        name: 'Pooja',
        data: [
           7,17,61,38,239,896
        ]
    }],
    credits: {
      enabled: false
    },
}

  constructor() { }

  ngOnInit() {
  }

}
