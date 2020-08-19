import { Injectable } from '@angular/core';

import { NgWizardDataService } from './ng-wizard-data.service';
import { THEME } from '../utils/enums';
import { Observable } from 'rxjs';
import { StepChangedArgs } from '../utils/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NgWizardService {
  constructor(
    private ngWizardDataService: NgWizardDataService
  ) {
  }

  reset() {
    this.ngWizardDataService.resetWizard();
  }

  next() {
    this.ngWizardDataService.showNextStep();
  }

  previous() {
    this.ngWizardDataService.showPreviousStep();
  }

  show(index: number) {
    this.ngWizardDataService.showStep(index);
  }

  theme(theme: THEME) {
    this.ngWizardDataService.setTheme(theme);
  }

  stepChanged(): Observable<StepChangedArgs> {
    return this.ngWizardDataService.stepChangedArgs$;
  }
}
