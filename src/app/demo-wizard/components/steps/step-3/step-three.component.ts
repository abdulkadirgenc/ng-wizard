import { Component } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss'],
})
export class StepThreeComponent {
  validateEntryToStep = true;

  validateExitFromStep() {
    return of(true);
  }
}
