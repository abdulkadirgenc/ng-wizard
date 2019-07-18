import { NgWizardConfig } from './interfaces';
import { TOOLBAR_POSITION, TOOLBAR_BUTTON_POSITION, TRANSITION_EFFECT, THEME } from './enums';

export const DEFAULT_CONFIG: NgWizardConfig = {
    selected: 0,
    keyNavigation: true,
    autoAdjustHeight: true,
    cycleSteps: false,
    backButtonSupport: true,
    //useURLhash: true,
    showStepURLhash: true,
    lang: {
        next: 'Next',
        previous: 'Previous'
    },
    toolbarSettings: {
        toolbarPosition: TOOLBAR_POSITION.bottom,
        toolbarButtonPosition: TOOLBAR_BUTTON_POSITION.end,
        showNextButton: true,
        showPreviousButton: true,
        toolbarExtraButtons: []
    },
    anchorSettings: {
        anchorClickable: true,
        enableAllAnchors: false,
        markDoneStep: true,
        markAllPreviousStepsAsDone: true,
        removeDoneStepOnNavigateBack: false,
        enableAnchorOnDoneStep: true
    },
    contentURL: null,
    contentCache: true,
    ajaxSettings: {},
    disabledSteps: [],
    errorSteps: [],
    hiddenSteps: [],
    theme: THEME.default,
    transitionEffect: TRANSITION_EFFECT.none,
    transitionSpeed: '400'
};