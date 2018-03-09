import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {ApiService} from "../../../services/api.service";
import {AuthService} from "../../../services/auth.service";

import {User} from "../../../interfaces/user";
import {Event} from "../../../interfaces/event";
import * as _ from 'lodash';
import {UserService} from "../../../services/user.service";

@Component({
    selector: 'dashboard-event',
    templateUrl: 'event.template.html',
    styles: []
})
export class EventComponent implements OnInit {

    public event : Event;
    public users : User[];

    constructor(public authService : AuthService, private apiService : ApiService, private route: ActivatedRoute, public userService : UserService) { }

    ngOnInit() {

        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(event => {

            this.event = event;

            this.apiService.getUsers(event.users).subscribe(users => {

                this.users = users;

            });

        });

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
