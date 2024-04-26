import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Objective } from '../../../data-objects/objective';
import {ObjectivesDataService} from '../../../services/objectives-data-service.service';

@Component({
  selector: 'app-objective-search',
  templateUrl: './objective-search.component.html',
  styleUrls: [ './objective-search.component.scss' ]
})
export class ObjectiveSearchComponent implements OnInit {
  objectives$!: Observable<Objective[]>;
  private searchTerms = new Subject<string>();

  constructor(private objectiveService: ObjectivesDataService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.objectives$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.objectiveService.searchObjectives(term)),
    );
  }
}
