import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';

import { NgWizardService } from './ng-wizard.service';
import { NgWizardConfig, NgWizardStepDef, NgWizardStep, ToolbarButton } from '../utils/interfaces';
import { TOOLBAR_POSITION, STEP_STATE, STEP_STATUS, THEME } from '../utils/enums';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ng-wizard',
  templateUrl: './ng-wizard.component.html',
  styleUrls: ['./ng-wizard.component.css'],
})
export class NgWizardComponent implements OnDestroy, OnInit {

  _stepDefinitions: NgWizardStepDef[];
  get stepDefinitions(): NgWizardStepDef[] {
    return this._stepDefinitions;
  }

  @Input('steps')
  set stepDefinitions(stepDefinitions: NgWizardStepDef[]) {
    this._stepDefinitions = stepDefinitions;
  }

  steps: NgWizardStep[];


  _defaultConfig: NgWizardConfig;
  get defaultConfig(): NgWizardConfig {
    return this._defaultConfig;
  }

  @Input('config')
  set defaultConfig(defaultConfig: NgWizardConfig) {
    this._defaultConfig = defaultConfig;
  }

  config: NgWizardConfig;

  @Output() stepChangeStarted = new EventEmitter<{ step: NgWizardStep, direction: string }>();
  @Output() stepChanged = new EventEmitter<{ step: NgWizardStep, direction: string, position: string }>();
  @Output() themeChanged = new EventEmitter<THEME>();
  @Output() reseted = new EventEmitter<void>();

  styles: {
    main?: string;
    step?: string;
    page?: string;
    previousButton?: string;
    nextButton?: string;
    toolbarTop?: string;
    toolbarBottom?: string;
  } = {};

  showToolbarTop: boolean = false;
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

  ngOnInit() {
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
    this.config = this.ngService.getMergedWithDefaultConfig(this.defaultConfig);

    // set step states
    this._initSteps();

    // Set the elements
    this._initStyles();

    // Show the initial step
    this._showStep(this.config.selected);
  }

  _initSteps() {
    this.steps = this.stepDefinitions.map((step, index) => <NgWizardStep>{
      definition: {
        title: step.title,
        description: step.description,
        content: step.content,
        contentURL: step.contentURL,
        state: step.state || STEP_STATE.normal,
        event: step.event,
      },
      index: index,
      status: STEP_STATUS.untouched,
    });

    // Mark previous steps of the active step as done
    if (this.config.selected > 0
      && this.config.anchorSettings.markDoneStep
      && this.config.anchorSettings.markAllPreviousStepsAsDone) {

      this.steps.forEach(step => {
        if (step.definition.state != STEP_STATE.disabled && step.definition.state != STEP_STATE.hidden) {
          step.status = step.index < this.config.selected ? STEP_STATUS.done : step.status;
        }
      });
    }
  }

  // PRIVATE FUNCTIONS
  _initStyles() {
    // Set the main element
    this.styles.main = 'ng-wizard-main ng-wizard-theme-' + this.config.theme;

    // Set anchor elements
    this.styles.step = 'nav-item'; // li

    // Make the anchor clickable
    if (this.config.anchorSettings.enableAllAnchors != false && this.config.anchorSettings.anchorClickable != false) {
      this.styles.step += ' clickable';
    }

    // Set the toolbar styles
    this.styles.toolbarTop = 'btn-toolbar ng-wizard-toolbar ng-wizard-toolbar-top justify-content-' + this.config.toolbarSettings.toolbarButtonPosition;
    this.styles.toolbarBottom = 'btn-toolbar ng-wizard-toolbar ng-wizard-toolbar-bottom justify-content-' + this.config.toolbarSettings.toolbarButtonPosition;

    // Set content pages
    this.styles.page = 'tab-pane step-content';

    // Set previous&next buttons 
    this.styles.previousButton = 'btn btn-secondary ng-wizard-btn-prev';
    this.styles.nextButton = 'btn btn-secondary ng-wizard-btn-next';
  }

  _setToolbar() {
    this.showToolbarTop = this.config.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.top ||
      this.config.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.both;

    this.showToolbarBottom = this.config.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.bottom ||
      this.config.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.both;

    this.showExtraButtons = this.config.toolbarSettings.toolbarExtraButtons && this.config.toolbarSettings.toolbarExtraButtons.length > 0;
  }

  _setEvents() {
    //TODO: keyNavigation, backButtonSupport
    // Keyboard navigation event
    if (this.config.keyNavigation) {
      // $(document).keyup(function (e) {
      //   mi._keyNav(e);
      // });
    }
  }

  _getStepCssClass(selectedStep: NgWizardStep) {
    var stepClass = this.styles.step;

    switch (selectedStep.definition.state) {
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

  _getPageCssClass(selectedStep: NgWizardStep) {
    var pageClass = this.styles.page;

    if (selectedStep.index == this.current_index) {
      pageClass += ' active';
    }

    return pageClass;
  }

  _showSelectedStep(event: Event, selectedStep: NgWizardStep) {
    event.preventDefault();

    if (this.config.anchorSettings.anchorClickable == false) {
      return;
    }

    if (this.config.anchorSettings.enableAnchorOnDoneStep == false && selectedStep.status == STEP_STATUS.done) {
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
        && step.definition.state != STEP_STATE.disabled
        && step.definition.state != STEP_STATE.hidden;
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
        && step.definition.state != STEP_STATE.disabled
        && step.definition.state != STEP_STATE.hidden;
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
    var selectedStep = this.steps[index];
    // If it is a disabled or hidden step, skip
    if (selectedStep.definition.state == STEP_STATE.disabled || selectedStep.definition.state == STEP_STATE.hidden) {
      return;
    }

    // Load step content
    this._loadStepContent(selectedStep);
  }

  _loadStepContent(selectedStep: NgWizardStep) {
    // Get the direction of step navigation
    var stepDirection = (this.current_index != null && this.current_index != selectedStep.index) ? (this.current_index < selectedStep.index ? "forward" : "backward") : '';

    // Trigger "leaveStep" event
    this.stepChangeStarted.emit({ step: this.currentStep, direction: stepDirection });

    var contentURL = selectedStep.definition.contentURL && selectedStep.definition.contentURL.length > 0 ? selectedStep.definition.contentURL : this.config.contentURL;

    if (contentURL && contentURL.length > 0 && (!selectedStep.definition.content || selectedStep.definition.content.length == 0 || !this.config.contentCache)) {
      this._showLoader();
      // TODO: Get ajax content and then show step
      this._transitPage(selectedStep);
      this._hideLoader();
    } else {
      // Show step
      this._transitPage(selectedStep);
    }
  }

  _transitPage(selectedStep: NgWizardStep) {
    // Get the direction of step navigation
    var stepDirection = (this.current_index != null && this.current_index != selectedStep.index) ? (this.current_index < selectedStep.index ? "forward" : "backward") : '';
    var stepPosition = (selectedStep.index == 0) ? 'first' : (selectedStep.index == this.steps.length - 1 ? 'final' : 'middle');

    // Update controls
    this._setAnchor(selectedStep);
    // Set the buttons based on the step
    this._setButtons(selectedStep.index);
    // Update the current index
    this.current_index = selectedStep.index;
    this.currentStep = selectedStep;

    if (selectedStep.definition.event) {
      selectedStep.definition.event(selectedStep);
    }

    // Trigger "showStep" event
    this.stepChanged.emit({ step: selectedStep, direction: stepDirection, position: stepPosition });
  }

  _setAnchor(selectedStep: NgWizardStep) {
    // Current step anchor > Remove other classes and add done class
    if (this.currentStep) {
      this.currentStep.status = STEP_STATUS.untouched;

      if (this.config.anchorSettings.markDoneStep != false) {
        this.currentStep.status = STEP_STATUS.done;

        if (this.config.anchorSettings.removeDoneStepOnNavigateBack != false) {
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
