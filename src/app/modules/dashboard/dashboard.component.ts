import { Component, OnInit } from '@angular/core';
import {Objective} from '../../data-objects/objective';
import {ObjectivesDataService} from '../../services/objectives-data-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
  objectives: Objective[] = [];

  constructor(private objectiveService: ObjectivesDataService) { }

  ngOnInit() {
    this.getObjectives();
  }

  getObjectives(): void {
    this.objectiveService.getObjectives()
      .subscribe(objectives => this.objectives = objectives.slice(1, 5));
  }
}
