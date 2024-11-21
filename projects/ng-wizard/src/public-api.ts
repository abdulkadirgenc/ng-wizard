/*
 * Public API Surface of ng-wizard
 */

export { NgWizardModule } from './ng-wizard.module';
export { NgWizardService } from './lib/services/ng-wizard.service';
export {
  TOOLBAR_POSITION,
  TOOLBAR_BUTTON_POSITION,
  THEME,
  STEP_STATE,
  STEP_DIRECTION,
  STEP_POSITION,
} from './lib/utils/enums';
export { NgWizardStep } from './lib/utils/interfaces';
export type {
  Language,
  ToolbarSettings,
  ToolbarButton,
  AnchorSettings,
  NgWizardConfig,
  StepValidationArgs,
  StepChangedArgs,
} from './lib/utils/interfaces';
export { NgWizardComponent } from './lib/components/ng-wizard/ng-wizard.component';
export { NgWizardStepComponent } from './lib/components/ng-wizard-step/ng-wizard-step.component';
