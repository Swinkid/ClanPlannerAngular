import { Component, OnInit } from '@angular/core';

import { UserService } from "../services/user.service";


@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.template.html',
    styleUrls: ['dashboard.styles.css']
})
export class DashboardComponent implements OnInit {



    constructor() { }

    ngOnInit() {
    }

}
