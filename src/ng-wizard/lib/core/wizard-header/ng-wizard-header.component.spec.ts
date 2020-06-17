import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgWizardHeaderComponent } from './ng-wizard-header.component';

describe('NgWizardHeaderComponent', () => {
  let component: NgWizardHeaderComponent;
  let fixture: ComponentFixture<NgWizardHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgWizardHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgWizardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
