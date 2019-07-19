import { Injectable, Optional, Inject } from '@angular/core';

import { DEFAULT_CONFIG } from '../utils/constants';
import { NG_WIZARD_CONFIG_TOKEN } from './ng-wizard-config.token';
import { NgWizardConfig } from '../utils/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NgWizardService {
  private defaultConfig: NgWizardConfig;

  constructor(@Optional() @Inject(NG_WIZARD_CONFIG_TOKEN) private config: NgWizardConfig) {
    this.defaultConfig = { ...DEFAULT_CONFIG };
    if (this.config) {
      this.defaultConfig = merge(this.defaultConfig, this.config);
    }
  }

  getDefaultConfig(): NgWizardConfig {
    return { ...this.defaultConfig };
  }

  getMergedWithDefaultConfig(config: NgWizardConfig): NgWizardConfig {
    return merge(this.defaultConfig, config);
  }
}

// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
// Merge a `source` object to a `target` recursively
const merge = (target, source) => {

  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (let key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], merge(target[key], source[key]));
    }
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);

  return target;
}
