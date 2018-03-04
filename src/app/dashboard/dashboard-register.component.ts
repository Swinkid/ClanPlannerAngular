import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from "../services/auth.service";
import { ApiService } from "../services/api.service";

@Component({
    selector: 'app-dashboard-register',
    template: `
        <p>
            dashboard-register works!
        </p>
    `,
    styles: []
})
export class DashboardRegisterComponent implements OnInit {

    events: Object;

    constructor(public authService : AuthService, private apiService : ApiService ) {

    }

    ngOnInit() {
        this.getEvents();
    }


    getEvents(){
        console.log("Sending?");
        this.apiService.getEvents().subscribe(
            data => {this.events = data},
            err => console.log(err),
            () => console.log(this.events)
        );
    }



}
