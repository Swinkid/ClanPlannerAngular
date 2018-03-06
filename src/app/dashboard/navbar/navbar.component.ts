import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dashboard-navbar',
    templateUrl: 'navbar.template.html',
    styleUrls: ['../dashboard.styles.css']
})
export class NavbarComponent implements OnInit {

    collapsed = true;

    constructor() { }


    toggleCollapsed(): void {
        this.collapsed = !this.collapsed;
    }

    ngOnInit() {
    }

}
