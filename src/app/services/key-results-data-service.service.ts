import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import {KeyResult} from '../data-objects/key-result';

@Injectable({ providedIn: 'root' })
export class KeyResultDataService {

  private keyresultsUrl = 'http://127.0.0.1:8000/keyresults/';  // URL to web api
  previous_url !: string;
  next_url !: string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET keyresult-list from the server */
  getKeyResults(): Observable<KeyResult[]> {
    return this.http.get<any>(this.keyresultsUrl)
      .pipe(
        tap((response) => this.log('fetched keyresult-list ' + response.toString())),
        catchError(this.handleError<KeyResult[]>('failed to getKeyResults', []))
      );
  }

  /** GET keyresult by id. Return `undefined` when id not found */
  getKeyResultNo404<Data>(id: number): Observable<KeyResult> {
    const url = `${this.keyresultsUrl}/${id}/`;
    return this.http.get<KeyResult[]>(url)
      .pipe(
        map(keyresults => keyresults[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} keyresult id=${id}`);
        }),
        catchError(this.handleError<KeyResult>(`getKeyResult id=${id}`))
      );
  }

  /** GET keyresult by id. Will 404 if id not found */
  getKeyResult(id: number): Observable<KeyResult> {
    const url = `${this.keyresultsUrl}/${id}/`;
    return this.http.get<KeyResult>(url).pipe(
      tap(_ => this.log(`fetched keyresult id=${id}`)),
      catchError(this.handleError<KeyResult>(`getKeyResult id=${id}`))
    );
  }

  /* GET keyresult-list whose name contains search term */
  searchKeyResults(term: string): Observable<KeyResult[]> {
    if (!term.trim()) {
      // if not search term, return empty keyresult array.
      return of([]);
    }
    return this.http.get<KeyResult[]>(`${this.keyresultsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found keyresults matching "${term}"`) :
        this.log(`no keyresults matching "${term}"`)),
      catchError(this.handleError<KeyResult[]>('searchKeyResults', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new keyresult to the server */
  addKeyResult(keyresult: KeyResult): Observable<KeyResult> {
    //TODO - Add error handling for name and description

    return this.http.post<KeyResult>(this.keyresultsUrl, keyresult, this.httpOptions).pipe(
      tap((newKeyResult: KeyResult) => this.log(`added keyresult w/ id=${newKeyResult.id}`)),
      catchError(this.handleError<KeyResult>('addKeyResult'))
    );
  }

  /** DELETE: delete the keyresult from the server */
  deleteKeyResult(id: number): Observable<KeyResult> {
    const url = `${this.keyresultsUrl}/${id}/`;

    return this.http.delete<KeyResult>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted keyresult id=${id}`)),
      catchError(this.handleError<KeyResult>('deleteKeyResult'))
    );
  }

  /** PUT: update the keyresult on the server */
  updateKeyResult(keyresult: KeyResult): Observable<any> {
    return this.http.put(this.keyresultsUrl, keyresult, this.httpOptions).pipe(
      tap(_ => this.log(`updated keyresult id=${keyresult.id}`)),
      catchError(this.handleError<any>('updateKeyResult'))
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

  /** Log a KeyResultService message with the MessageService */
  private log(message: string) {
    console.log(`KeyResultService: ${message}`);
    this.messageService.log(`KeyResultService: ${message}`);
  }
}
