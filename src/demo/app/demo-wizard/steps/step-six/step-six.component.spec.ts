import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSixComponent } from './step-six.component';

describe('StepSixComponent', () => {
  let component: StepSixComponent;
  let fixture: ComponentFixture<StepSixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepSixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
