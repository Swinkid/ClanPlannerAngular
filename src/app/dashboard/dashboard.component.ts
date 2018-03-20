import { Component, OnInit } from '@angular/core';

import { UserService } from "../services/user.service";


@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.template.html',
    styleUrls: ['dashboard.styles.css']
})
export class DashboardComponent implements OnInit {

    collapsed = true;
    userId : String;

    constructor(private userService : UserService) { }

    ngOnInit() {
        this.userId = this.userService.getUserId();
    }

    toggleCollapsed(): void {
        this.collapsed = !this.collapsed;
    }

}
