import { Injectable, Optional, Inject } from '@angular/core';

import { DEFAULT_CONFIG } from '../utils/constants';
import { NG_WIZARD_CONFIG_TOKEN } from './ng-wizard-config.token';
import { NgWizardConfig } from '../utils/interfaces';
import { Observable, Subject } from 'rxjs';
import { THEME } from '../utils/enums';
import { merge } from '../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class NgWizardService {
  resetWizard$: Observable<any>; //For internal use only.
  showNextStep$: Observable<any>; //For internal use only.
  showPreviousStep$: Observable<any>; //For internal use only.
  setTheme$: Observable<THEME>; //For internal use only.

  private resetWizard: Subject<any>;
  private showNextStep: Subject<any>;
  private showPreviousStep: Subject<any>;
  private setTheme: Subject<THEME>;
  private defaultConfig: NgWizardConfig;

  constructor(@Optional() @Inject(NG_WIZARD_CONFIG_TOKEN) private config: NgWizardConfig) {
    this.defaultConfig = { ...DEFAULT_CONFIG };
    if (this.config) {
      this.defaultConfig = merge(this.defaultConfig, this.config);
    }

    // Observable sources
    this.resetWizard = new Subject<any>();
    this.showNextStep = new Subject<any>();
    this.showPreviousStep = new Subject<any>();
    this.setTheme = new Subject<THEME>();

    // Observable streams
    this.resetWizard$ = this.resetWizard.asObservable();
    this.showNextStep$ = this.showNextStep.asObservable();
    this.showPreviousStep$ = this.showPreviousStep.asObservable();
    this.setTheme$ = this.setTheme.asObservable();
  }

  getDefaultConfig(): NgWizardConfig {
    return { ...this.defaultConfig };
  }

  reset() {
    this.resetWizard.next();
  }

  next() {
    this.showNextStep.next();
  }

  previous() {
    this.showPreviousStep.next();
  }

  theme(theme: THEME) {
    this.setTheme.next(theme);
  }
}
