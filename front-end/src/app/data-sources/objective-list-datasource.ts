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

  data  = new BehaviorSubject<Objective[]>([]);
  private get_objective  = new BehaviorSubject<Objective>({name : '', description :''});

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
    this.objectiveService.getObjectives('', pageSize, prev_page_index, curr_page_index, sort_column, sort_direction)
      .subscribe(
        objectives => {
                this.data.next(objectives);
                // this.page_length=this.data.value.length;
                this.record_count = this.objectiveService.record_count;
              });
  }

  addObjective(objective: Objective): void {
    this.objectiveService.addObjective(objective).subscribe(
      o => {
            this.data.value.splice(0,0,o).splice(this.page_length, this.data.value.length);
            // this.data.value.slice(0, this.page_length);
            this.data.next(this.data.value)
      }
    );
  }

  updateObjective(objective: Objective): void {
    this.objectiveService.updateObjective(objective).subscribe(
      o => {
        // this.getObjectives();
        // let arr : Objective [] = this.data.value;
        const arr = this.data.value.filter(item => item.id !== o.id );
        arr.push(o);
        this.data.next( arr );
        // this.data.next(this.data.value)
      }
    );
  }

  deleteObjective(id: number): void {
    this.objectiveService.deleteObjective(id).subscribe(

      o => {
        // this.getObjectives();
        // let arr : Objective [] = this.data.value;
        const arr = this.data.value.filter(item => item.id !== id );
        // console.log('O in datasource delete objective before next is ' + JSON.stringify(o));
        this.data.next( arr );
        // this.data.next(this.data.value)
      }

    );
 }

  getObjective(id: number): Observable<Objective> {
    return this.objectiveService.getObjective(id);
  }

  searchObjective(name: string): void {
    this.objectiveService.searchObjectives(name).subscribe(
      o => this.data.next(o)

    );
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Objective[]> {
    // this.getObjectives();
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

