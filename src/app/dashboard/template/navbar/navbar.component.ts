import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {Event} from "../../../interfaces/event";

@Component({
    selector: 'dashboard-navbar',
    templateUrl: 'navbar.template.html',
    styleUrls: ['../../dashboard.styles.css']
})
export class NavbarComponent implements OnInit {

    public userId : String;
    public username : String;

    public eventId : String;
    public _event : Event;

    constructor(private userService : UserService, private route: ActivatedRoute, private apiService : ApiService) { }

    ngOnInit() {
        this.eventId = this.route.snapshot.params.id;
        this.userId = this.userService.getUserId();
        this.username = this.userService.getFullUsername();

        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(data => {
            this._event = data;
        });

    }

}
