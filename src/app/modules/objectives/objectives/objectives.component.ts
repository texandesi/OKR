import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Objective} from '../objective';
import {ObjectivesDataService} from '../../../services/objectives-data-service.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {ObjectiveListDataSource} from '../../../data-sources/objective-list-datasource';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit,  AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Objective>;
  dataSource : ObjectiveListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'details', 'delete' ];

  constructor(private dataService : ObjectivesDataService) {
    this.dataSource = new ObjectiveListDataSource(dataService);
  }


  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.dataSource.getObjectives();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  add(name: string): void {
    this.dataSource.addObjective(name);
    this.table.dataSource = this.dataSource;
  }

  // TODO Implement back the page refresh and delete functionality for the Objectives list.
  delete(id: number): void {
    // console.log('Objective Id before is ' + id.valueOf());
    // console.log('Objective array length is  ' + this.dataSource.data.length);
    this.dataSource.deleteObjective(id);
    this.table.dataSource = this.dataSource;
    // console.log('Objective array length after is  ' + this.dataSource.data.length);
  }

}
