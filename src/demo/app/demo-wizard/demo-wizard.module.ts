import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgWizardModule, NgWizardConfig, THEME } from '../../../ng-wizard/public-api'; // BrowserModule no longer breaking here

import { DemoWizardComponent } from './demo-wizard.component';
import { StepOneComponent } from './steps/step-1/step-one.component';
import { StepTwoComponent } from './steps/step-2/step-two.component';
import { StepThreeComponent } from './steps/step-3/step-three.component';
import { StepFourComponent } from './steps/step-4/step-four.component';
import { StepFiveComponent } from './steps/step-5/step-five.component';
import { StepSixComponent } from './steps/step-6/step-six.component';

// routes
export const ROUTES: Routes = [{ path: '', component: DemoWizardComponent }];

// wizard
const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    DemoWizardComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgWizardModule.forRoot(ngWizardConfig),
    RouterModule.forChild(ROUTES),
  ]
})
export class DemoWizardModule { }
