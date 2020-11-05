import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.css']
})
export class StepThreeComponent implements OnInit {
  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  validateEntryToStep = true;

  validateExitFromStep() {
    return of(true);
  }
}
