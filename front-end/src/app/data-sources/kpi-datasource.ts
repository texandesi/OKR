import { DataSource } from '@angular/cdk/collections';
import {Observable, BehaviorSubject} from 'rxjs';
import {MessageService} from "../services/message.service";
import {Kpi} from "../data-objects/kpi";
import {KpiDataService} from "../services/kpi-data-service.service";

/**
 * Data source for the KpiList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class KpiDataSource implements DataSource<Kpi> {

  data  = new BehaviorSubject<Kpi[]>([]);
  private get_kpi  = new BehaviorSubject<Kpi>({name : '', description :''});

  page_length = 10;
  record_count = 10;
  // next_page_number = 2;
  messages : MessageService = new MessageService();

  constructor(
    private kpiService : KpiDataService,
  ) {
  }

  getKpis(
    pageSize : number = 10,
    prev_page_index : number = -1,
    curr_page_index : number = 0,
    sort_column : string = 'name',
    sort_direction : string = 'asc'
  ): void {
    this.kpiService.getKpis('', pageSize, prev_page_index, curr_page_index, sort_column, sort_direction)
      .subscribe(
        kpi => {
                this.data.next(kpi);
                // this.page_length=this.data.value.length;
                this.record_count = this.kpiService.record_count;
              });
  }

  addKpi(kpi: Kpi): void {
    this.kpiService.addKpi(kpi).subscribe(
      o => {
            this.data.value.splice(0,0,o).splice(this.page_length, this.data.value.length);
            // this.data.value.slice(0, this.page_length);
            this.data.next(this.data.value)
      }
    );
  }

  updateKpi(kpi: Kpi): void {
    this.kpiService.updateKpi(kpi).subscribe(
      o => {
        // this.getKpi();
        // let arr : Kpi [] = this.data.value;
        const arr = this.data.value.filter(item => item.id !== o.id );
        arr.push(o);
        this.data.next( arr );
        // this.data.next(this.data.value)
      }
    );
  }

  deleteKpi(id: number): void {
    this.kpiService.deleteKpi(id).subscribe(

      o => {
        // this.getKpi();
        // let arr : Kpi [] = this.data.value;
        const arr = this.data.value.filter(item => item.id !== id );
        // console.log('O in datasource delete kpi before next is ' + JSON.stringify(o));
        this.data.next( arr );
        // this.data.next(this.data.value)
      }

    );
 }

  getKpi(id: number): Observable<Kpi> {
    return this.kpiService.getKpi(id);
  }

  searchKpi(name: string): void {
    this.kpiService.searchKpi(name).subscribe(
      o => this.data.next(o)

    );
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Kpi[]> {
    // this.getKpi();
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

