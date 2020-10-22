import { Component, Injectable, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StepValidationArgs, STEP_STATE } from '../../../../ng-wizard/public-api';

import { StepOneComponent } from '../steps/step-1/step-one.component';
import { StepTwoComponent } from '../steps/step-2/step-two.component';
import { StepThreeComponent } from '../steps/step-3/step-three.component';
import { StepFourComponent } from '../steps/step-4/step-four.component';
import { StepFiveComponent } from '../steps/step-5/step-five.component';
import { StepSixComponent } from '../steps/step-6/step-six.component';

@Injectable()
export class DemoWizardService {
  constructor() {
  }

  isValidTypeBoolean: boolean = true;

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }

  stepDefinitions: StepDefinition[] = [
    {
      title: 'Step 1',
      description: 'Step 1 description',
      component: StepOneComponent,
      canEnter: this.isValidTypeBoolean,
      canExit: this.isValidFunctionReturnsBoolean.bind(this),
    },
    {
      title: 'Step 2',
      description: 'Step 2 description',
      state: STEP_STATE.disabled,
      component: StepTwoComponent,
    },
    {
      title: 'Step 3',
      description: 'Step 3 description',
      component: StepThreeComponent,
      canEnter: this.isValidFunctionReturnsObservable.bind(this),
      canExit: this.isValidFunctionReturnsBoolean.bind(this),
    },
    {
      title: 'Step 4',
      description: 'Step 4 description',
      component: StepFourComponent,
    },
    {
      title: 'Step 5',
      description: 'Step 5 description',
      state: STEP_STATE.hidden,
      component: StepFiveComponent,
    },
  ];
}

export interface StepDefinition {
  title: string;
  description: string;
  state?: STEP_STATE;
  component: Type<any>;
  canEnter?: boolean | ((args: StepValidationArgs) => boolean) | ((args: StepValidationArgs) => Observable<boolean>);
  canExit?: boolean | ((args: StepValidationArgs) => boolean) | ((args: StepValidationArgs) => Observable<boolean>);
}
