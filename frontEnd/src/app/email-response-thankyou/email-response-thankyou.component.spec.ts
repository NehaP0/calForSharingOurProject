import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailResponseThankyouComponent } from './email-response-thankyou.component';

describe('EmailResponseThankyouComponent', () => {
  let component: EmailResponseThankyouComponent;
  let fixture: ComponentFixture<EmailResponseThankyouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailResponseThankyouComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailResponseThankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
