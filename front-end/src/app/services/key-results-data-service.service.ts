import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import {KeyResult} from '../data-objects/keyresult';


@Injectable({ providedIn: 'root' })
export class KeyResultsDataService {

  // TODO remove hard-coded url and pick it up from config
  private keyresultUrl = 'http://127.0.0.1:8000/keyresults/';  // URL to web api
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
  getKeyResults(
    name_filter : string = '',
    page_size: number = 10,
    prev_page_index : number = -1,
    curr_page_index = 0,
    sort_column : string = 'name',
    sort_direction : string = 'asc',
  ): Observable<KeyResult[]> {
    let url : string = this.keyresultUrl;

    this.log('current url is : ' + url);
    this.log('name_filter is : ' + name_filter);
    this.log('Page Size is : ' + page_size);
    this.log('Previous page index is is : ' + prev_page_index);
    this.log('Current page index is is : ' + curr_page_index);
    this.log('Sort column is : ' + sort_column);
    this.log('Sort direction is : ' + sort_direction);
    this.log('Previous url is : ' + this.previous_url);
    this.log('Next url is : ' + this.next_url);

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

    const url_with_param : URL = new URL( url );

    if (sort_column !== null && sort_direction !== null) {
      let ordering_param : string = sort_column;

      if(sort_direction !== 'asc') {
        ordering_param = '-' + ordering_param;
      }

      url_with_param.searchParams.set('ordering', ordering_param);
      // url_with_param.searchParams.delete('page');
    }

    url_with_param.searchParams.delete('page_size');
    url_with_param.searchParams.set('page_size', String(page_size));

    name_filter = name_filter.trim();
    if(name_filter) {
      url_with_param.searchParams.delete('name');
      url_with_param.searchParams.set('name', name_filter);
    }

    url = url_with_param.toString();

    this.log('url in service to get keyresult is : ' + url);


    return this.http.get<any>(url, {
        params: new HttpParams()
        // .set('page_size', String(page_size))
      }
    ).pipe(
      tap((response) => {
        this.log('keyresult data service - fetched keyresult ' + JSON.stringify(response)),
          this.record_count = response['count'],
          this.previous_url = response['previous'];
        this.next_url = response['next'];

      }),
      catchError(this.handleError<KeyResult[]>('failed to getkeyresult', [])),
      map(response => response["results"]),
    );
  }

  /** GET keyresult by id. Return `undefined` when id not found */
  getKeyResultNo404<Data>(id: number): Observable<KeyResult> {
    const url = `${this.keyresultUrl}/${id}/`;
    return this.http.get<KeyResult[]>(url)
      .pipe(
        map(keyresult => keyresult[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} keyresult id=${id}`);
        }),
        catchError(this.handleError<KeyResult>(`getkeyresult id=${id}`))
      );
  }

  /** GET keyresult by id. Will 404 if id not found */
  getKeyResult(id: number): Observable<KeyResult> {
    const url = `${this.keyresultUrl}/${id}/`;
    return this.http.get<KeyResult>(url).pipe(
      tap(_ => this.log(`fetched keyresult id=${id}`)),
      catchError(this.handleError<KeyResult>(`getkeyresult id=${id}`))
    );
  }

  /* GET key-results-list whose name contains search term */
  searchKeyResult(term: string): Observable<KeyResult[]> {
    if (!term.trim()) {
      // if not search term, return empty keyresult array.
      return of([]);
    }
    return this.getKeyResults(term);
  }

  //////// Save methods //////////

  /** POST: add a new keyresult to the server */
  addKeyResult(keyresult: KeyResult): Observable<KeyResult> {


    //TODO - Add error handling for name and description

    return this.http.post<KeyResult>(this.keyresultUrl, keyresult).pipe(
      tap((newkeyresult: KeyResult) => this.log(`added keyresult w/ id=${newkeyresult.id}`)),
      catchError(this.handleError<KeyResult>('addkeyresult'))
    );
  }

  /** DELETE: delete the keyresult from the server */
  deleteKeyResult(id: number): Observable<KeyResult> {
    const url = `${this.keyresultUrl}/${id}/`;

    return this.http.delete<KeyResult>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted keyresult id=${id}`)),
      catchError(this.handleError<KeyResult>('deletekeyresult'))
    );
  }

  /** PUT: update the keyresult on the server */
  updateKeyResult(keyresult: KeyResult): Observable<any> {
    const url = `${this.keyresultUrl}/${keyresult.id}/`;
    return this.http.put(url, keyresult, this.httpOptions).pipe(
      tap(_ => this.log(`updated keyresult id=${keyresult.id}`)),
      catchError(this.handleError<any>('updatekeyresult'))
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

  /** Log a keyresultService message with the MessageService */
  private log(message: string) {
    console.log(`KeyResultDataService: ${message}`);
    this.messageService.log('KeyResultDataService',`${message}`);
  }
}
