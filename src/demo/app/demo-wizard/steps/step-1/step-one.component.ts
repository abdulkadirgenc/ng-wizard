import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent implements OnInit {
  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  validateEntryToStep() {
    return true;
  }

  validateExitFromStep() {
    return of(true);
  }
}
