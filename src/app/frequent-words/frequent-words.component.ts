import { Component, OnInit, Input } from "@angular/core";
import * as Highcharts from "highcharts/highcharts.src.js";
declare var require: any;
const Wordcloud = require("highcharts/modules/wordcloud");
Wordcloud(Highcharts);
import { DataAnalysis } from "../app.component";
import countWords from "count-words-occurrence";
import { title } from "process";

@Component({
  selector: "app-frequent-words",
  templateUrl: "./frequent-words.component.html",
  styleUrls: ["./frequent-words.component.scss"],
})
export class FrequentWordsComponent implements OnInit {
  @Input("authorAnalysis") authorAnalysis: DataAnalysis;

  Highcharts = Highcharts;

  constructor() {}

  chartOptions = {
    title: {
      text: "",
    },
    series: [
      {
        type: "wordcloud",
        placementStrategy: "random",
        name: "Occurrences",
        data: [
          { name: "bad", weight: 1 },
          { name: "change", weight: 2 },
          { name: "collaborative", weight: 1 },
          { name: "flexible", weight: 3 },
        ],
      },
    ],
    credits: {
      enabled: false,
    },
  };

  data: object[];
  authName: "";

  ngOnInit() {
    this.authorAnalysis.wordCount.delete("<Media");
    this.authorAnalysis.wordCount.delete("omitted>");

    let data = [...this.authorAnalysis.wordCount]
      .sort((a, b) => b[1] - a[1])
      .map((kv) => {
        return { name: kv[0], weight: kv[1] };
      })
      .slice(0, 60);
    console.log("data", data);
    this.chartOptions.series[0].data = data;
    this.chartOptions.title.text = this.authorAnalysis.author;
  }
}
