import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgWizardStepContentDirective } from './lib/directives/ng-wizard-step-content.directive';
import { NG_WIZARD_CONFIG_TOKEN } from './lib/ng-wizard-config.token';
import { NgWizardComponent } from './lib/components/ng-wizard/ng-wizard.component';
import { NgWizardStepComponent } from './lib/components/ng-wizard-step/ng-wizard-step.component';
import { NgWizardConfig } from './lib/utils/interfaces';

@NgModule({
  imports: [CommonModule],
  declarations: [
    NgWizardComponent,
    NgWizardStepComponent,
    NgWizardStepContentDirective,
  ],
  exports: [NgWizardComponent, NgWizardStepComponent],
})
export class NgWizardModule {
  static forRoot(
    ngWizardConfig: NgWizardConfig
  ): ModuleWithProviders<NgWizardModule> {
    return {
      ngModule: NgWizardModule,
      providers: [
        {
          provide: NG_WIZARD_CONFIG_TOKEN,
          useValue: ngWizardConfig,
        },
      ],
    };
  }
}
