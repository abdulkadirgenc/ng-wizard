import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngWizardStepContent]'
})
export class NgWizardStepContentDirective {
  constructor(
    public viewContainerRef: ViewContainerRef,
  ) {
  }
}
