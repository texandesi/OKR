import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Objective} from '../objective';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {ObjectiveListDataSource} from '../../../data-sources/objective-list-datasource';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit, AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) myMatTable!: MatTable<Objective>;
  dataSource : ObjectiveListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'details', 'delete'];

  constructor(private myDataSource : ObjectiveListDataSource) {
    this.dataSource = myDataSource;
  }

  ngOnInit() :void {
    this.getObjectives();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.myMatTable.dataSource = this.dataSource;
  }

  getObjectives(): void {
    this.dataSource.getObjectives();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.dataSource.addObjective(name);

  }

  // TODO Implement back the page refresh and delete functionality for the Objectives list.
  delete(objective: Objective): void {
    this.dataSource.data = this.dataSource.data.filter(h => h !== objective);
    this.dataSource.deleteObjective(objective.id);

    this.getObjectives();
  }

}
