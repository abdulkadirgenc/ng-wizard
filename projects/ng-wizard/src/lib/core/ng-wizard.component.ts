import { Component, OnInit, Input } from '@angular/core';

import { NgWizardService } from './ng-wizard.service';
import { NgWizardConfig, NgWizardStep, NgWizardStepState } from '../utils/interfaces';
import { TOOLBAR_POSITION } from '../utils/enums';

@Component({
  selector: 'ng-wizard',
  templateUrl: './ng-wizard.component.html',
  styleUrls: ['./ng-wizard.component.css'],
})
export class NgWizardComponent implements OnInit {
  @Input() steps: NgWizardStep[];
  stepStates: NgWizardStepState[];

  defaultConfig: NgWizardConfig;
  mainClass: string;
  navClass: string;
  stepClass: string;
  linkClass: string;
  containerClass: string;
  pageClass: string;
  showToolbarTop: boolean = false;
  showToolbarBottom: boolean = false;
  showExtraButtons: boolean = false;
  toolbarTopClass: string;
  toolbarBottomClass: string;
  current_index: number = null;// Active step index

  constructor(private ngService: NgWizardService) {
    this.defaultConfig = this.ngService.getDefaultConfig();
  }

  ngOnInit() {
    // set step states
    this._setStepStates();

    // Set the elements
    this._setElements();

    // Add toolbar
    this._setToolbar();

    // Assign plugin events
    this._setEvents();

    // Show the initial step
    this._showStep(this.defaultConfig.selected);
  }

  _setStepStates() {
    this.stepStates = this.steps.map(val => <NgWizardStepState>{ step: val });

    if (this.defaultConfig.selected > 0
      && this.defaultConfig.anchorSettings.markDoneStep
      && this.defaultConfig.anchorSettings.markAllPreviousStepsAsDone) {

      this.stepStates.forEach((stepState, stepIndex) => {
        // step index
        stepState.index = stepIndex;
        // Mark previous steps of the active step as done
        stepState.done = stepIndex < this.defaultConfig.selected
        // Disabled steps
        stepState.disabledStep = this.defaultConfig.disabledSteps.includes(stepIndex)
        // Error steps
        stepState.errorStep = this.defaultConfig.errorSteps.includes(stepIndex)
        // Hidden steps
        stepState.hiddenStep = this.defaultConfig.hiddenSteps.includes(stepIndex)
      });
    }
  }

  // PRIVATE FUNCTIONS
  _setElements() {
    // Set the main element
    this.mainClass = 'sw-main sw-theme-' + this.defaultConfig.theme;
    // Set anchor elements
    this.navClass = 'nav nav-tabs step-anchor'; // ul
    this.stepClass = 'nav-item'; // li
    this.linkClass = 'nav-link'; // a

    // Make the anchor clickable
    if (this.defaultConfig.anchorSettings.enableAllAnchors != false && this.defaultConfig.anchorSettings.anchorClickable != false) {
      this.stepClass += ' clickable';
    }

    // Set content container
    this.containerClass = 'container sw-container tab-content';
    // Set content pages
    this.pageClass = 'tab-pane step-content';
  }

  getStepCssClass(stepState: NgWizardStepState, stepIndex: number) {
    var stepClass = this.stepClass;

    if (stepState.disabledStep) {
      stepClass += ' disabled';
    }

    if (stepState.errorStep) {
      stepClass += ' danger';
    }

    if (stepState.hiddenStep) {
      stepClass += ' hidden';
    }

    if (stepState.done) {
      stepClass += ' done';
    }

    return stepClass;
  }

  _setToolbar() {
    this.showToolbarTop = this.defaultConfig.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.top ||
      this.defaultConfig.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.both;

    this.showToolbarBottom = this.defaultConfig.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.bottom ||
      this.defaultConfig.toolbarSettings.toolbarPosition == TOOLBAR_POSITION.both;

    this.showExtraButtons = this.defaultConfig.toolbarSettings.toolbarExtraButtons && this.defaultConfig.toolbarSettings.toolbarExtraButtons.length > 0;

    this.toolbarTopClass = 'btn-toolbar sw-toolbar sw-toolbar-top justify-content-' + this.defaultConfig.toolbarSettings.toolbarButtonPosition;
    this.toolbarBottomClass = 'btn-toolbar sw-toolbar sw-toolbar-bottom justify-content-' + this.defaultConfig.toolbarSettings.toolbarButtonPosition;
  }

  _setEvents() {
    //TODO: keyNavigation, backButtonSupport
    // Keyboard navigation event
    if (this.defaultConfig.keyNavigation) {
      // $(document).keyup(function (e) {
      //   mi._keyNav(e);
      // });
    }

    // Back/forward browser button event
    if (this.defaultConfig.backButtonSupport) {
      // $(window).on('hashchange', function (e) {
      //   if (!mi.options.useURLhash) {
      //     return true;
      //   }
      //   if (window.location.hash) {
      //     var elm = $("a[href*='" + window.location.hash + "']", mi.nav);
      //     if (elm && elm.length > 0) {
      //       e.preventDefault();
      //       mi._showStep(mi.steps.index(elm));
      //     }
      //   }
      // });
    }
  }

  stepClicked(event: Event, stepState: NgWizardStepState, stepIndex: number) {
    event.preventDefault();

    if (this.defaultConfig.anchorSettings.anchorClickable == false) {
      return;
    }

    if (this.defaultConfig.anchorSettings.enableAnchorOnDoneStep == false && stepState.done) {
      return true;
    }

    if (stepIndex != this.current_index) {
      if (this.defaultConfig.anchorSettings.enableAllAnchors && this.defaultConfig.anchorSettings.anchorClickable) {
        this._showStep(stepIndex);
      }
      else {
        if (stepState.done) {
          this._showStep(stepIndex);
        }
      }
    }
  }

  _showNext(event: Event) {
    event.preventDefault();
    // Find the next not disabled & hidden step
    var nextIndex = this.stepStates.findIndex((stepState, stepIndex) => {
      return stepIndex > this.current_index && !stepState.disabledStep && !stepState.hiddenStep;
    });

    if (nextIndex == -1) {
      if (!this.defaultConfig.cycleSteps) {
        return;
      }

      nextIndex = 0;
    }
    this._showStep(nextIndex);
  }

  _showPrevious(event: Event) {
    event.preventDefault();
    // Find the previous not disabled & hidden step
    var previousIndex = this.stepStates.reverse().findIndex((stepState, stepIndex) => {
      return stepIndex > (this.stepStates.length - this.current_index - 1) && !stepState.disabledStep && !stepState.hiddenStep;
    });

    if (previousIndex == -1) {
      if (!this.defaultConfig.cycleSteps) {
        return;
      }

      previousIndex = this.steps.length - 1;
    }
    else {
      previousIndex = this.stepStates.length - previousIndex - 1;
    }
    this._showStep(previousIndex);
  }

  _showStep(stepIndex: number) {
    // If step not found, skip
    if (stepIndex >= this.stepStates.length) {
      return;
    }
    // If current step is requested again, skip
    if (stepIndex == this.current_index) {
      return;
    }
    var stepState = this.stepStates[stepIndex];
    // If it is a disabled step, skip
    if (stepState.disabledStep || stepState.hiddenStep) {
      return;
    }

    // Load step content
    this._loadStepContent(stepState);
    return true;
  }

  _loadStepContent(stepState: NgWizardStepState) {
  }
}
