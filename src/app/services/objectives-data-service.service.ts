import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import {Objective} from '../data-objects/objective';


@Injectable({ providedIn: 'root' })
export class ObjectivesDataService {

  // TODO remove hard-coded url and pick it up from config
  private objectivesUrl = 'http://127.0.0.1:8000/objectives/';  // URL to web api
  record_count : number = 10;
  curr_page_index : number = 0;
  previous_url !: string;
  next_url !: string;


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    ) { }

  /** GET key-results-list from the server */
  getObjectives(
    page_size: number = 10,
    prev_page_index : number = -1,
    curr_page_index = 0,
    sort_column : string = 'name',
    sort_direction : string = 'asc',
  ): Observable<Objective[]> {
    let url : string = this.objectivesUrl;

    // console.log('Previous url is : ' + this.previous_url);
    // console.log('Next url is : ' + this.next_url);

    if (prev_page_index > curr_page_index) {
      if(this.previous_url) {
        url = this.previous_url;
      }
    }
    else {
      if(this.next_url) {
        url = this.next_url;
      }
    }

    let url_with_param : URL = new URL( url );

    if (sort_column !== null && sort_direction !== null) {
      let ordering_param : string = sort_column;

      if(sort_direction !== 'asc') {
        ordering_param = '-' + ordering_param;
      }

      url_with_param.searchParams.set('ordering', ordering_param);
      url_with_param.searchParams.delete('page');
    }

    url_with_param.searchParams.delete('page_size');
    url_with_param.searchParams.set('page_size', String(page_size));

    url = url_with_param.toString();


    // this.messageService.log('The url with ordering param is ' + url); // => 'hello'
    // console.log('The missing param is ' + url_with_param.searchParams.get('missing')); // => null


    return this.http.get<any>(url, {

      params: new HttpParams()
        // .set('page_size', String(page_size))
      }
    ).pipe(
        tap((response) => {
          this.messageService.log('Objective data service - fetched objectives ' + JSON.stringify(response)),
            this.record_count = response['count'],
            this.previous_url = response['previous'];
            this.next_url = response['next'];

        }),
        catchError(this.handleError<Objective[]>('failed to getObjectives', [])),
      map(response => response["results"]),

      );
  }

  /** GET objective by id. Return `undefined` when id not found */
  getObjectiveNo404<Data>(id: number): Observable<Objective> {
    const url = `${this.objectivesUrl}/${id}/`;
    return this.http.get<Objective[]>(url)
      .pipe(
        map(objectives => objectives[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} objective id=${id}`);
        }),
        catchError(this.handleError<Objective>(`getObjective id=${id}`))
      );
  }

  /** GET objective by id. Will 404 if id not found */
  getObjective(id: number): Observable<Objective> {
    const url = `${this.objectivesUrl}/${id}/`;
    return this.http.get<Objective>(url).pipe(
      tap(_ => this.log(`fetched objective id=${id}`)),
      catchError(this.handleError<Objective>(`getObjective id=${id}`))
    );
  }

  /* GET key-results-list whose name contains search term */
  searchObjectives(term: string): Observable<Objective[]> {
    if (!term.trim()) {
      // if not search term, return empty objective array.
      return of([]);
    }
    return this.http.get<Objective[]>(`${this.objectivesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found objectives matching "${term}"`) :
        this.log(`no objectives matching "${term}"`)),
      catchError(this.handleError<Objective[]>('searchObjectives', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new objective to the server */
  addObjective(objective: Objective): Observable<Objective> {


    //TODO - Add error handling for name and description

    return this.http.post<Objective>(this.objectivesUrl, objective).pipe(
      tap((newObjective: Objective) => this.log(`added objective w/ id=${newObjective.id}`)),
      catchError(this.handleError<Objective>('addObjective'))
    );
  }

  /** DELETE: delete the objective from the server */
  deleteObjective(id: number): Observable<Objective> {
    const url = `${this.objectivesUrl}/${id}/`;

    this.messageService.log('Objective data service The url with delete param is ' + url); // => 'hello'


    return this.http.delete<Objective>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted objective id=${id}`)),
      catchError(this.handleError<Objective>('deleteObjective'))
    );
  }

  /** PUT: update the objective on the server */
  updateObjective(objective: Objective): Observable<any> {
    return this.http.put(this.objectivesUrl, objective, this.httpOptions).pipe(
      tap(_ => this.log(`updated objective id=${objective.id}`)),
      catchError(this.handleError<any>('updateObjective'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ObjectiveService message with the MessageService */
  private log(message: string) {
    console.log(`ObjectiveService: ${message}`);
    this.messageService.log(`ObjectiveService: ${message}`);
  }
}
