# Disclaimer

This wizard is derived from [abdulkadirgenc/ng-wizard](https://github.com/abdulkadirgenc/ng-wizard), which currently has a [bug](https://github.com/abdulkadirgenc/ng-wizard/issues/1) that breaks lazy loading of modules when the wizard is outside of the main `AppComponent`. This package is temporarily published here until the [issue](https://github.com/abdulkadirgenc/ng-wizard/issues/1) is resolved. I intend to redirect this package to the original once the [PR](https://github.com/abdulkadirgenc/ng-wizard/pull/2) has been accepted and package updated on npm.

# ng-wizard

ng-wizard is a stepper / wizard component that you can use in your Angular applications. You can access the sample demo project **[by clicking here](https://ng-wizard.stackblitz.io)**.

## Screenshots

![Default](/Screenshots/1_default.png)

![Arrows](/Screenshots/2_arrows.png)

![Circles](/Screenshots/3_circles.png)

![Dots](/Screenshots/4_dots.png)

## Dependencies

- [Bootstrap 4](https://getbootstrap.com/docs/4.3/getting-started/download/)

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
  imports: [NgWizardModule.forRoot(ngWizardConfig)]
})
export class AppModule {}
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

```
...
```

## License

[MIT License](https://github.com/abdulkadirgenc/ng-wizard/blob/master/LICENSE)
