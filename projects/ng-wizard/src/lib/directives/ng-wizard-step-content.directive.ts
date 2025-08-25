import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngWizardStepContent]',
  standalone: false,
})
export class NgWizardStepContentDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
