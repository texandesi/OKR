import { DataSource } from '@angular/cdk/collections';
import {Observable, BehaviorSubject} from 'rxjs';
import {ObjectivesDataService} from '../services/objectives-data-service.service';
import {Objective} from '../data-objects/objective';
import {MessageService} from "../services/message.service";

/**
 * Data source for the ObjectiveList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ObjectiveListDataSource implements DataSource<Objective> {

  private data  = new BehaviorSubject<Objective[]>([]);

  page_length = 10;
  record_count = 10;
  // next_page_number = 2;
  messages : MessageService = new MessageService();

  constructor(
    private objectiveService : ObjectivesDataService,
  ) {
  }

  getObjectives(
    pageSize : number = 10,
    prev_page_index : number = -1,
    curr_page_index : number = 0,
    sort_column : string = 'name',
    sort_direction : string = 'asc'
  ): void {
    this.objectiveService.getObjectives(pageSize, prev_page_index, curr_page_index, sort_column, sort_direction)
      .subscribe(
        objectives => {
                this.data.next(objectives);
                this.page_length=this.data.value.length;
                this.record_count = this.objectiveService.record_count;

                // this.next_page_number=
                console.log("Data returned from service to data source has length " + this.data.value.length);
              });
  }

  addObjective(objective: Objective): void {
    this.objectiveService.addObjective(objective);
  }

  deleteObjective(id: number): void {
    this.objectiveService.deleteObjective(id);
 }


  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Objective[]> {
    return this.data.asObservable();

    // if (this.paginator && this.sort) {
    //   this.messages.log("Data source got paginator and sort");
    // } else {
    //   this.messages.log("Paginator : " + this.paginator);
    //   this.messages.log("Data source : " + this.sort);
    // }
    //
    // return this.data;
    // if (this.paginator && this.sort) {
    //   // Combine everything that affects the rendered data into one update
    //   // stream for the data-table to consume.
    //   return merge(this.data, this.paginator.page, this.sort.sortChange)
    //     .pipe(map(() => {
    //       return this.getPagedData(this.getSortedData(this.data ));
    //     }));
    // } else {
    //   // throw Error('Please set the paginator and sort on the data source before connecting.');
    //   console.error('data is ' + this.data) ;
    //
    //   return observableOf(this.data)
    //     .pipe(map(() => {
    //       return [ ...this.data ];
    //     }));

  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this.data.complete();
  }
}

// /** Simple sort comparator for example ID/Name columns (for client-side sorting). */
// function compare(a: string | number, b: string | number, isAsc: boolean): number {
//   // TODO Write a better compare function
//   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
// }

