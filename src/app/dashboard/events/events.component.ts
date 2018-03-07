import {Component, Input, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";

@Component({
    selector: 'dashboard-register',
    templateUrl: 'events.template.html',
    styles: []
})
export class EventsComponent implements OnInit {

    public events: Object;

    constructor(public authService : AuthService, private apiService : ApiService ) {

    }

    ngOnInit() {
        this.getEvents();
    }

    getEvents(){
        this.apiService.getEvents().subscribe(
            data => {this.events = data },
            err => function () {}
        );
    }



}
