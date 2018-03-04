import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

import { AuthService } from "./services/auth.service";
import { AuthenticateGuard } from "./guards/authenticate.guard";

import { CookieService } from 'ngx-cookie-service';
import { UserService } from "./services/user.service";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [AuthService, AuthenticateGuard, CookieService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
