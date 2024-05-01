import {Component, Inject, OnInit} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';

@Component({
    selector: 'app-keyresult-edit-component',
    templateUrl: './keyresult-edit.component.html',
    styleUrls: ['./keyresult-edit.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatDialogActions]
})
export class KeyResultEditComponent implements OnInit {
  form!: UntypedFormGroup;
  name!: string;
  description!: string;

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<KeyResultEditComponent>,

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
