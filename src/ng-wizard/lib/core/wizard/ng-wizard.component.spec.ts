import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgWizardComponent } from './ng-wizard.component';

describe('NgWizardComponent', () => {
  let component: NgWizardComponent;
  let fixture: ComponentFixture<NgWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
