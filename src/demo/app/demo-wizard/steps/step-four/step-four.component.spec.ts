import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFourComponent } from './step-four.component';

describe('StepFourComponent', () => {
  let component: StepFourComponent;
  let fixture: ComponentFixture<StepFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
