import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyMsgCntBarChartComponent } from './hourly-msg-cnt-bar-chart.component';

describe('HourlyMsgCntBarChartComponent', () => {
  let component: HourlyMsgCntBarChartComponent;
  let fixture: ComponentFixture<HourlyMsgCntBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyMsgCntBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyMsgCntBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
