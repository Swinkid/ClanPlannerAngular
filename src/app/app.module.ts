import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';


import { AuthService } from "./services/auth.service";
import { AuthenticateGuard } from "./guards/authenticate.guard";

import { CookieService } from 'ngx-cookie-service';
import { UserService } from "./services/user.service";
import { DashboardRegisterComponent } from './dashboard/dashboard-register.component';
import { ApiService } from "./services/api.service";
import { DashboardLogoutComponent } from './dashboard/dashboard-logout.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        LoginComponent,
        DashboardRegisterComponent,
        DashboardLogoutComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [AuthService, AuthenticateGuard, CookieService, UserService, ApiService],
    bootstrap: [AppComponent]
})
export class AppModule { }
