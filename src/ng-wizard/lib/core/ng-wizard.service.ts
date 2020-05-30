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
    this.ngWizardDataService.resetWizard.next();
  }

  next() {
    this.ngWizardDataService.showNextStep.next();
  }

  previous() {
    this.ngWizardDataService.showPreviousStep.next();
  }

  theme(theme: THEME) {
    this.ngWizardDataService.setTheme.next(theme);
  }

  stepChanged(): Observable<StepChangedArgs> {
    return this.ngWizardDataService.stepChangedArgs.asObservable()
  }
}
