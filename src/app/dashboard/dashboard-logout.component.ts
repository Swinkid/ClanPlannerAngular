import { Component, OnInit } from '@angular/core';
import {Router } from "@angular/router";

import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-dashboard-logout',
  template: '',
  styles: []
})
export class DashboardLogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
      this.authService.deleteToken();
      this.router.navigate(['/']);
  }

}
