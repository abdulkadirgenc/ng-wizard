import { Component, AfterContentInit, Input, OnDestroy, EventEmitter, Output, ContentChildren, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgWizardService } from '../ng-wizard.service';
import { NgWizardConfig, NgWizardStep, ToolbarButton, StepChangedArgs } from '../../utils/interfaces';
import { TOOLBAR_POSITION, STEP_STATE, STEP_STATUS, THEME } from '../../utils/enums';
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
  current_index: number = null; // Active step index
  currentStep: NgWizardStep; // Active step

  resetWizardWatcher: Subscription;
  showNextStepWatcher: Subscription;
  showPreviousStepWatcher: Subscription;
  setThemeWatcher: Subscription;

  constructor(private ngService: NgWizardService) {
  }

  ngAfterContentInit() {
    this._backupStepStates();

    this._init();

    // Set toolbar
    this._setToolbar();

    // Assign plugin events
    this._setEvents();

    this.resetWizardWatcher = this.ngService.resetWizard$
      .subscribe(() => {
        this._reset();
      });

    this.showNextStepWatcher = this.ngService.showNextStep$
      .subscribe(() => {
        this._showNextStep();
      });

    this.showPreviousStepWatcher = this.ngService.showPreviousStep$
      .subscribe(() => {
        this._showPreviousStep();
      });

    this.setThemeWatcher = this.ngService.setTheme$
      .subscribe(theme => {
        this._setTheme(theme);
      });
  }

  _init() {
    // set config
    var defaultConfig = this.ngService.getDefaultConfig();
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
    var stepClass = this.styles.step;

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

    if (selectedStep.index != this.current_index) {
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
    var filteredSteps = this.steps.filter(step => {
      return step.index > (this.current_index == null ? -1 : this.current_index)
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
    var filteredSteps = this.steps.filter(step => {
      return step.index < (this.current_index == null && this.config.cycleSteps ? this.steps.length : this.current_index)
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

  _showStep(index: number) {
    // If step not found, skip
    if (index >= this.steps.length || index < 0) {
      return;
    }
    // If current step is requested again, skip
    if (index == this.current_index) {
      return;
    }
    var selectedStep = this.steps.toArray()[index];
    // If it is a disabled or hidden step, skip
    if (selectedStep.state == STEP_STATE.disabled || selectedStep.state == STEP_STATE.hidden) {
      return;
    }

    // Load step content
    this._loadStepContent(selectedStep);
  }

  _loadStepContent(selectedStep: NgWizardStep) {
    // Get the direction of step navigation
    var stepDirection = (this.current_index != null && this.current_index != selectedStep.index) ? (this.current_index < selectedStep.index ? "forward" : "backward") : '';
    var stepPosition = (selectedStep.index == 0) ? 'first' : (selectedStep.index == this.steps.length - 1 ? 'final' : 'middle');

    // Update controls
    this._setAnchor(selectedStep);
    // Set the buttons based on the step
    this._setButtons(selectedStep.index);

    // Trigger "stepChanged" event
    this.stepChanged.emit({
      step: selectedStep,
      previousStep: this.currentStep,
      direction: stepDirection,
      position: stepPosition
    });

    // Update the current index
    this.current_index = selectedStep.index;
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

  /*
  _showLoader() {
    this.styles.main = 'ng-wizard-main ng-wizard-theme-' + this.config.theme + ' ng-wizard-loading';
  }

  _hideLoader() {
    this.styles.main = 'ng-wizard-main ng-wizard-theme-' + this.config.theme;
  }
  */

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
    this.current_index = null;
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

    if (this.setThemeWatcher) {
      this.setThemeWatcher.unsubscribe();
    }
  }
}
