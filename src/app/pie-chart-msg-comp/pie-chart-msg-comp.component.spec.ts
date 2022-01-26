import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartMsgCompComponent } from './pie-chart-msg-comp.component';

describe('PieChartMsgCompComponent', () => {
  let component: PieChartMsgCompComponent;
  let fixture: ComponentFixture<PieChartMsgCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartMsgCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartMsgCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
