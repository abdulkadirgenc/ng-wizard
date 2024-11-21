import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {
  NgWizardConfig,
  NgWizardModule,
  THEME,
} from '../../../projects/ng-wizard/src/public-api';
import { DemoWizardComponent } from './components/demo-wizard.component';
import { StepOneComponent } from './components/steps/step-1/step-one.component';
import { StepTwoComponent } from './components/steps/step-2/step-two.component';
import { StepThreeComponent } from './components/steps/step-3/step-three.component';
import { StepFourComponent } from './components/steps/step-4/step-four.component';
import { StepFiveComponent } from './components/steps/step-5/step-five.component';
import { StepSixComponent } from './components/steps/step-6/step-six.component';

// routes
export const ROUTES: Routes = [{ path: '', component: DemoWizardComponent }];

// wizard
const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default,
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
  ],
})
export class DemoWizardModule {}
