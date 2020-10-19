import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgWizardNavComponent } from './ng-wizard-nav.component';

describe('NgWizardNavComponent', () => {
  let component: NgWizardNavComponent;
  let fixture: ComponentFixture<NgWizardNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgWizardNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgWizardNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
