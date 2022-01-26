import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiBarChartComponent } from './emoji-bar-chart.component';

describe('EmojiBarChartComponent', () => {
  let component: EmojiBarChartComponent;
  let fixture: ComponentFixture<EmojiBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmojiBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojiBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
