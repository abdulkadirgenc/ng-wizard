import { Component, Inject, forwardRef, ElementRef } from '@angular/core';
import { NgWizardComponent } from '../wizard/ng-wizard.component';

@Component({
  selector: 'header-container',
  templateUrl: './ng-wizard-header.component.html',
  styleUrls: ['./ng-wizard-header.component.css'],
})
export class NgWizardHeaderComponent {

  private _parent: NgWizardComponent;

  constructor(@Inject(forwardRef(() => NgWizardComponent)) parent, public elementRef: ElementRef<any>) {
    this._parent = parent;
  }

  get headerTpl() {return this._parent.pHeaderTpl; }

}
