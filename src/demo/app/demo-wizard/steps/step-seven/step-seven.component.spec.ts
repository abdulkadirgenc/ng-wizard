import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSevenComponent } from './step-seven.component';

describe('StepSevenComponent', () => {
  let component: StepSevenComponent;
  let fixture: ComponentFixture<StepSevenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepSevenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepSevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
