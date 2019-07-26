import { TOOLBAR_POSITION, TOOLBAR_BUTTON_POSITION,/* TRANSITION_EFFECT,*/ THEME, STEP_STATE, STEP_STATUS } from './enums';
import { Input, HostBinding } from '@angular/core';

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

export interface NgWizardConfig {
    selected?: number; // Initial selected step, 0 = first step
    keyNavigation?: boolean; // Enable/Disable keyboard navigation(left and right keys are used if enabled)
    cycleSteps?: boolean; // Allows to cycle the navigation of steps
    lang?: Language; // Language variables for button
    toolbarSettings?: ToolbarSettings;
    anchorSettings?: AnchorSettings;
    theme?: THEME; // theme for the wizard, related css need to include for other than default theme
}

export abstract class NgWizardStep {
    index: number;

    @Input()
    title: string;

    @Input()
    description: string;

    @Input()
    state?: STEP_STATE;
    initialState?: STEP_STATE;

    status?: STEP_STATUS;
    initialStatus?: STEP_STATUS;

    @HostBinding('hidden')
    public get hidden(): boolean {
        return this.status != STEP_STATUS.active;
    }
}

export interface StepChangedArgs {
    step: NgWizardStep,
    previousStep: NgWizardStep,
    direction: string,
    position: string
}
