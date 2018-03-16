import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as _ from 'lodash';

import {ApiService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";

import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";

@Component({
    selector: 'dashboard-event',
    templateUrl: 'event.component.html',
    styles: []
})
export class EventComponent implements OnInit {

    public _event            : Event;
    public _attendees        : Attendance[];
    public _attendee         : Attendance;
    public _editing          : Boolean = false;

    constructor(public authService : AuthService, private apiService : ApiService, private route: ActivatedRoute, public userService : UserService) {}

    ngOnInit() {
        this.setEvent();
    }

    setEvent(){
        this.apiService.getEventAndAttendace(this.route.snapshot.params['id']).subscribe(
            data => {
                this._event = data[0];
                this._attendees = data[1];
                this.setAttendee(this.userService.getUserId());
            },
            error => {
                //TODO: Error handling
            }
        )
    }

    setAttendee(user : String){
        let foundUser = _.find(this._attendees, function (u) {
            if(u.user._id === user){
                return true;
            } else {
                return false;
            }
        });

        this._attendee = foundUser;
    }
}
