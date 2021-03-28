import {AfterViewInit, Component, OnInit} from '@angular/core';
import { ObjectiveListDataSource } from './objective-list-datasource';
import {Objective as MyObjective} from '../objective';
import {ObjectivesDataService} from '../../../services/objectives-data-service.service';

@Component({
  selector: 'app-objective-list',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})
export class ObjectiveListComponent implements OnInit {
  myDataSource : ObjectiveListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  constructor(private dataService : ObjectivesDataService) {
    this.myDataSource = new ObjectiveListDataSource(dataService);
  }

  ngOnInit() {
  }


}
