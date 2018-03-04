import { Component, OnInit } from '@angular/core';

import { UserService } from "../services/user.service";


@Component({
  selector: 'app-dashboard',
  template: `
    <p>
      dashboard works! {{username}} <a [routerLink]="['/logout']">Logout</a>
        <i class="fas fa-address-card"></i>
    </p>
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
