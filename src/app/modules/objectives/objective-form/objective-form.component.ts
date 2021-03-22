import { Component, OnInit } from '@angular/core';
import {Objective} from '../objective';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrls: ['./objective-form.component.scss']
})
export class ObjectiveFormComponent implements OnInit {

  objectiveList = [
    'Objective 1',
    'Objective 2',
    'Objective 3',
    'Objective 4'
  ];

  model = new Objective(18,  this.objectiveList[0], 'Description of objective');

  submitted = false;

  constructor() { }

  ngOnInit(): void {
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }

  onSubmit() {
    this.submitted = true;
  }

  newObjective() {
    this.model = new Objective(42, '', '');
  }

}
