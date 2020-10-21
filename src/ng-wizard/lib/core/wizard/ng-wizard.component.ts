import { Component, AfterContentInit, Input, OnDestroy, EventEmitter, Output, ContentChildren, QueryList } from '@angular/core';
import { isObservable, observable, Observable, of, Subscription } from 'rxjs';

import { NgWizardDataService } from '../ng-wizard-data.service';
import { NgWizardConfig, NgWizardStep, ToolbarButton, StepChangedArgs, StepValidationArgs } from '../../utils/interfaces';
import { TOOLBAR_POSITION, STEP_STATE, STEP_STATUS, THEME, STEP_DIRECTIN, STEP_POSITION } from '../../utils/enums';
import { merge } from '../../utils/functions';

@Component({
  selector: 'ng-wizard',
  templateUrl: './ng-wizard.component.html',
  styleUrls: ['./ng-wizard.component.css'],
})
export class NgWizardComponent implements OnDestroy, AfterContentInit {

  @ContentChildren(NgWizardStep)
  public steps: QueryList<NgWizardStep>;

  _pConfig: NgWizardConfig;
  get pConfig(): NgWizardConfig {
    return this._pConfig || {};
  }

  @Input('config')
  set pConfig(config: NgWizardConfig) {
    this._pConfig = config;
  }

  config: NgWizardConfig;

  @Output() stepChanged = new EventEmitter<StepChangedArgs>();
  @Output() themeChanged = new EventEmitter<THEME>();
  @Output() reseted = new EventEmitter<void>();

  styles: {
    main?: string;
    step?: string;
    previousButton?: string;
    nextButton?: string;
    toolbarTop?: string;
    toolbarBottom?: string;
  } = {};

  showToolbarTop: boolean = false;
  showPreviousButton: boolean = false;
  showNextButton: boolean = false;
  showToolbarBottom: boolean = false;
  showExtraButtons: boolean = false;
  currentStepIndex: number = null; // Active step index
  currentStep: NgWizardStep; // Active step

  resetWizardWatcher: Subscription;
  showNextStepWatcher: Subscription;
  showPreviousStepWatcher: Subscription;
  showStepWatcher: Subscription;
  setThemeWatcher: Subscription;

  constructor(private ngWizardDataService: NgWizardDataService) {
  }

  ngAfterContentInit() {
    this._backupStepStates();

    this._init();

    // Set toolbar
    this._setToolbar();

    // Assign plugin events
    this._setEvents();

    this.resetWizardWatcher = this.ngWizardDataService.resetWizard$.subscribe(() => this._reset());
    this.showNextStepWatcher = this.ngWizardDataService.showNextStep$.subscribe(() => this._showNextStep());
    this.showPreviousStepWatcher = this.ngWizardDataService.showPreviousStep$.subscribe(() => this._showPreviousStep());
    this.showStepWatcher = this.ngWizardDataService.showStep$.subscribe(index => this._showStep(index));
    this.setThemeWatcher = this.ngWizardDataService.setTheme$.subscribe(theme => this._setTheme(theme));
  }

  _init() {
    // set config
    let defaultConfig = this.ngWizardDataService.getDefaultConfig();
    this.config = merge(defaultConfig, this.pConfig);

    // set step states
    this._initSteps();

    // Set the elements
    this._initStyles();

    // Show the initial step
    this._showStep(this.config.selected);
  }

  _initSteps() {
    this.steps.forEach((step, index) => {
      step.index = index;
      step.status = step.status || STEP_STATUS.untouched;
      step.state = step.state || STEP_STATE.normal;
    });

    // Mark previous steps of the active step as done
    if (this.config.selected > 0
      && this.config.anchorSettings.markDoneStep
      && this.config.anchorSettings.markAllPreviousStepsAsDone) {

      this.steps.forEach(step => {
        if (step.state != STEP_STATE.disabled && step.state != STEP_STATE.hidden) {
          step.status = step.index < this.config.selected ? STEP_STATUS.done : step.status;
        }
      });
    }
  }

  _backupStepStates() {
    this.steps.forEach(step => {
      step.initialStatus = step.status;
      step.initialState = step.state;
    });
  }

  _restoreStepStates() {
    this.steps.forEach(step => {
      step.status = step.initialStatus;
      step.state = step.initialState;
    });
  }

  // PRIVATE FUNCTIONS
  _initStyles() {
    // Set the main element
    this.styles.main = 'ng-wizard-main ng-wizard-theme-' + this.config.theme;

    // Set anchor elements
    this.styles.step = 'nav-item'; // li

    // Make the anchor clickable
    if (this.config.anchorSettings.enableAllAnchors && this.config.anchorSettings.anchorClickable) {
      this.styles.step += ' clickable';
    }

    // Set the toolbar styles
    this.styles.toolbarTop = 'btn-toolbar ng-wizard-toolbar ng-wizard-toolbar-top justify-content-' + this.config.toolbarSettings.toolbarButtonPosition;
    this.styles.toolbarBottom = 'btn-toolbar ng-wizard-toolbar ng-wizard-toolbar-bottom justify-content-' + this.config.toolbarSettings.toolbarButtonPosition;

    // Set previous&next buttons 
    this.styles.previousButton = 'btn btn-secondary ng-wizard-btn-prev';
    this.styles.nextButton = 'btn btn-secondary ng-wizard-btn-next';
  }

  _setToolbar() {
    this.showToolbarTop = this.config.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.top ||
      this.config.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.both;

    this.showToolbarBottom = this.config.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.bottom ||
      this.config.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.both;

    this.showPreviousButton = this.config.toolbarSettings.showPreviousButton;
    this.showNextButton = this.config.toolbarSettings.showNextButton;

    this.showExtraButtons = this.config.toolbarSettings.toolbarExtraButtons && this.config.toolbarSettings.toolbarExtraButtons.length > 0;
  }

  _setEvents() {
    //TODO: keyNavigation
    // Keyboard navigation event
    if (this.config.keyNavigation) {
      // $(document).keyup(function (e) {
      //   mi._keyNav(e);
      // });
    }
  }

  _getStepCssClass(selectedStep: NgWizardStep) {
    let stepClass = this.styles.step;

    switch (selectedStep.state) {
      case STEP_STATE.disabled:
        stepClass += ' disabled';
        break;
      case STEP_STATE.error:
        stepClass += ' danger';
        break;
      case STEP_STATE.hidden:
        stepClass += ' hidden';
        break;
    }

    switch (selectedStep.status) {
      case STEP_STATUS.done:
        stepClass += ' done';
        break;
      case STEP_STATUS.active:
        stepClass += ' active';
        break;
    }

    return stepClass;
  }

  _showSelectedStep(event: Event, selectedStep: NgWizardStep) {
    event.preventDefault();

    if (!this.config.anchorSettings.anchorClickable) {
      return;
    }

    if (!this.config.anchorSettings.enableAnchorOnDoneStep && selectedStep.status == STEP_STATUS.done) {
      return true;
    }

    if (selectedStep.index != this.currentStepIndex) {
      if (this.config.anchorSettings.enableAllAnchors && this.config.anchorSettings.anchorClickable) {
        this._showStep(selectedStep.index);
      }
      else {
        if (selectedStep.status == STEP_STATUS.done) {
          this._showStep(selectedStep.index);
        }
      }
    }
  }

  _showNextStep(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    // Find the next not disabled & hidden step
    let filteredSteps = this.steps.filter(step => {
      return step.index > (this.currentStepIndex == null ? -1 : this.currentStepIndex)
        && step.state != STEP_STATE.disabled
        && step.state != STEP_STATE.hidden;
    });

    if (filteredSteps.length == 0) {
      if (!this.config.cycleSteps) {
        return;
      }

      this._showStep(0)
    }
    else {
      this._showStep(filteredSteps.shift().index)
    }
  }

  _showPreviousStep(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    // Find the previous not disabled & hidden step
    let filteredSteps = this.steps.filter(step => {
      return step.index < (this.currentStepIndex == null && this.config.cycleSteps ? this.steps.length : this.currentStepIndex)
        && step.state != STEP_STATE.disabled
        && step.state != STEP_STATE.hidden;
    });

    if (filteredSteps.length == 0) {
      if (!this.config.cycleSteps) {
        return;
      }

      this._showStep(this.steps.length - 1)
    }
    else {
      this._showStep(filteredSteps.pop().index)
    }
  }

  _showStep(selectedStepIndex: number) {
    // If step not found, skip
    if (selectedStepIndex >= this.steps.length || selectedStepIndex < 0) {
      return;
    }

    // If current step is requested again, skip
    if (selectedStepIndex == this.currentStepIndex) {
      return;
    }

    let selectedStep = this.steps.toArray()[selectedStepIndex];

    // If it is a disabled or hidden step, skip
    if (selectedStep.state == STEP_STATE.disabled || selectedStep.state == STEP_STATE.hidden) {
      return;
    }

    this._showLoader();

    return this._isStepChangeValid(selectedStep, this.currentStep && this.currentStep.canExit).toPromise()
      .then(isValid => {
        if (isValid) {
          return this._isStepChangeValid(selectedStep, selectedStep.canEnter).toPromise();
        }

        return of(isValid).toPromise();
      })
      .then(isValid => {
        if (isValid) {
          // Load step content
          this._loadStepContent(selectedStep);
        }
      })
      .finally(() => this._hideLoader());
  }

  private _isStepChangeValid(selectedStep, condition: boolean | ((args: StepValidationArgs) => boolean) | ((args: StepValidationArgs) => Observable<boolean>)): Observable<boolean> {
    if (typeof condition === typeof true) {
      return of(<boolean>condition);
    }

    else if (condition instanceof Function) {
      let direction = this._getStepDirection(selectedStep.index);
      let result = condition({ direction: direction, fromStep: this.currentStep, toStep: selectedStep });

      if (isObservable<boolean>(result)) {
        return result;
      }
      else if (typeof result === typeof true) {
        return of(<boolean>result);
      }
      else {
        return of(false);
      }
    }

    return of(true);
  }

  _loadStepContent(selectedStep: NgWizardStep) {
    // Update controls
    this._setAnchor(selectedStep);
    // Set the buttons based on the step
    this._setButtons(selectedStep.index);

    // Trigger "stepChanged" event
    const args = <StepChangedArgs>{
      step: selectedStep,
      previousStep: this.currentStep,
      direction: this._getStepDirection(selectedStep.index),
      position: this._getStepPosition(selectedStep.index)
    };
    this.stepChanged.emit(args);
    this.ngWizardDataService.stepChanged(args);

    // Update the current index
    this.currentStepIndex = selectedStep.index;
    this.currentStep = selectedStep;
  }

  _setAnchor(selectedStep: NgWizardStep) {
    // Current step anchor > Remove other classes and add done class
    if (this.currentStep) {
      this.currentStep.status = STEP_STATUS.untouched;

      if (this.config.anchorSettings.markDoneStep) {
        this.currentStep.status = STEP_STATUS.done;

        if (this.config.anchorSettings.removeDoneStepOnNavigateBack) {
          this.steps.forEach(step => {
            if (step.index > selectedStep.index) {
              step.status = STEP_STATUS.untouched;
            }
          });
        }
      }
    }

    // Next step anchor > Remove other classes and add active class
    selectedStep.status = STEP_STATUS.active;
  }

  _setButtons(index: number) {
    // Previous/Next Button enable/disable based on step
    if (!this.config.cycleSteps) {
      if (0 >= index) {
        this.styles.previousButton = 'btn btn-secondary ng-wizard-btn-prev disabled';
      }
      else {
        this.styles.previousButton = 'btn btn-secondary ng-wizard-btn-prev';
      }

      if (this.steps.length - 1 <= index) {
        this.styles.nextButton = 'btn btn-secondary ng-wizard-btn-next disabled';
      }
      else {
        this.styles.nextButton = 'btn btn-secondary ng-wizard-btn-next';
      }
    }
  }

  _extraButtonClicked(button: ToolbarButton) {
    if (button.event) {
      button.event();
    }
  }

  // HELPER FUNCTIONS
  _keyNav(event: KeyboardEvent) {
    // Keyboard navigation
    switch (event.which) {
      case 37:
        // left
        this._showPreviousStep(event);
        event.preventDefault();
        break;
      case 39:
        // right
        this._showNextStep(event);
        event.preventDefault();
        break;
      default:
        return; // exit this handler for other keys
    }
  }

  _showLoader() {
    this.styles.main = 'ng-wizard-main ng-wizard-theme-' + this.config.theme + ' ng-wizard-loading';
  }

  _hideLoader() {
    this.styles.main = 'ng-wizard-main ng-wizard-theme-' + this.config.theme;
  }

  _getStepDirection(selectedStepIndex: number): STEP_DIRECTIN {
    return (this.currentStepIndex != null && this.currentStepIndex != selectedStepIndex) ?
      (this.currentStepIndex < selectedStepIndex ? STEP_DIRECTIN.forward : STEP_DIRECTIN.backward) : null;
  }

  _getStepPosition(selectedStepIndex: number): STEP_POSITION {
    return (selectedStepIndex == 0) ? STEP_POSITION.first : (selectedStepIndex == this.steps.length - 1 ? STEP_POSITION.final : STEP_POSITION.middle);
  }

  // PUBLIC FUNCTIONS
  _setTheme(theme: THEME) {
    if (this.config.theme == theme) {
      return false;
    }

    this.config.theme = theme;
    this.styles.main = 'ng-wizard-main ng-wizard-theme-' + this.config.theme;

    // Trigger "themeChanged" event
    this.themeChanged.emit(this.config.theme);
  }

  _reset() {
    // Reset all elements and classes
    this.currentStepIndex = null;
    this.currentStep = null;
    this._restoreStepStates();
    this._init();

    // Trigger "reseted" event
    this.reseted.emit();
  }

  ngOnDestroy() {
    if (this.resetWizardWatcher) {
      this.resetWizardWatcher.unsubscribe();
    }

    if (this.showNextStepWatcher) {
      this.showNextStepWatcher.unsubscribe();
    }

    if (this.showPreviousStepWatcher) {
      this.showPreviousStepWatcher.unsubscribe();
    }

    if (this.showStepWatcher) {
      this.showStepWatcher.unsubscribe();
    }

    if (this.setThemeWatcher) {
      this.setThemeWatcher.unsubscribe();
    }
  }
}
