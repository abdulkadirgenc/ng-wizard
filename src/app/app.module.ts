import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgWizardModule } from 'projects/ng-wizard/src/public-api';
import { NgWizardConfig } from 'projects/ng-wizard/src/lib/utils/interfaces';
import { THEME } from 'projects/ng-wizard/src/lib/utils/enums';

const ngWizardConfig: NgWizardConfig = {
  selected: 3,
  theme: THEME.arrows,
  //disabledSteps: [0],
  errorSteps: [1],
  //hiddenSteps: [2],
  toolbarSettings: {
    toolbarExtraButtons: [{ text: 'Finish', class: 'btn btn-info' }, { text: 'Cancel', class: 'btn btn-danger' }]
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgWizardModule.forRoot(ngWizardConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
