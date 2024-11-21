import { Injectable, Type } from '@angular/core';
import { Observable, isObservable } from 'rxjs';
import {
  NgWizardConfig,
  THEME,
  STEP_STATE,
  StepValidationArgs,
} from '../../../../projects/ng-wizard/src/public-api';
import { StepOneComponent } from '../components/steps/step-1/step-one.component';
import { StepTwoComponent } from '../components/steps/step-2/step-two.component';
import { StepThreeComponent } from '../components/steps/step-3/step-three.component';
import { StepFourComponent } from '../components/steps/step-4/step-four.component';
import { StepFiveComponent } from '../components/steps/step-5/step-five.component';

@Injectable({
  providedIn: 'root',
})
export class DemoWizardService {
  constructor() {}

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        {
          text: 'Finish',
          class: 'btn btn-info',
          event: () => alert('Finished!!!'),
        },
      ],
    },
  };

  stepDefinitions: StepDefinition[] = [
    {
      title: 'Step 1',
      description: 'Step 1 description',
      component: StepOneComponent,
      canEnter: this.validateStep.bind(this, 'entry'),
      canExit: this.validateStep.bind(this, 'exit'),
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
      canEnter: this.validateStep.bind(this, 'entry'),
      canExit: this.validateStep.bind(this, 'exit'),
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

  private validateStep(type: string, args: StepValidationArgs) {
    let step = type == 'entry' ? args.toStep : args.fromStep;
    let stepSpecificValidateMethod;

    if (step && step.componentRef) {
      stepSpecificValidateMethod =
        type == 'entry'
          ? step.componentRef.instance.validateEntryToStep
          : step.componentRef.instance.validateExitFromStep;
    }

    if (stepSpecificValidateMethod) {
      if (typeof stepSpecificValidateMethod === typeof true) {
        return <boolean>stepSpecificValidateMethod;
      } else if (stepSpecificValidateMethod instanceof Function) {
        stepSpecificValidateMethod = stepSpecificValidateMethod.bind(
          step.componentRef.instance
        );
        let result = stepSpecificValidateMethod();

        if (isObservable(result)) {
          return <Observable<boolean>>result;
        } else if (typeof result === typeof true) {
          return <boolean>result;
        }
      }
    }

    return true;
  }
}

export interface StepDefinition {
  title: string;
  description: string;
  state?: STEP_STATE;
  component: Type<any>;
  canEnter?: (args: StepValidationArgs) => boolean | Observable<boolean>;
  canExit?: (args: StepValidationArgs) => boolean | Observable<boolean>;
}
