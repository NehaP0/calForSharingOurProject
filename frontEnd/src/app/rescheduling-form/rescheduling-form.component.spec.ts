import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReschedulingFormComponent } from './rescheduling-form.component';

describe('ReschedulingFormComponent', () => {
  let component: ReschedulingFormComponent;
  let fixture: ComponentFixture<ReschedulingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReschedulingFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReschedulingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
