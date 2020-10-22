import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgWizardModule, NgWizardConfig, THEME } from '../../../ng-wizard/public-api'; // BrowserModule no longer breaking here

import { DemoWizardComponent } from './demo-wizard.component';
import { StepOneComponent } from './steps/step-one/step-one.component';
import { StepTwoComponent } from './steps/step-two/step-two.component';
import { StepThreeComponent } from './steps/step-three/step-three.component';
import { StepFourComponent } from './steps/step-four/step-four.component';
import { StepFiveComponent } from './steps/step-five/step-five.component';
import { StepSixComponent } from './steps/step-six/step-six.component';
import { StepSevenComponent } from './steps/step-seven/step-seven.component';

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
    StepSevenComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgWizardModule.forRoot(ngWizardConfig),
    RouterModule.forChild(ROUTES),
  ]
})
export class DemoWizardModule { }
