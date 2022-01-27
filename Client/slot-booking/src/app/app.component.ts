import { Component } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SlotDetailsComponent } from './slot-details/slot-details.component';
import { TooltipPosition } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'slot-booking';
	allSlotFormat = [
		{
			id: '1',
			text: '09:00 AM - 10:00 AM'
		},
		{
			id: '2',
			text: '10:00 AM - 11:00 AM'
		},
		{
			id: '3',
			text: '11:00 AM - 12:00 PM'
		},
		{
			id: '4',
			text: '12:00 PM - 01:00 PM'
		},
		{
			id: '5',
			text: '01:00 PM - 02:00 PM'
		},
		{
			id: '6',
			text: '02:00 PM - 03:00 PM'
		},
		{
			id: '7',
			text: '03:00 PM - 04:00 PM'
		},
		{
			id: '8',
			text: '04:00 PM - 05:00 PM'
		},
	]
	bookedSlotDetails = {}
	allSlotDetails: any[] = []
	snackBarconfig = new MatSnackBarConfig();

	constructor(
		public dialog: MatDialog,
		private http: HttpClient,
		public snackBar: MatSnackBar
	) {

	}

	ngOnInit() {
		// this.saveSlot()
		this.snackBarconfig.duration = 2000
		this.snackBarconfig.horizontalPosition = 'right'
		this.snackBarconfig.verticalPosition = 'bottom'
		this.snackBarconfig.panelClass = ['green-snackbar']
		this.getAllSlot()
	}

	getAllSlot() {
		this.http.get('/api/getSlot').subscribe((res) => {
			console.log(res)
			this.allSlotDetails = res['data']
			this.populateSlot()
		})
	}

	populateSlot() {
		this.bookedSlotDetails = {}
		if (this.allSlotDetails.length > 0) {
			this.allSlotDetails.forEach(ele => {
				if (ele['booked'] == 1)
					this.bookedSlotDetails[ele['slot']] = ele
			})
		}
	}
	saveSlot(payload) {
		this.http.post('/api/slot', payload).subscribe((result) => {
			console.log(result)

			this.snackBar.open('Slot Booked', 'OK', this.snackBarconfig)
			this.getAllSlot()
		})
	}
	updateSlot(payload) {
		this.http.put('/api/slot', payload).subscribe((result) => {
			console.log(result)
			this.snackBar.open('Slot Updated', 'OK', this.snackBarconfig)
			this.getAllSlot()
		})
	}

	onSlotClick(slot) {
		console.log(slot)
		let data = {}
		let isForEdit = false;
		if (this.bookedSlotDetails[slot]) {
			data = this.bookedSlotDetails[slot],
				isForEdit = true;
		}
		const dialogObj = this.dialog.open(SlotDetailsComponent, {
			width: '500px',
			data: { slotDetails: data, isForEdit: isForEdit },
			disableClose: true
		})
		
		dialogObj.afterClosed().subscribe((result) => {
			if (result) {
				if (!result['isForDelete']) {
					let payload = result['data']
					this.bookedSlotDetails[slot] = result['data']
					payload['slot'] = slot
					payload['booked'] = 1
					if (isForEdit) {
						this.updateSlot(payload)
					} else {
						this.saveSlot(payload)
					}
				} else {
					this.deleteSlot(slot)
				}
			}
		})
	}

	deleteSlot(slotNo) {
		console.log(this.bookedSlotDetails)
		this.http.put('/api/deleteSlot', { slotId: this.bookedSlotDetails[slotNo]['_id'] }).subscribe((result) => {
			this.snackBar.open('Slot Deleted', 'OK', this.snackBarconfig)
			this.getAllSlot()

		})
	}

}
