import { Component } from '@angular/core';
import { NgWizardStepDef, NgWizardConfig, NgWizardStep } from 'projects/ng-wizard/src/lib/utils/interfaces';
import { THEME, STEP_STATE } from 'projects/ng-wizard/src/lib/utils/enums';
import { NgWizardService } from 'projects/ng-wizard/src/lib/core/ng-wizard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  steps: NgWizardStepDef[] = [
    {
      title: 'Step 1',
      description: 'Step 1 description',
      content: 'Step 1 Content',
      event: this.stepSelected,
    },
    {
      title: 'Step 2',
      description: 'Step 2 description',
      content: 'Step 2 Content',
      state: STEP_STATE.error,
      event: this.stepSelected,
    },
    {
      title: 'Step 3',
      description: 'Step 3 description',
      content: 'Step 3 Content',
      state: STEP_STATE.disabled,
      event: this.stepSelected,
    },
    {
      title: 'Step 4',
      description: 'Step 4 description',
      content: 'Step 4 Content',
      state: STEP_STATE.hidden,
      event: this.stepSelected,
    },
    {
      title: 'Step 5',
      description: 'Step 5 description',
      content: 'Step 5 Content',
      event: this.stepSelected,
    },
  ];

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Finish', class: 'btn btn-info', event: () => { alert("Finished!!!"); } },
        { text: 'Cancel', class: 'btn btn-danger', event: () => { this.resetWizard(); } }]
    }
  };

  selectedtheme: THEME;
  themes = [THEME.default, THEME.arrows, THEME.circles, THEME.dots];

  constructor(private ngWizardService: NgWizardService) {
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  themeSelected() {
    this.ngWizardService.theme(this.selectedtheme);
  }

  selectedStep: NgWizardStep;
  stepSelected(step: NgWizardStep) {
    console.log(step);
    this.selectedStep = step;
  }
}
