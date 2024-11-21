import { Component } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent {
  validateEntryToStep() {
    return true;
  }

  validateExitFromStep() {
    return of(true);
  }
}
