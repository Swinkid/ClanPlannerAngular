import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";

@Component({
    selector: 'dashboard-register',
    templateUrl: 'register.template.html',
    styles: []
})
export class RegisterComponent implements OnInit {

    events: Object;

    constructor(public authService : AuthService, private apiService : ApiService ) {

    }

    ngOnInit() {
        this.getEvents();
    }


    getEvents(){
        console.log("Sending?");
        this.apiService.getEvents().subscribe(
            data => {this.events = data[0].name },
            err => console.log(err),
            () => console.log(this.events)
        );
    }



}
