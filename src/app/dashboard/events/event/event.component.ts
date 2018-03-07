import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {ApiService} from "../../../services/api.service";
import {AuthService} from "../../../services/auth.service";

import {User} from "../../../interfaces/user";
import {Event} from "../../../interfaces/event";


@Component({
    selector: 'dashboard-event',
    templateUrl: 'event.template.html',
    styles: []
})
export class EventComponent implements OnInit {

    public event : Event;
    public users : User[];

    constructor(public authService : AuthService, private apiService : ApiService, private route: ActivatedRoute) { }

    ngOnInit() {

        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(event => {

            this.event = event;

            this.apiService.getUsers(event.users).subscribe(users => {

                this.users = users;

            });

        });

    }

}
