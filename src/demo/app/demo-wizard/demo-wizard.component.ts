import { Component, OnInit } from '@angular/core';
import {
  NgWizardConfig,
  NgWizardService,
  StepChangedArgs,
  STEP_STATE,
  THEME
} from '../../../ng-wizard/public-api'; // 'ng-wizard'

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
  selectedtheme: THEME;
  themes = [THEME.default, THEME.arrows, THEME.circles, THEME.dots];

  constructor(private ngWizardService: NgWizardService) {
  }

  ngOnInit() {
    this.selectedtheme = this.config.theme;

    this.ngWizardService.stepChanged()
      .subscribe({
        next: (args) => this.setStepChangedArgs(args)
      });
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.selectedtheme = this.config.theme;
    this.ngWizardService.reset();
  }

  themeSelected() {
    this.ngWizardService.theme(this.selectedtheme);
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step);

    // this.setStepChangedArgs(args);
  }

  private setStepChangedArgs(args: StepChangedArgs) {
    args.step ? (<any>args.step).__ngContext__ = undefined : {};
    args.previousStep ? (<any>args.previousStep).__ngContext__ = undefined : {};

    setTimeout(() => {
      this.stepChangedArgs = args;
    }, 0);
  }
}
