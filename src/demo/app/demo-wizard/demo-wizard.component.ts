import { Component, OnInit } from '@angular/core';
import {
  NgWizardConfig,
  NgWizardService,
  StepChangedArgs,
  STEP_STATE,
  THEME
} from '../../../ng-wizard/public-api'; // 'ng-wizard'

import { DemoWizardService, StepDefinition } from './services/demo-wizard.service';

@Component({
  selector: 'app-demo-wizard',
  templateUrl: './demo-wizard.component.html',
  styleUrls: ['./demo-wizard.component.css']
})
export class DemoWizardComponent implements OnInit {
  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        {
          text: 'Finish',
          class: 'btn btn-info',
          event: () => {
            alert('Finished!!!');
          }
        },
        {
          text: 'Reset',
          class: 'btn btn-danger',
          event: () => {
            this.resetWizard();
          }
        }
      ]
    }
  };

  stepChangedArgs: StepChangedArgs;
  selectedTheme: THEME;
  themes = [THEME.default, THEME.arrows, THEME.circles, THEME.dots];
  selectedStepIndex: number;
  stepIndexes = [0, 1, 2, 3, 4, 5, 6];
  stepDefinitions: StepDefinition[] = [];

  constructor(
    private ngWizardService: NgWizardService,
    private demoWizardService: DemoWizardService,
  ) {
    this.stepDefinitions = demoWizardService.stepDefinitions;
  }

  ngOnInit() {
    this.selectedTheme = this.config.theme;
    this.selectedStepIndex = this.config.selected;

    this.ngWizardService.stepChanged()
      .subscribe({
        next: (args) => {
          console.log('catching step change - method 2');
        }
      });
  }

  stepChanged(args: StepChangedArgs) {
    console.log('catching step change - method 1');
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.selectedTheme = this.config.theme;
    this.ngWizardService.reset();
  }

  themeSelected() {
    this.ngWizardService.theme(this.selectedTheme);
  }

  stepIndexSelected() {
    this.ngWizardService.show(this.selectedStepIndex);
  }
}
