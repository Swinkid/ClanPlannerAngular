import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {Attendance} from "../../interfaces/attendance";
import {ApiService} from "../../services/api.service";
import {UserService} from "../../services/user.service";

import {Event} from "../../interfaces/event";

@Component({
    selector: 'app-attendee-form',
    templateUrl: 'attendee-form.component.html',
    styles: []
})
export class AttendeeFormComponent implements OnInit {

    @Input() public _event      : Event;
    @Input() public _attendee   : Attendance;
    @Input() public _editing    : Boolean;

    @Output() public savedForm: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    public attendeeForm     : FormGroup;
    public submitted        : Boolean = false;

    public transport = [
        'Driving',
        'Lift',
        'Train',
        'Plane',
        'Nearby',
        'Other'
    ];

    public tickets = [
        true,
        false
    ];

    public seatPicker = [
        true,
        false
    ];

    public facebookChat = [
        true,
        false
    ];

    public accomodation = [
        'Hotel',
        'Camping',
        'Nearby'
    ];

    constructor(private apiService : ApiService, private userService : UserService) { }

    ngOnInit() {
        this.setForm();
    }

    setForm(){
        this.attendeeForm = new FormGroup({
            ticketPurchasedSelect: new FormControl(this._attendee.broughtTicket, [
                Validators.required
            ]),
            seatPickerSelect: new FormControl(this._attendee.onSeatPicker, [
                Validators.required
            ]),
            inFacebookChat: new FormControl(this._attendee.inFacebookChat, [
                Validators.required
            ]),
            arrivalDate: new FormControl(this.formatDate(this._attendee.dateArriving), [
                Validators.required
            ]),
            accommodationSelect: new FormControl(this._attendee.accommodation, [
                Validators.required
            ]),
            transportSelect: new FormControl(this._attendee.transportPlans, [
                Validators.required
            ]),
            location: new FormControl(this._attendee.location, [
                Validators.required,
                Validators.maxLength(20)
            ]),
        });
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    submitForm(){
        if(this.attendeeForm.status === "VALID"){
            this.apiService.updateAttendance(this._event._id, this._attendee.user._id, this.attendeeForm.value).subscribe(
                event => {

                },
                err => {

                },
                () =>{
                    this.savedForm.emit(true);
                    this.submitted = true;
                }
            );
        }
    }

    isUserAttending(user : String){
        return this.userService.getUserId() === user ? true : false;
    }

}
