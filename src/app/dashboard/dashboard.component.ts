import { Component, OnInit } from '@angular/core';

import { UserService } from "../services/user.service";


@Component({
    selector: 'app-dashboard',
    template: `
        <p>
            dashboard works! {{username}}
            <i class="fas fa-address-card"></i>
            <a routerLink="/dashboard/register" routerLinkActive="active">Heroes</a>
        </p>
        <router-outlet></router-outlet>
    `,
    styles: [
    ]
})
export class DashboardComponent implements OnInit {

    username: String = this.userService.getUsername();

    constructor(private userService : UserService) { }

    ngOnInit() {
    }

}
