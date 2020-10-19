import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgWizardConfig } from '../utils/interfaces';
import { NG_WIZARD_CONFIG_TOKEN } from './ng-wizard-config.token';
import { NgWizardStepComponent } from './wizard-step/ng-wizard-step.component';
import { NgWizardComponent } from './wizard/ng-wizard.component';
import { NgWizardNavComponent } from './wizard-nav/ng-wizard-nav.component';
import { NgWizardHeaderComponent } from './wizard-header/ng-wizard-header.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgWizardComponent, NgWizardStepComponent, NgWizardNavComponent, NgWizardHeaderComponent],
  exports: [NgWizardComponent, NgWizardStepComponent, NgWizardNavComponent, NgWizardHeaderComponent]
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
