import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyChatsAnlysisComponent } from './daily-chats-anlysis.component';

describe('DailyChatsAnlysisComponent', () => {
  let component: DailyChatsAnlysisComponent;
  let fixture: ComponentFixture<DailyChatsAnlysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyChatsAnlysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyChatsAnlysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
