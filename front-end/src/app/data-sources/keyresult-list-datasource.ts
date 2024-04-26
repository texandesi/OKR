import { DataSource } from '@angular/cdk/collections';
import {Observable, BehaviorSubject} from 'rxjs';
import {MessageService} from "../services/message.service";
import {KeyResult} from "../data-objects/keyresult";
import {KeyResultsDataService} from "../services/key-results-data-service.service";

/**
 * Data source for the KeyResultList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class KeyResultListDataSource implements DataSource<KeyResult> {

  data  = new BehaviorSubject<KeyResult[]>([]);
  private get_keyresult  = new BehaviorSubject<KeyResult>({name : '', description :''});

  page_length = 10;
  record_count = 10;
  // next_page_number = 2;
  messages : MessageService = new MessageService();

  constructor(
    private keyresultService : KeyResultsDataService,
  ) {
  }

  getKeyResults(
    pageSize : number = 10,
    prev_page_index : number = -1,
    curr_page_index : number = 0,
    sort_column : string = 'name',
    sort_direction : string = 'asc'
  ): void {
    this.keyresultService.getKeyResults('', pageSize, prev_page_index, curr_page_index, sort_column, sort_direction)
      .subscribe(
        keyresults => {
                this.data.next(keyresults);
                // this.page_length=this.data.value.length;
                this.record_count = this.keyresultService.record_count;
              });
  }

  addKeyResult(keyresult: KeyResult): void {
    this.keyresultService.addKeyResult(keyresult).subscribe(
      o => {
            this.data.value.splice(0,0,o).splice(this.page_length, this.data.value.length);
            // this.data.value.slice(0, this.page_length);
            this.data.next(this.data.value)
      }
    );
  }

  updateKeyResult(keyresult: KeyResult): void {
    this.keyresultService.updateKeyResult(keyresult).subscribe(
      o => {
        // this.getKeyResults();
        // let arr : KeyResult [] = this.data.value;
        let arr = this.data.value.filter(item => item.id !== o.id );
        arr.push(o);
        this.data.next( arr );
        // this.data.next(this.data.value)
      }
    );
  }

  deleteKeyResult(id: number): void {
    this.keyresultService.deleteKeyResult(id).subscribe(

      o => {
        // this.getKeyResults();
        // let arr : KeyResult [] = this.data.value;
        let arr = this.data.value.filter(item => item.id !== id );
        // console.log('O in datasource delete keyresult before next is ' + JSON.stringify(o));
        this.data.next( arr );
        // this.data.next(this.data.value)
      }

    );
 }

  getKeyResult(id: number): Observable<KeyResult> {
    return this.keyresultService.getKeyResult(id);
  }

  searchKeyResult(name: string): void {
    this.keyresultService.searchKeyResult(name).subscribe(
      o => this.data.next(o)

    );
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<KeyResult[]> {
    // this.getKeyResults();
    return this.data.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this.data.complete();
  }
}

