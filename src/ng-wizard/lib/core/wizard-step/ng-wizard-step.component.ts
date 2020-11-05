import { Component, ComponentFactoryResolver, forwardRef, OnInit, ViewChild } from '@angular/core';
import { STEP_STATE } from '../../utils/enums';
import { NgWizardStep } from '../../utils/interfaces';
import { NgWizardStepContentDirective } from '../ng-wizard-step-content.directive';

@Component({
  selector: 'ng-wizard-step',
  templateUrl: './ng-wizard-step.component.html',
  styleUrls: ['./ng-wizard-step.component.css'],
  providers: [
    { provide: NgWizardStep, useExisting: forwardRef(() => NgWizardStepComponent) }
  ]
})
export class NgWizardStepComponent extends NgWizardStep implements OnInit {
  @ViewChild(NgWizardStepContentDirective, { static: true }) stepContent: NgWizardStepContentDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super();
  }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    if (!this.component) {
      return;
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);

    this.stepContent.viewContainerRef.clear();
    this.componentRef = this.stepContent.viewContainerRef.createComponent(componentFactory);
  }

  get isHidden(): boolean {
    return this.state == STEP_STATE.hidden;
  }
}
