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
    this.objectiveService.addObjective(objective).subscribe();
  }

  updateObjective(objective: Objective): void {
    this.objectiveService.updateObjective(objective).subscribe();
  }

  deleteObjective(id: number): void {
    this.objectiveService.deleteObjective(id).subscribe();
 }

  getObjective(id: number): Observable<Objective> {
    return this.objectiveService.getObjective(id);
  }

  searchObjective(name: string): void {
    this.objectiveService.searchObjectives(name).subscribe();
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

