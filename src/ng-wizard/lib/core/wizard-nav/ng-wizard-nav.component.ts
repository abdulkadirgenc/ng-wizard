import { Component, ViewEncapsulation, Inject, forwardRef, ElementRef } from '@angular/core';
import { STEP_STATE, STEP_STATUS } from '../../utils/enums';
import { NgWizardStep } from '../../utils/interfaces';
import { NgWizardComponent } from '../wizard/ng-wizard.component';

@Component({
  selector: 'ng-wizard-nav',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './ng-wizard-nav.component.html',
  styleUrls: ['./ng-wizard-nav.component.css'],
})
export class NgWizardNavComponent {
  private _parent: NgWizardComponent;

  constructor(@Inject(forwardRef(() => NgWizardComponent)) parent, public elementRef: ElementRef<any>) {
    this._parent = parent;
  }

  get steps() {return this._parent.steps; }

  _getStepCssClass(selectedStep: NgWizardStep) {
    var stepClass = this._parent.styles.step;

    switch (selectedStep.state) {
      case STEP_STATE.disabled:
        stepClass += ' disabled';
        break;
      case STEP_STATE.error:
        stepClass += ' danger';
        break;
      case STEP_STATE.hidden:
        stepClass += ' hidden';
        break;
    }

    switch (selectedStep.status) {
      case STEP_STATUS.done:
        stepClass += ' done';
        break;
      case STEP_STATUS.active:
        stepClass += ' active';
        break;
    }

    return stepClass;
  }

  _showSelectedStep(event: Event, selectedStep: NgWizardStep) {
    event.preventDefault();

    if (!this._parent.config.anchorSettings.anchorClickable) {
      return;
    }

    if (!this._parent.config.anchorSettings.enableAnchorOnDoneStep && selectedStep.status == STEP_STATUS.done) {
      return true;
    }

    if (selectedStep.index != this._parent.current_index) {
      if (this._parent.config.anchorSettings.enableAllAnchors && this._parent.config.anchorSettings.anchorClickable) {
        this._parent._showStep(selectedStep.index);
      }
      else {
        if (selectedStep.status == STEP_STATUS.done) {
          this._parent._showStep(selectedStep.index);
        }
      }
    }
  }
}
