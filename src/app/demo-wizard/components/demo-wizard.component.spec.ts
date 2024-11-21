import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoWizardComponent } from '../demo-wizard.component';

describe('DemoWizardComponent', () => {
  let component: DemoWizardComponent;
  let fixture: ComponentFixture<DemoWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoWizardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
