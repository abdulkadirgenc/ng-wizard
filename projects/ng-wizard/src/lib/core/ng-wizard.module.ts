import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgWizardComponent } from './ng-wizard.component';
import { NG_WIZARD_CONFIG_TOKEN } from './ng-wizard-config.token';
import { NgWizardConfig } from '../utils/interfaces';

@NgModule({
  declarations: [NgWizardComponent],
  imports: [BrowserModule],
  exports: [NgWizardComponent]
})
export class NgWizardModule {
  /**
   * forRoot
   * @returns A module with its provider dependencies
   */
  static forRoot(ngWizardConfig: NgWizardConfig): ModuleWithProviders {
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
