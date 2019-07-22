import { TOOLBAR_POSITION, TOOLBAR_BUTTON_POSITION,/* TRANSITION_EFFECT,*/ THEME, STEP_STATE, STEP_STATUS } from './enums';

export interface Language {
    next?: string;
    previous?: string;
}

export interface ToolbarSettings {
    toolbarPosition?: TOOLBAR_POSITION;
    toolbarButtonPosition?: TOOLBAR_BUTTON_POSITION;
    showNextButton?: boolean;
    showPreviousButton?: boolean;
    toolbarExtraButtons?: ToolbarButton[];
}

export interface ToolbarButton {
    text: string;
    class: string;
    event?: () => void;
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
    // autoAdjustHeight?: boolean; // Automatically adjust content height
    cycleSteps?: boolean; // Allows to cycle the navigation of steps
    // backButtonSupport?: boolean; // Enable the back button support
    // useURLhash?: boolean; // Enable selection of the step based on url hash
    showStepURLhash?: boolean; // Show url hash based on step
    lang?: Language; // Language variables for button
    toolbarSettings?: ToolbarSettings;
    anchorSettings?: AnchorSettings;
    contentURL?: string; // content url, Enables Ajax content loading. Can also set as data data-content-url on anchor
    contentCache?: boolean; // cache step contents, if false content is fetched always from ajax url
    // ajaxSettings?: AjaxSettings; // Ajax extra settings
    theme?: THEME; // theme for the wizard, related css need to include for other than default theme
    // transitionEffect?: TRANSITION_EFFECT; // Effect on navigation, none/slide/fade
    // transitionSpeed?: string;
    // transitionEasing?: string;
}

export interface NgWizardStepDef {
    title: string;
    description: string;
    content?: string;
    contentURL?: string;
    state?: STEP_STATE;
}

export interface NgWizardStep {
    definition: NgWizardStepDef;
    index: number;
    status?: STEP_STATUS;
}

export interface stepChangedArgs {
    step: NgWizardStep,
    previousStep: NgWizardStep,
    direction: string,
    position: string
}
