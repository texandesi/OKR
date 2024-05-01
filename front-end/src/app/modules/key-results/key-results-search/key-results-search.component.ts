import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import {KeyResultsDataService} from "../../../services/key-results-data-service.service";
import {KeyResult} from "../../../data-objects/keyresult";
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe } from '@angular/common';


@Component({
    selector: 'app-key-results-search',
    templateUrl: './key-results-search.component.html',
    styleUrls: ['./key-results-search.component.scss'],
    standalone: true,
    imports: [NgFor, RouterLink, AsyncPipe]
})
export class KeyResultsSearchComponent implements OnInit {
  keyresult$!: Observable<KeyResult[]>;
  private searchTerms = new Subject<string>();

  constructor(private keyresultService: KeyResultsDataService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.keyresult$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.keyresultService.searchKeyResult(term)),
    );
  }
}
