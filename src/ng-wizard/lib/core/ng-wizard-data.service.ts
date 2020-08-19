import { Injectable, Optional, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { DEFAULT_CONFIG } from '../utils/constants';
import { NG_WIZARD_CONFIG_TOKEN } from './ng-wizard-config.token';
import { NgWizardConfig, StepChangedArgs } from '../utils/interfaces';
import { THEME } from '../utils/enums';
import { merge } from '../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class NgWizardDataService {
  resetWizard$: Observable<any>;
  showNextStep$: Observable<any>;
  showPreviousStep$: Observable<any>;
  showStep$: Observable<number>;
  setTheme$: Observable<THEME>;
  stepChangedArgs$: Observable<StepChangedArgs>;

  private _resetWizard: Subject<any>;
  private _showNextStep: Subject<any>;
  private _showPreviousStep: Subject<any>;
  private _showStep: Subject<number>;
  private _setTheme: Subject<THEME>;
  private _stepChangedArgs: Subject<StepChangedArgs>;
  private _defaultConfig: NgWizardConfig;

  constructor(@Optional() @Inject(NG_WIZARD_CONFIG_TOKEN) private config: NgWizardConfig) {
    this._defaultConfig = { ...DEFAULT_CONFIG };
    if (this.config) {
      this._defaultConfig = merge(this._defaultConfig, this.config);
    }

    // Observable sources
    this._resetWizard = new Subject<any>();
    this._showNextStep = new Subject<any>();
    this._showPreviousStep = new Subject<any>();
    this._showStep = new Subject<any>();
    this._setTheme = new Subject<THEME>();
    this._stepChangedArgs = new Subject<StepChangedArgs>();

    // Observable streams
    this.resetWizard$ = this._resetWizard.asObservable();
    this.showNextStep$ = this._showNextStep.asObservable();
    this.showPreviousStep$ = this._showPreviousStep.asObservable();
    this.showStep$ = this._showStep.asObservable();
    this.setTheme$ = this._setTheme.asObservable();
    this.stepChangedArgs$ = this._stepChangedArgs.asObservable();
  }

  getDefaultConfig(): NgWizardConfig {
    return { ...this._defaultConfig };
  }

  resetWizard() {
    this._resetWizard.next();
  }

  showNextStep() {
    this._showNextStep.next();
  }

  showPreviousStep() {
    this._showPreviousStep.next();
  }

  showStep(index: number) {
    this._showStep.next(index);
  }

  setTheme(theme: THEME) {
    this._setTheme.next(theme);
  }

  stepChanged(args: StepChangedArgs) {
    this._stepChangedArgs.next(args);
  }
}
