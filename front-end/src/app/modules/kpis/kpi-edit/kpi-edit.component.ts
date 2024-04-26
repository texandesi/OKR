import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-kpi-edit-component',
  templateUrl: './kpi-edit.component.html',
  styleUrls: ['./kpi-edit.component.scss']
})
export class KpiEditComponent implements OnInit {
  form!: UntypedFormGroup;
  name!: string;
  description!: string;

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<KpiEditComponent>,

    // @ts-ignore
    @Inject(MAT_DIALOG_DATA) data) {

    this.name = data.name;
    this.description = data.description;
  }
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      name: [this.name, []],
      description: [this.description, []],
    });
  }

  // tslint:disable-next-line:typedef
  save() {
    this.dialogRef.close(this.form.value);

  }

  // tslint:disable-next-line:typedef
  close() {
    this.dialogRef.close();
  }

}
