import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

import { Objective } from '../../../data-objects/objective';
import {ObjectivesDataService} from '../../../services/objectives-data-service.service';

@Component({
  selector: 'app-objective-detail',
  templateUrl: './objective-detail.component.html',
  styleUrls: [ './objective-detail.component.scss'
  ]
})
export class ObjectiveDetailComponent implements OnInit {
  objective!: Objective;

  constructor(
    private route: ActivatedRoute,
    private objectiveService: ObjectivesDataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getObjective();
  }

  getObjective(): void {
    // TODO Added a Typescript ignore because the code was failing. Need to remove the ignore and put proper notation
    // @ts-ignore
    const id = +this.route.snapshot.paramMap.get('id');
    this.objectiveService.getObjective(id)
      .subscribe(objective => this.objective = objective);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.objectiveService.updateObjective(this.objective)
      .subscribe(() => this.goBack());
  }
}
