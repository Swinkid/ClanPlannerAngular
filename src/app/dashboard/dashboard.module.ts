import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardRegisterComponent} from "./dashboard-register.component";
import {DashboardComponent} from "./dashboard.component";
import {Routes, RouterModule} from "@angular/router";
import {AuthenticateGuard} from "../guards/authenticate.guard";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {ApiService} from "../services/api.service";

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'register',
        component: DashboardRegisterComponent,
    }

];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        DashboardRegisterComponent,
        DashboardComponent
    ],
    providers: [
        AuthService,
        AuthenticateGuard,
        CookieService,
        UserService,
        ApiService
    ]
})
export class DashboardModule { }
