import {Component, Input, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";

import {Event} from "../../interfaces/event";
import {User} from "../../interfaces/user";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'dashboard-register',
    templateUrl: 'events.template.html',
    styles: []
})
export class EventsComponent implements OnInit {

    public events: Object;
    public userId: String;

    constructor(public authService : AuthService, private apiService : ApiService, public userService : UserService ) {

    }

    ngOnInit() {
        this.getEvents();
        this.userId = this.userService.getUserId();
    }

    getEvents(){
        this.apiService.getEvents().subscribe(
            data => {this.events = data },
            err => function () {}
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

    isUserAttending(event: Event, user : String){

        if(event.users.indexOf(user) > -1){

            return true;

        } else {

            return false;

        }

    }



}
