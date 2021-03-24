import { Component, OnInit } from '@angular/core';
import {Objective} from '../objective';
import {ObjectivesDataService} from '../../../services/objectives-data-service.service';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit {
  objectives!: Objective[];

  constructor(private objectiveService: ObjectivesDataService) { }

  ngOnInit() {
    this.getObjectives();
  }

  getObjectives(): void {
    this.objectiveService.getObjectives()
      .subscribe(objectives => this.objectives = objectives);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.objectiveService.addObjective({ name } as Objective)
      .subscribe(hero => {
        this.objectives.push(hero);
      });
  }

  delete(hero: Objective): void {
    this.objectives = this.objectives.filter(h => h !== hero);
    this.objectiveService.deleteObjective(hero.id).subscribe();
  }

}
