import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Routes, RouterModule} from "@angular/router";

import {AuthenticateGuard} from "../guards/authenticate.guard";

import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {ApiService} from "../services/api.service";

import { NavigationComponent } from './navigation/navigation.component';
import {EventsComponent} from "./events/events.component";
import { DashboardComponent} from "./dashboard.component";
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { EventComponent } from './events/event/event.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path :'', component: HomeComponent },
            { path: 'events', component: EventsComponent },
            { path: 'events/:id', component: EventComponent }
        ]
    }

];

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    declarations: [
        DashboardComponent,
        NavigationComponent,
        EventsComponent,
        HomeComponent,
        NavbarComponent,
        EventComponent
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
