import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Event} from "../../../interfaces/event";
import {Attendance} from "../../../interfaces/attendance";
import {ApiService} from "../../../services/api.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Route} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import * as _ from 'lodash';

@Component({
    selector: 'app-attendee',
    templateUrl: 'attendee.template.html',
    styles: []
})
export class AttendeeComponent implements OnInit {

    public event            : Event;
    public attendeeForm        : FormGroup;
    public attendee         : Attendance;

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

    constructor(public authService : AuthService, private apiService : ApiService, private route: ActivatedRoute, public userService : UserService) { }

    ngOnInit() {
        this.setEvent();
    }


    setForm(attendee : Attendance){
        this.attendeeForm = new FormGroup({
            realName: new FormControl(attendee.realName,[
                Validators.required,
                Validators.maxLength(20)
            ]),
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

    setEvent(){

        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(
            event => {
                this.event = event;
            },
            err => {},
            () => {

                this.setAttendee(this.route.snapshot.params['attendee'], this.event);

                if(this.attendee){
                    this.setForm(this.attendee);
                }
            }
        );

    }

    setAttendee(user : String, event : Event){
        this.attendee = _.find(event.users, function (u) {
            if (u.userId === user) {
                return true;
            } else {
                return false;
            }
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
            this.apiService.updateAttendee(this.event._id, this.attendee.userId, this.attendeeForm.value).subscribe(
                event => {

                },
                err => {

                },
                () =>{
                    this.setEvent();
                    this.submitted = true;
                }
            );
        }
    }
}
