import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, NgIf, UpperCasePipe } from '@angular/common';

import { Objective } from '../../../data-objects/objective';
import { ObjectivesDataService } from '../../../services/objectives-data-service.service';
import { EVENT_EMITTER, EventHandlingService } from "../../../services/event-handling.service";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-objective-detail',
    templateUrl: './objective-detail.component.html',
    styleUrls: ['./objective-detail.component.scss'
    ],
    standalone: true,
    imports: [NgIf, FormsModule, UpperCasePipe]
})
export class ObjectiveDetailComponent implements OnInit {
  objective!: Objective;

  constructor(
    private route: ActivatedRoute,
    private objectiveService: ObjectivesDataService,
    private eventHandlingService : EventHandlingService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getObjective();
  }

  getObjective(): void {
    // TODO Added a Typescript ignore because the code was failing. Need to remove the ignore and put proper notation
    this.eventHandlingService.subscribeEvent(EVENT_EMITTER.CONTEXT.ObjectiveList,
      (id : number) => {
      this.objectiveService.getObjective(id)
          .subscribe(objective => this.objective = objective);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.objectiveService.updateObjective(this.objective)
    .subscribe( data => {
        this.eventHandlingService.emitEvent(
          EVENT_EMITTER.CONTEXT.ObjectiveDataEntry,
          data
        );
        this.objective =data;
      }
    );
  }
}
