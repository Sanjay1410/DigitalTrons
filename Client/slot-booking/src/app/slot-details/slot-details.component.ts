import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-slot-details',
	templateUrl: './slot-details.component.html',
	styleUrls: ['./slot-details.component.scss']
})
export class SlotDetailsComponent implements OnInit {

	isForEdit: boolean = false;
	constructor(
		public formBuilder: FormBuilder,
		private dialog: MatDialogRef<SlotDetailsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any // used to access the data that was passed in to a dialog
	) { }

	public form: FormGroup = this.formBuilder.group({
		firstName: new FormControl('', Validators.required),
		lastName: new FormControl('', Validators.required),
		phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
	});

	ngOnInit() {
		// fetching data from dialog and assign to formControl
		let slotData = this.data['slotDetails']
		this.isForEdit = this.data['isForEdit']
		this.form.get('firstName').setValue(slotData['firstName'])
		this.form.get('lastName').setValue(slotData['lastName'])
		this.form.get('phoneNumber').setValue(slotData['phoneNumber'])
	}

	submit() {
		if (this.form.valid) {
			this.dialog.close({ data: this.form.value, isForDelete: false }) // dialog will close and sending data to parent
		}
	}

	deleteSlot() {
		this.form.reset()
		console.log("DELETE")
		this.dialog.close({ data: null, isForDelete: true })
	}

	// checking fieds are valid or not
	isFieldInvalid(field: string) {
		return (
			(this.form.get(field).invalid)
		);
	}

}
