import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouRescheduledComponent } from './thankyou-rescheduled.component';

describe('ThankyouRescheduledComponent', () => {
  let component: ThankyouRescheduledComponent;
  let fixture: ComponentFixture<ThankyouRescheduledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThankyouRescheduledComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThankyouRescheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
