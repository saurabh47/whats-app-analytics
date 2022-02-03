import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequentWordsComponent } from './frequent-words.component';

describe('FrequentWordsComponent', () => {
  let component: FrequentWordsComponent;
  let fixture: ComponentFixture<FrequentWordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequentWordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequentWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
