import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // moved ng-wizard from here as now being lazy loaded

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoWizardService } from './demo-wizard/services/demo-wizard.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    DemoWizardService,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
