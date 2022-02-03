import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DailyChatsAnlysisComponent } from './daily-chats-anlysis/daily-chats-anlysis.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { PieChartMsgCompComponent } from './pie-chart-msg-comp/pie-chart-msg-comp.component';
import { EmojiBarChartComponent } from './emoji-bar-chart/emoji-bar-chart.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HourlyMsgCntBarChartComponent } from './hourly-msg-cnt-bar-chart/hourly-msg-cnt-bar-chart.component';
import { WeekDayMsgCntBarChartComponent } from './week-day-msg-cnt-bar-chart/week-day-msg-cnt-bar-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { FrequentWordsComponent } from "./frequent-words/frequent-words.component";
import { AngularD3CloudModule } from "angular-d3-cloud";

@NgModule({
  declarations: [
    AppComponent,
    DailyChatsAnlysisComponent,
    PieChartMsgCompComponent,
    EmojiBarChartComponent,
    HourlyMsgCntBarChartComponent,
    WeekDayMsgCntBarChartComponent,
    FrequentWordsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularD3CloudModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
