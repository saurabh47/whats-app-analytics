import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekDayMsgCntBarChartComponent } from './week-day-msg-cnt-bar-chart.component';

describe('WeekDayMsgCntBarChartComponent', () => {
  let component: WeekDayMsgCntBarChartComponent;
  let fixture: ComponentFixture<WeekDayMsgCntBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekDayMsgCntBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekDayMsgCntBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
