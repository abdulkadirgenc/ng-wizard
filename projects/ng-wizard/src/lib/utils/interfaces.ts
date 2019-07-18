import { TOOLBAR_POSITION, TOOLBAR_BUTTON_POSITION,/* TRANSITION_EFFECT,*/ THEME } from './enums';

export interface Language {
    next?: string;
    previous?: string;
}

export interface ToolbarSettings {
    toolbarPosition?: TOOLBAR_POSITION;
    toolbarButtonPosition?: TOOLBAR_BUTTON_POSITION;
    showNextButton?: boolean;
    showPreviousButton?: boolean;
    toolbarExtraButtons?: Button[];
}

export interface Button {
    text: string;
    class: string;
}

export interface AnchorSettings {
    anchorClickable?: boolean;
    enableAllAnchors?: boolean;
    markDoneStep?: boolean;
    markAllPreviousStepsAsDone?: boolean;
    removeDoneStepOnNavigateBack?: boolean;
    enableAnchorOnDoneStep?: boolean;
}

export interface AjaxSettings {
}


export interface NgWizardConfig {
    selected?: number; // Initial selected step, 0 = first step
    keyNavigation?: boolean; // Enable/Disable keyboard navigation(left and right keys are used if enabled)
    autoAdjustHeight?: boolean; // Automatically adjust content height
    cycleSteps?: boolean; // Allows to cycle the navigation of steps
    backButtonSupport?: boolean; // Enable the back button support
    //useURLhash?: boolean; // Enable selection of the step based on url hash
    showStepURLhash?: boolean; // Show url hash based on step
    lang?: Language; // Language variables for button
    toolbarSettings?: ToolbarSettings;
    anchorSettings?: AnchorSettings;
    contentURL?: string; // content url, Enables Ajax content loading. Can also set as data data-content-url on anchor
    contentCache?: boolean; // cache step contents, if false content is fetched always from ajax url
    ajaxSettings?: AjaxSettings; // Ajax extra settings
    disabledSteps?: number[]; // Array Steps disabled
    errorSteps?: number[]; // Highlight step with errors
    hiddenSteps?: number[]; // Hidden steps
    theme?: THEME; // theme for the wizard, related css need to include for other than default theme
    //transitionEffect?: TRANSITION_EFFECT; // Effect on navigation, none/slide/fade
    //transitionSpeed?: string;
    //transitionEasing?: string;
}

export interface NgWizardStep {
    title: string;
    description: string;
    content?: string;
    contentURL?: string
}

export interface NgWizardStepState {
    step: NgWizardStep;
    index: number;
    disabledStep: boolean;
    errorStep: boolean;
    hiddenStep: boolean;
    done: boolean;
    active: boolean;
}
