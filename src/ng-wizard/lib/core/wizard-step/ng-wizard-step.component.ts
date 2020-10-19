import { Component, forwardRef } from '@angular/core';
import { STEP_STATE } from '../../utils/enums';
import { NgWizardStep } from '../../utils/interfaces';

@Component({
  selector: 'ng-wizard-step',
  templateUrl: './ng-wizard-step.component.html',
  styleUrls: ['./ng-wizard-step.component.css'],
  providers: [
    { provide: NgWizardStep, useExisting: forwardRef(() => NgWizardStepComponent) }
  ]
})
export class NgWizardStepComponent extends NgWizardStep {
  get isHidden(): boolean {
    return this.state == STEP_STATE.hidden;
  }
}
