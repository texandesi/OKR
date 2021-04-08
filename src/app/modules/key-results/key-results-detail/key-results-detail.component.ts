import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

import { KeyResult } from '../../../data-objects/key-result';
import {KeyResultDataService} from "../../../services/key-results-data-service.service";

@Component({
  selector: 'app-key-results-detail',
  templateUrl: './key-results-detail.component.html',
  styleUrls: [ './key-results-detail.component.scss'
  ]
})
export class KeyResultsDetailComponent implements OnInit {
  keyresult!: KeyResult;

  constructor(
    private route: ActivatedRoute,
    private keyresultService: KeyResultDataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getKeyResult();
  }

  getKeyResult(): void {
    // TODO Added a Typescript ignore because the code was failing. Need to remove the ignore and put proper notation
    // @ts-ignore
    const id = +this.route.snapshot.paramMap.get('id');
    this.keyresultService.getKeyResult(id)
      .subscribe(keyresult => this.keyresult = keyresult);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.keyresultService.updateKeyResult(this.keyresult)
      .subscribe(() => this.goBack());
  }
}
