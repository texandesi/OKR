import { Component, OnInit } from '@angular/core';
import {Objective} from '../objective';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrls: ['./objective-form.component.scss']
})
export class ObjectiveFormComponent implements OnInit {

  powers = ['Really Smart', 'Super Flexible',
    'Super Hot', 'Weather Changer'];

  model = new Objective(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');

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

  skyDog(): Objective {
    const myObjective = new Objective(42, 'SkyDog',
      'Fetch any object at any distance',
      'Leslie Rollover');
    console.log('My hero is called ' + myObjective.name); // "My hero is called SkyDog"
    return myObjective;
  }

  //////// NOT SHOWN IN DOCS ////////

  // Reveal in html:
  //   Name via form.controls = {{showFormControls(heroForm)}}
  showFormControls(form: any) {
    return form && form.controls.name &&
      form.controls.name.value; // Dr. IQ
  }

  /////////////////////////////

}
