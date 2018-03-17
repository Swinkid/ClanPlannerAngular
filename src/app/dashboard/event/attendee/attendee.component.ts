import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Event} from "../../../interfaces/event";
import {Attendance} from "../../../interfaces/attendance";
import {ApiService} from "../../../services/api.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import * as _ from 'lodash';

@Component({
    selector: 'app-attendee',
    templateUrl: 'attendee.template.html',
    styles: []
})
export class AttendeeComponent implements OnInit {

    public _event            : Event;
    public attendeeForm        : FormGroup;
    public _attendee         : Attendance;
    public attendeeId   : String;

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

    constructor(private router: Router, public authService : AuthService, private apiService : ApiService, private route: ActivatedRoute, public userService : UserService) { }

    ngOnInit() {
        this.setEvent(this.route.snapshot.params['attendee']);
    }


    setForm(attendee : Attendance){
        this.attendeeForm = new FormGroup({
            ticketPurchasedSelect: new FormControl(attendee.broughtTicket, [
                Validators.required
            ]),
            seatPickerSelect: new FormControl(attendee.onSeatPicker, [
                Validators.required
            ]),
            inFacebookChat: new FormControl(attendee.inFacebookChat, [
                Validators.required
            ]),
            arrivalDate: new FormControl(this.formatDate(attendee.dateArriving), [
                Validators.required
            ]),
            accommodationSelect: new FormControl(attendee.accommodation, [
                Validators.required
            ]),
            transportSelect: new FormControl(attendee.transportPlans, [
                Validators.required
            ]),
            location: new FormControl(attendee.location, [
                Validators.required,
                Validators.maxLength(20)
            ]),
        });
    }

    setEvent(attendeeId){
        this.apiService.getEventAndAttendace(this.route.snapshot.params['id']).subscribe(
            data => {
                this._event = data[0];

                this._attendee = _.find(data[1], function (e) {
                   return e.user._id === attendeeId;
                });

            },
            error => {
                //TODO: Error handling
            },
            () => {
                this.setForm(this._attendee);
            }
        )
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
                    this.router.navigate(['/dashboard/events/' + this._event._id]);
                }
            );
        }
    }
}
