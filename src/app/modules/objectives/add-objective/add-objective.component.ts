import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-objective-component',
  templateUrl: './add-objective.component.html',
  styleUrls: ['./add-objective.component.scss']
})
export class AddObjectiveComponent implements OnInit {
  form!: FormGroup;
  name!: string;
  description!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddObjectiveComponent>,

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
