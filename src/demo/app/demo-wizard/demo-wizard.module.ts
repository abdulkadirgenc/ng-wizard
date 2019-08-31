import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgWizardConfig, NgWizardModule, THEME } from '../../../ng-wizard/public-api'; // BrowserModule no longer breaking here
import { DemoWizardComponent } from './demo-wizard.component';

// routes
export const ROUTES: Routes = [{ path: '', component: DemoWizardComponent }];

// wizzzard
const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [DemoWizardComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgWizardModule.forRoot(ngWizardConfig),
    RouterModule.forChild(ROUTES)
  ]
})
export class DemoWizardModule {}
