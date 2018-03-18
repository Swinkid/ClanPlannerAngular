import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';

import { ApiService } from "../../services/api.service";
import {UserService} from "../../services/user.service";

import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";

@Component({
    selector: 'dashboard-register',
    templateUrl: 'events.template.html',
    styles: []
})
export class EventsComponent implements OnInit {

    public events: Event[];
    public attendance: Attendance[];

    public isAdmin : Boolean = false;
    public userId: String;

    constructor(private apiService : ApiService, public userService : UserService ) {}

    ngOnInit() {
        this.userId = this.userService.getUserId();
        this.isAdmin = this.userService.isAdmin();
        this.getEvents();
    }

    getEvents(){
        this.apiService.getEventsAndAttendeeAttendance(this.userId).subscribe(
        data =>{
            this.events = data[1];
            this.attendance = data[0];
        },
        error =>{
            //TODO: Error handling
        });
    }

    registerAttendance(event : String, attending: Boolean){
        this.apiService.registerAttendance(event, attending).subscribe(
            data => {},
            error => {},
            () =>{
                this.getEvents();
            }
        );
    }

    isUserAttending(event) {
        let userId = this.userService.getUserId();

        return _.find(this.attendance, function (u) {

            if(u.user._id === userId && u.event._id === event._id){
                return true;
            } else {
                return false;
            }
        });
    }
}
