import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { ObjectiveListDataSource } from '../../../data-sources/objective-list-datasource';
import { ObjectivesDataService } from '../../../services/objectives-data-service.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {Objective} from '../objective';

@Component({
  selector: 'app-objective-list',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})
export class ObjectiveListComponent implements OnInit,  AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Objective>;
  dataSource : ObjectiveListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  constructor(private dataService : ObjectivesDataService) {
    this.dataSource = new ObjectiveListDataSource(dataService);
    this.dataSource.getObjectives();
  }

  ngOnInit() {
    this.dataSource.getObjectives();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

}
