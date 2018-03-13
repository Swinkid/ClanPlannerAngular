import {Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';

import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";

import {Event} from "../../interfaces/event";
import {UserService} from "../../services/user.service";
import {User} from "../../interfaces/user";



@Component({
    selector: 'dashboard-register',
    templateUrl: 'events.template.html',
    styles: []
})
export class EventsComponent implements OnInit {

    public events: Event[];
    public isAdmin : Boolean = false;
    public userId: String;

    constructor(public authService : AuthService, private apiService : ApiService, public userService : UserService ) {

    }

    ngOnInit() {
        this.getEvents();
        this.userId = this.userService.getUserId();
    }

    getEvents(){
        this.isAdmin = this.userService.isAdmin();

        this.apiService.getEvents().subscribe(
            data => {this.events = data },
            err => function () {},
            () => {}
        );
    }

    registerAttendance(event : String, attending: String){
        this.apiService.registerAttendance(event, attending).subscribe(
            data => {},
            error => {},
            () =>{
                this.getEvents();
            }
        );
    }

    isUserAttending(event: Event, user : String) {

        let foundUser = _.find(event.users, function (u) {
            if(u.userId === user){
                return true;
            } else {
                return false;
            }
        });

        return foundUser !== undefined;

    }
}
