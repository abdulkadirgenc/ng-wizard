import { Component } from '@angular/core';
import { NgWizardStep, NgWizardConfig } from 'projects/ng-wizard/src/lib/utils/interfaces';
import { THEME } from 'projects/ng-wizard/src/lib/utils/enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-wizard-app';

  steps: NgWizardStep[] = [
    {
      title: 'Step 1 Title',
      description: 'Step 1 description',
      content: 'Step 1 Content'
    },
    {
      title: 'Step 2 Title',
      description: 'Step 2 description',
      content: 'Step 2 Content'
    },
    {
      title: 'Step 3 Title',
      description: 'Step 3 description',
      content: 'Step 3 Content'
    },
    {
      title: 'Step 4 Title',
      description: 'Step 4 description',
      content: 'Step 4 Content'
    },
    {
      title: 'Step 5 Title',
      description: 'Step 5 description',
      content: 'Step 5 Content'
    },
  ];

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.circles,
    errorSteps: [1],
    disabledSteps: [2],
    hiddenSteps: [3],
    toolbarSettings: {
      toolbarExtraButtons: [{ text: 'Finish', class: 'btn btn-info' }, { text: 'Cancel', class: 'btn btn-danger' }]
    }
  };
}
