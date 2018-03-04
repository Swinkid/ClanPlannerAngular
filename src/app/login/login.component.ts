import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-login',
  template: `
    <p>
      <a href="/auth/discord">Login With Discord</a>
    </p>
  `,
  styles: []
})
export class LoginComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
  }

}
