import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as _ from 'lodash';

import {ApiService} from "../../../services/api.service";
import {AuthService} from "../../../services/auth.service";
import {UserService} from "../../../services/user.service";

import {Event} from "../../../interfaces/event";
import {Attendance} from "../../../interfaces/attendance";

@Component({
    selector: 'dashboard-event',
    templateUrl: 'event.template.html',
    styles: []
})
export class EventComponent implements OnInit {

    public event            : Event;
    public attendees        : Attendance[];
    public attendee         : Attendance;
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


    constructor(public authService : AuthService, private apiService : ApiService, private route: ActivatedRoute, public userService : UserService) {

    }

    ngOnInit() {
        this.setEvent();
    }

    setEvent(){

        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(
            event => {
                this.event = event;
            },
            err => {},
            () => {

                this.setAttendees(this.event);
                this.setAttendee(this.userService.getUserId(), this.event);

                if(this.attendee){
                    this.setForm(this.attendee);
                }


            }
        );

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

    setAttendees(event : Event){
        this.attendees = event.users;
    }

    setAttendee(user : String, event : Event){
        let foundUser = _.find(event.users, function (u) {
            if(u.userId === user){
                return true;
            } else {
                return false;
            }
        });

        this.attendee = foundUser;
    }

    isUserAttending(user : String, event : Attendance[]){
        let foundUser = _.find(event, function (u) {
            if(u.userId === user){
                return true;
            } else {
                return false;
            }
        });

        return foundUser !== undefined;
    }

    submitForm(){

        if(this.attendeeForm.status === "VALID"){
            this.apiService.updateAttendance(this.event._id, this.attendeeForm.value).subscribe(
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


    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
}
