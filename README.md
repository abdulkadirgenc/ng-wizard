# ng-wizard
ng-wizard is a stepper / wizard component that you can use in your Angular applications. You can access the sample demo project **[by clicking here](https://ng-wizard.stackblitz.io)**.

## Screenshots

![Default](/Screenshots/1_default.png)

![Arrows](/Screenshots/2_arrows.png)

![Circles](/Screenshots/3_circles.png)

![Dots](/Screenshots/4_dots.png)

## Dependencies
+ [Bootstrap 4](https://getbootstrap.com/docs/4.3/getting-started/download/)


## Getting started
Install **ng-wizard** through npm:
```
$ npm install --save ng-wizard
```

Include **bootstrap** CSS file (skip if already imported):
```css
@import '~bootstrap/dist/css/bootstrap.min.css';
```

Include **ng-wizard** CSS files:
```css
/* Mandatory */
@import '~ng-wizard/themes/ng_wizard.min.css';

/* Optional */
/* If a theme other than default is used, the css file for that theme is required. */
@import '~ng-wizard/themes/ng_wizard_theme_arrows.min.css';
@import '~ng-wizard/themes/ng_wizard_theme_circles.min.css';
@import '~ng-wizard/themes/ng_wizard_theme_dots.min.css';
```

Import the **ng-wizard module** into your apps module:
```typescript
import { NgModule } from '@angular/core';

import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  imports: [
    NgWizardModule.forRoot(ngWizardConfig)
  ]
})
export class AppModule { }
```

Add an **ng-wizard** component to the html template of your component:
```html
<ng-wizard [config]="config" (stepChanged)="stepChanged($event)">

    <ng-wizard-step [title]="'Step 1'" [description]="'Step 1 description'">
        <span>Step 1 content</span>
    </ng-wizard-step>

    <ng-wizard-step [title]="'Step 2'" [description]="'Step 2 description'">
        <span>Step 2 content</span>
    </ng-wizard-step>

    <ng-wizard-step [title]="'Step 3'" [description]="'Step 3 description'">
        <span>Step 3 content</span>
    </ng-wizard-step>

    <ng-wizard-step [title]="'Step 4'" [description]="'Step 4 description'">
        <span>Step 4 content</span>
    </ng-wizard-step>

</ng-wizard>
```


`[config]` is an optional parameter for **ng-wizard** component.

If you want to override **ng-wizard** default configuration defined in **apps module** for a specific component, define `[config]` parameter in your **\*\*\*.component.ts** file:
```typescript
import { Component, OnInit } from '@angular/core';
import { NgWizardConfig, THEME, StepChangedArgs, NgWizardService } from 'ng-wizard';

@Component({
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Finish', class: 'btn btn-info', event: () => { alert("Finished!!!"); } }
    }
  };

  constructor(private ngWizardService: NgWizardService) {
  }

  ngOnInit() {
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

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
  }
}

```

## Configuration
#### `NgWizardConfig` properties:

| Name            | Type                                 | Default Value                                                                                                                                                                 | Description                                                                  |
| --------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| selected        | `number`                             | `0`                                                                                                                                                                           | Initial selected step                                                        |
| keyNavigation   | `boolean`                            | `true`                                                                                                                                                                        | Enable/Disable keyboard navigation (left and right keys are used if enabled) |
| cycleSteps      | `boolean`                            | `false`                                                                                                                                                                       | Allows to cycle the navigation of steps                                      |
| lang            | `{ next: string, previous: string }` | `{ next: 'Next', previous: 'Previous' }`                                                                                                                                      | Language variables for buttons                                               |
| toolbarSettings | `ToolbarSettings`                    | `{ toolbarPosition: TOOLBAR_POSITION.bottom, toolbarButtonPosition: TOOLBAR_BUTTON_POSITION.end, showNextButton: true, showPreviousButton: true, toolbarExtraButtons: [] }`   | Toolbar settings                                                             |
| anchorSettings  | `AnchorSettings`                     | `{ anchorClickable: true, enableAllAnchors: false, markDoneStep: true, markAllPreviousStepsAsDone: true, removeDoneStepOnNavigateBack: false, enableAnchorOnDoneStep: true }` | Anchor settings                                                              |
| theme           | `THEME`                              | `THEME.default`                                                                                                                                                               | Wizard theme (default, arrows, circles, dots)                                |

#### `ToolbarSettings` properties:

| Name                  | Type                      | Default Value                 | Description                                                       |
| --------------------- | ------------------------- | ----------------------------- | ----------------------------------------------------------------- |
| toolbarPosition       | `TOOLBAR_POSITION`        | `TOOLBAR_POSITION.bottom`     | Toolbar position (none, top, bottom, both)                        |
| toolbarButtonPosition | `TOOLBAR_BUTTON_POSITION` | `TOOLBAR_BUTTON_POSITION.end` | Toolbar button position (start, end)                              |
| showNextButton        | `boolean`                 | `true`                        | show/hide Next button                                             |
| showPreviousButton    | `boolean`                 | `true`                        | show/hide Previous button                                         |
| toolbarExtraButtons   | `ToolbarButton[]`         | `[]`                          | Extra buttons to show on toolbar, array of input/buttons elements |

#### `AnchorSettings` properties:

| Name                         | Type        | Default Value | Description                                                     |
| ---------------------------- | ----------- | ------------- | --------------------------------------------------------------- |
| anchorClickable              | `boolean`   | `true`        | Enable/Disable anchor navigation                                |
| enableAllAnchors             | `boolean`   | `false`       | Activates all anchors clickable all times                       |
| markDoneStep                 | `boolean`   | `true`        | Add done css                                                    |
| markAllPreviousStepsAsDone   | `boolean`   | `true`        | When a step selected, all previous steps are marked done        |
| removeDoneStepOnNavigateBack | `boolean`   | `false`       | While navigate back done step after active step will be cleared |
| enableAnchorOnDoneStep       | `boolean[]` | `true`        | Enable/Disable the done steps navigation                        |

## Thanks
This component was created by rewriting the [jQuery Smart Wizard 4](https://github.com/techlab/SmartWizard) in Angular. Thanks to [TechLaboratory](http://www.techlaboratory.net/) for **.Css** files.

## License
[MIT License](https://github.com/abdulkadirgenc/ng-wizard/blob/master/LICENSE)
