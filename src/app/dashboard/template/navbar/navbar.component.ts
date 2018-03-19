import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'dashboard-navbar',
    templateUrl: 'navbar.template.html',
    styleUrls: ['../../dashboard.styles.css']
})
export class NavbarComponent implements OnInit {

    public userId : String;
    public username : String;

    public eventId : String;

    constructor(private userService : UserService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.eventId = this.route.snapshot.params.id;
        this.userId = this.userService.getUserId();
        this.username = this.userService.getFullUsername();

    }

}
