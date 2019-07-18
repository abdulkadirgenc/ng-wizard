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
  previousButtonClass: string;
  nextButtonClass: string;
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
    this.stepStates = this.steps.map((step, index) => <NgWizardStepState>{
      step: step,
      index: index,
      disabledStep: this.defaultConfig.disabledSteps.includes(index),
      errorStep: this.defaultConfig.errorSteps.includes(index),
      hiddenStep: this.defaultConfig.hiddenSteps.includes(index)
    });

    // Mark previous steps of the active step as done
    if (this.defaultConfig.selected > 0
      && this.defaultConfig.anchorSettings.markDoneStep
      && this.defaultConfig.anchorSettings.markAllPreviousStepsAsDone) {

      this.stepStates.forEach(stepState => { stepState.done = stepState.index < this.defaultConfig.selected });
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

  _getStepCssClass(selectedStepState: NgWizardStepState) {
    var stepClass = this.stepClass;

    if (selectedStepState.disabledStep) {
      stepClass += ' disabled';
    }

    if (selectedStepState.errorStep) {
      stepClass += ' danger';
    }

    if (selectedStepState.hiddenStep) {
      stepClass += ' hidden';
    }

    if (selectedStepState.done) {
      stepClass += ' done';
    }

    if (selectedStepState.active) {
      stepClass += ' active';
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

  _showSelectedStep(event: Event, selectedStepState: NgWizardStepState) {
    event.preventDefault();

    if (this.defaultConfig.anchorSettings.anchorClickable == false) {
      return;
    }

    if (this.defaultConfig.anchorSettings.enableAnchorOnDoneStep == false && selectedStepState.done) {
      return true;
    }

    if (selectedStepState.index != this.current_index) {
      if (this.defaultConfig.anchorSettings.enableAllAnchors && this.defaultConfig.anchorSettings.anchorClickable) {
        this._showStep(selectedStepState.index);
      }
      else {
        if (selectedStepState.done) {
          this._showStep(selectedStepState.index);
        }
      }
    }
  }

  _showNextStep(event: Event) {
    event.preventDefault();
    // Find the next not disabled & hidden step
    var filteredStepStates = this.stepStates.filter((stepState, stepIndex) => {
      return stepIndex > this.current_index && !stepState.disabledStep && !stepState.hiddenStep;
    });

    if (filteredStepStates.length == 0) {
      if (!this.defaultConfig.cycleSteps) {
        return;
      }

      this._showStep(0)
    }
    else {
      this._showStep(filteredStepStates.shift().index)
    }
  }

  _showPreviousStep(event: Event) {
    event.preventDefault();
    // Find the previous not disabled & hidden step
    var filteredStepStates = this.stepStates.filter((stepState, stepIndex) => {
      return stepIndex < this.current_index && !stepState.disabledStep && !stepState.hiddenStep;
    });

    if (filteredStepStates.length == 0) {
      if (!this.defaultConfig.cycleSteps) {
        return;
      }

      this._showStep(this.steps.length - 1)
    }
    else {
      this._showStep(filteredStepStates.pop().index)
    }
  }

  _showStep(stepIndex: number) {
    // If step not found, skip
    if (stepIndex >= this.stepStates.length || stepIndex < 0) {
      return;
    }
    // If current step is requested again, skip
    if (stepIndex == this.current_index) {
      return;
    }
    var selectedStepState = this.stepStates[stepIndex];
    // If it is a disabled step, skip
    if (selectedStepState.disabledStep || selectedStepState.hiddenStep) {
      return;
    }

    // Get current step elements
    var currentStepState = this.stepStates[this.current_index];

    // Load step content
    this._loadStepContent(currentStepState, selectedStepState);
  }

  _loadStepContent(currentStepState: NgWizardStepState, selectedStepState: NgWizardStepState) {
    // Get the direction of step navigation
    var stepDirection = (this.current_index !== null && this.current_index !== selectedStepState.index) ? (this.current_index < selectedStepState.index ? "forward" : "backward") : '';

    // Trigger "leaveStep" event
    if (this.current_index !== null && this._triggerEvent("leaveStep", [currentStepState, this.current_index, stepDirection]) === false) {
      return;
    }

    var contentURL = selectedStepState.step.contentURL && selectedStepState.step.contentURL.length > 0 ? selectedStepState.step.contentURL : this.defaultConfig.contentURL;

    if (contentURL && contentURL.length > 0 && (!selectedStepState.step.content || selectedStepState.step.content.length == 0 || !this.defaultConfig.contentCache)) {
      // Get ajax content and then show step
      // TODO
      // var selPage = elm.length > 0 ? $(elm.attr("href"), this.main) : null;

      // var ajaxSettings = $.extend(true, {}, {
      //   url: contentURL,
      //   type: "POST",
      //   data: { step_number: idx },
      //   dataType: "text",
      //   beforeSend: function () {
      //     mi._loader('show');
      //   },
      //   error: function (jqXHR, status, message) {
      //     mi._loader('hide');
      //     $.error(message);
      //   },
      //   success: function (res) {
      //     if (res && res.length > 0) {
      //       elm.data('has-content', true);
      //       selPage.html(res);
      //     }
      //     mi._loader('hide');
      //     mi._transitPage(idx);
      //   }
      // }, this.options.ajaxSettings);

      // $.ajax(ajaxSettings);
    } else {
      // Show step
      this._transitPage(currentStepState, selectedStepState);
    }
  }

  _transitPage(currentStepState: NgWizardStepState, selectedStepState: NgWizardStepState) {
    // Get the direction of step navigation
    var stepDirection = (this.current_index !== null && this.current_index !== selectedStepState.index) ? (this.current_index < selectedStepState.index ? "forward" : "backward") : '';
    var stepPosition = (selectedStepState.index == 0) ? 'first' : (selectedStepState.index == this.steps.length - 1 ? 'final' : 'middle');

    // TODO: Hide previous step content, show selected step content

    // Change the url hash to new step
    // this._setURLHash(selectedStepState.href);
    // Update controls
    this._setAnchor(currentStepState, selectedStepState);
    // Set the buttons based on the step
    this._setButtons(selectedStepState.index);
    // Fix height with content
    this._fixHeight(selectedStepState);
    // Update the current index
    this.current_index = selectedStepState.index;

    // Trigger "showStep" event
    this._triggerEvent("showStep", [selectedStepState, this.current_index, stepDirection, stepPosition]);
  }

  _setAnchor(currentStepState: NgWizardStepState, selectedStepState: NgWizardStepState) {
    // Current step anchor > Remove other classes and add done class
    if (currentStepState) {
      currentStepState.active = false;

      if (this.defaultConfig.anchorSettings.markDoneStep !== false) {
        currentStepState.done = true;

        if (this.defaultConfig.anchorSettings.removeDoneStepOnNavigateBack != false) {
          this.stepStates.forEach(stepState => {
            if (stepState.index > selectedStepState.index) {
              stepState.done = false;
            }
          });
        }
      }
    }

    // Next step anchor > Remove other classes and add active class
    selectedStepState.active = true;
  }

  _setButtons(stepIndex: number) {
    // Previous/Next Button enable/disable based on step
    if (!this.defaultConfig.cycleSteps) {
      if (0 >= stepIndex) {
        this.previousButtonClass = 'btn btn-secondary sw-btn-prev disabled';
      }
      else {
        this.previousButtonClass = 'btn btn-secondary sw-btn-prev';
      }

      if (this.stepStates.length - 1 <= stepIndex) {
        this.nextButtonClass = 'btn btn-secondary sw-btn-next disabled';
      }
      else {
        this.nextButtonClass = 'btn btn-secondary sw-btn-next';
      }
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

  _fixHeight(selectedStepState: NgWizardStepState) {
    // TODO
    // // Auto adjust height of the container
    if (this.defaultConfig.autoAdjustHeight) {
      // var selPage = this.steps.eq(idx).length > 0 ? $(this.steps.eq(idx).attr("href"), this.main) : null;
      // this.container.finish().animate({ minHeight: selPage.outerHeight() }, this.defaultConfig.transitionSpeed, function () { });
    }
  }

  _triggerEvent(name: string, params: any[]): boolean {
    // TODO
    // // Trigger an event
    // var e = $.Event(name);
    // this.main.trigger(e, params);
    // if (e.isDefaultPrevented()) {
    //     return false;
    // }
    // return e.result;
    return true;
  }

  _setURLHash(hash: string) {
    if (this.defaultConfig.showStepURLhash && window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }

  _loader(action: string) {
    // TODO
    // switch (action) {
    //   case 'show':
    //     this.main.addClass('sw-loading');
    //     break;
    //   case 'hide':
    //     this.main.removeClass('sw-loading');
    //     break;
    //   default:
    //     this.main.toggleClass('sw-loading');
    // }
  }

  // PUBLIC FUNCTIONS
  theme(v) {
    // TODO
    // if (this.options.theme === v) {
    //   return false;
    // }
    // this.main.removeClass('sw-theme-' + this.options.theme);
    // this.options.theme = v;
    // this.main.addClass('sw-theme-' + this.options.theme);
    // // Trigger "themeChanged" event
    // this._triggerEvent("themeChanged", [this.options.theme]);
  }

  // next() {
  //   this._showNext();
  // }

  // prev() {
  //   this._showPrevious();
  // }

  reset() {
    // TODO
    // // Trigger "beginReset" event
    // if (this._triggerEvent("beginReset") === false) {
    //   return false;
    // }

    // // Reset all elements and classes
    // this.container.stop(true);
    // this.pages.stop(true);
    // this.pages.hide();
    // this.current_index = null;
    // this._setURLHash(this.steps.eq(this.options.selected).attr("href"));
    // $(".sw-toolbar", this.main).remove();
    // this.steps.removeClass();
    // this.steps.parents('li').removeClass();
    // this.steps.data('has-content', false);
    // this.init();

    // // Trigger "endReset" event
    // this._triggerEvent("endReset");
  }

  stepState(stepArray, state) {
    // TODO
    // var mi = this;
    // stepArray = $.isArray(stepArray) ? stepArray : [stepArray];
    // var selSteps = $.grep(this.steps, function (n, i) {
    //   return $.inArray(i, stepArray) !== -1; //  && i !== mi.current_index
    // });
    // if (selSteps && selSteps.length > 0) {
    //   switch (state) {
    //     case 'disable':
    //       $(selSteps).parents('li').addClass('disabled');
    //       break;
    //     case 'enable':
    //       $(selSteps).parents('li').removeClass('disabled');
    //       break;
    //     case 'hide':
    //       $(selSteps).parents('li').addClass('hidden');
    //       break;
    //     case 'show':
    //       $(selSteps).parents('li').removeClass('hidden');
    //       break;
    //     case 'error-on':
    //       $(selSteps).parents('li').addClass('danger');
    //       break;
    //     case 'error-off':
    //       $(selSteps).parents('li').removeClass('danger');
    //       break;
    //   }
    // }
  }
}
