import { Injectable, Optional, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NG_WIZARD_CONFIG_TOKEN } from '../ng-wizard-config.token';
import { DEFAULT_CONFIG } from '../utils/constants';
import { THEME } from '../utils/enums';
import { merge } from '../utils/functions';
import { StepChangedArgs, NgWizardConfig } from '../utils/interfaces';

@Injectable({
  providedIn: 'root',
})
export class NgWizardDataService {
  resetWizard$: Observable<void>;
  showNextStep$: Observable<void>;
  showPreviousStep$: Observable<void>;
  showStep$: Observable<number>;
  setTheme$: Observable<THEME>;
  stepChangedArgs$: Observable<StepChangedArgs>;

  private _resetWizard: Subject<void>;
  private _showNextStep: Subject<void>;
  private _showPreviousStep: Subject<void>;
  private _showStep: Subject<number>;
  private _setTheme: Subject<THEME>;
  private _stepChangedArgs: Subject<StepChangedArgs>;
  private _defaultConfig: NgWizardConfig;

  constructor(
    @Optional() @Inject(NG_WIZARD_CONFIG_TOKEN) private config: NgWizardConfig
  ) {
    this._defaultConfig = { ...DEFAULT_CONFIG };
    if (this.config) {
      this._defaultConfig = merge(this._defaultConfig, this.config);
    }

    // Observable sources
    this._resetWizard = new Subject<void>();
    this._showNextStep = new Subject<void>();
    this._showPreviousStep = new Subject<void>();
    this._showStep = new Subject<number>();
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
