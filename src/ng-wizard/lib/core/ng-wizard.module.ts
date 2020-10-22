import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgWizardConfig } from '../utils/interfaces';
import { NG_WIZARD_CONFIG_TOKEN } from './ng-wizard-config.token';
import { NgWizardStepComponent } from './wizard-step/ng-wizard-step.component';
import { NgWizardComponent } from './wizard/ng-wizard.component';
import { NgWizardStepContentDirective } from './ng-wizard-step-content.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [NgWizardComponent, NgWizardStepComponent, NgWizardStepContentDirective],
  exports: [NgWizardComponent, NgWizardStepComponent]
})
export class NgWizardModule {
  /**
   * forRoot
   * @returns A module with its provider dependencies
   */
  static forRoot(ngWizardConfig: NgWizardConfig): ModuleWithProviders<NgWizardModule> {
    return {
      ngModule: NgWizardModule,
      providers: [
        {
          provide: NG_WIZARD_CONFIG_TOKEN,
          useValue: ngWizardConfig
        }
      ]
    };
  }
}
