import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {AuthService} from "../../../services/auth.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../../../interfaces/event";
import {Attendance} from "../../../interfaces/attendance";

@Component({
    selector: 'app-edit',
    templateUrl: 'edit.template.html',
    styles: []
})
export class EditComponent implements OnInit {

    //TODO: ROLES!!!!!!!!!!

    event            : Event;
    attendees        : Attendance[];

    constructor(public authService : AuthService, private apiService : ApiService, private route: ActivatedRoute, public userService : UserService) { }

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
            }
        );

    }

    setAttendees(event : Event){
        this.attendees = event.users;
    }

}
