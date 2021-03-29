import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import {Objective} from '../modules/objectives/objective';
import {logging} from 'protractor';


@Injectable({ providedIn: 'root' })
export class ObjectivesDataService {

  private objectivesUrl = 'api/objectives';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET objectives from the server */
  getObjectives(): Observable<Objective[]> {
    this.log('Before getting objectives in objectives data service');

    return this.http.get<Objective[]>(this.objectivesUrl)
      .pipe(
        tap(_ => this.log('fetched objectives')),
        catchError(this.handleError<Objective[]>('getObjectives', []))
      );
  }

  /** GET objective by id. Return `undefined` when id not found */
  getObjectiveNo404<Data>(id: number): Observable<Objective> {
    const url = `${this.objectivesUrl}/?id=${id}`;
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
    const url = `${this.objectivesUrl}/${id}`;
    return this.http.get<Objective>(url).pipe(
      tap(_ => this.log(`fetched objective id=${id}`)),
      catchError(this.handleError<Objective>(`getObjective id=${id}`))
    );
  }

  /* GET objectives whose name contains search term */
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
    return this.http.post<Objective>(this.objectivesUrl, objective, this.httpOptions).pipe(
      tap((newObjective: Objective) => this.log(`added objective w/ id=${newObjective.id}`)),
      catchError(this.handleError<Objective>('addObjective'))
    );
  }

  /** DELETE: delete the objective from the server */
  deleteObjective(id: number): Observable<Objective> {
    const url = `${this.objectivesUrl}/${id}`;

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
  }
}
