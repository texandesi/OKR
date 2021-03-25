import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

import { Objective } from '../objective';
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
//    const id = +this.route.snapshot.paramMap.get('id');
//    console.log('the route passed in is ' + this.route);
//    console.log('the snapshot is ' + this.route.snapshot);
//    console.log('the paramMap is ' + this.route.snapshot.paramMap);
//    console.log('the id is ' + this.route.snapshot.paramMap.get('id'));
    // TODO remove hard-coded Objective Id
    // @ts-ignore
    const id = +this.route.snapshot.paramMap.get('id');
//    const id = 11;
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
