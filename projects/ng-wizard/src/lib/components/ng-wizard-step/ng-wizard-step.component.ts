import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { NgWizardStepContentDirective } from '../../directives/ng-wizard-step-content.directive';
import { STEP_STATE } from '../../utils/enums';
import { NgWizardStep } from '../../utils/interfaces';

@Component({
  selector: 'ng-wizard-step',
  templateUrl: './ng-wizard-step.component.html',
  styleUrls: ['./ng-wizard-step.component.scss'],
  providers: [
    {
      provide: NgWizardStep,
      useExisting: forwardRef(() => NgWizardStepComponent),
    },
  ],
  standalone: false,
})
export class NgWizardStepComponent extends NgWizardStep implements OnInit {
  @ViewChild(NgWizardStepContentDirective, { static: true })
  stepContent: NgWizardStepContentDirective;

  constructor() {
    super();
  }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    if (!this.component) {
      return;
    }

    this.stepContent.viewContainerRef.clear();
    this.componentRef = this.stepContent.viewContainerRef.createComponent(
      this.component
    );
  }

  get isHidden(): boolean {
    return this.state == STEP_STATE.hidden;
  }
}
