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

@NgModule({
  declarations: [
    AppComponent,
    DailyChatsAnlysisComponent,
    PieChartMsgCompComponent,
    EmojiBarChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
