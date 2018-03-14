import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { AuthenticateGuard } from "../guards/authenticate.guard";

import { CookieService } from "ngx-cookie-service";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { ApiService } from "../services/api.service";

import { NavigationComponent } from './navigation/navigation.component';
import { EventsComponent} from "./events/events.component";
import { DashboardComponent} from "./dashboard.component";
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EventComponent } from './events/event/event.component';
import { EditComponent } from './events/edit/edit.component';
import { NewComponent } from './events/new/new.component';
import { AttendeeComponent } from "./events/edit/attendee/attendee.component";
import { BookingFormComponent } from './events/new/booking-form.component';
import { DisplayBookingsComponent } from './events/event/display-bookings.component';
import { BookingComponent } from './events/edit/booking.component';
import {AuthorizeGuard} from "../guards/authorize.guard";
import { JerseysComponent } from './jerseys/jerseys.component';
import { AddJersyComponent } from './jerseys/add-jersy.component';
import { ShowJerseysComponent} from "./jerseys/show-jerseys.component";
import { MealComponent } from './meal/meal.component';
import { MealAttendanceComponent } from './meal/meal-attendance.component';
import { MealFormComponent } from './meal/meal-form.component';


const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path :'', component: HomeComponent },
            { path: 'events', component: EventsComponent },
            { path: 'events/:id', component: EventComponent },
            { path: 'edit/event/:id', component: EditComponent , canActivate: [AuthorizeGuard]},
            { path: 'new/event', component: NewComponent , canActivate: [AuthorizeGuard]},
            { path: 'edit/event/attendee/:id/:attendee', component: AttendeeComponent , canActivate: [AuthorizeGuard]},
            { path: 'new/booking/:id', component: BookingFormComponent , canActivate: [AuthorizeGuard]},
            { path: 'edit/booking/:id', component: BookingComponent, canActivate: [AuthorizeGuard] },
        ]
    }

];

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        DashboardComponent,
        NavigationComponent,
        EventsComponent,
        HomeComponent,
        NavbarComponent,
        EventComponent,
        EditComponent,
        NewComponent,
        AttendeeComponent,
        BookingFormComponent,
        DisplayBookingsComponent,
        BookingComponent,
        JerseysComponent,
        AddJersyComponent,
        ShowJerseysComponent,
        MealComponent,
        MealAttendanceComponent,
        MealFormComponent
    ],
    providers: [
        AuthService,
        AuthenticateGuard,
        AuthorizeGuard,
        CookieService,
        UserService,
        ApiService
    ]
})
export class DashboardModule { }
