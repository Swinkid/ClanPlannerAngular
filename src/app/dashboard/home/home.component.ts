import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
    selector: 'dashboard-home',
    templateUrl: 'home.template.html',
    styleUrls: ['../dashboard.styles.css']
})
export class HomeComponent implements OnInit {

    username: String = this.userService.getUsername();

    constructor(private userService : UserService) { }

    ngOnInit() {
    }

}
