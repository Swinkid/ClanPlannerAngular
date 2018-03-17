import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
    selector: 'dashboard-navbar',
    templateUrl: 'navbar.template.html',
    styleUrls: ['../../dashboard.styles.css']
})
export class NavbarComponent implements OnInit {

    collapsed = true;

    public userId : String;
    public username : String;

    constructor(private userService : UserService) { }


    toggleCollapsed(): void {
        this.collapsed = !this.collapsed;
    }

    ngOnInit() {

        this.userId = this.userService.getUserId();
        this.username = this.userService.getFullUsername();

    }

}
