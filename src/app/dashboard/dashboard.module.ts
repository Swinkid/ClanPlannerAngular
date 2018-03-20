import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { AuthenticateGuard } from "../guards/authenticate.guard";

import { CookieService } from "ngx-cookie-service";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { ApiService } from "../services/api.service";


import { DashboardComponent} from "./dashboard.component";
import { NavbarComponent } from './template/navbar/navbar.component';
import { EventsComponent} from "./events/events.component";
import { EventStatsComponent } from './event/event-stats.component';
import { EventComponent } from './event/event.component';
import { EditComponent } from './event/edit.component';
import { NewComponent } from './events/new/new.component';
import { AttendeeComponent } from "./event/attendee/attendee.component";
import { BookingFormComponent } from './hotel/booking-form.component';
import { DisplayBookingsComponent } from './hotel/display-bookings.component';
import { BookingComponent } from './hotel/booking.component';
import { AuthorizeGuard} from "../guards/authorize.guard";
import { JerseysComponent } from './jerseys/jerseys.component';
import { AddJersyComponent } from './jerseys/add-jersy.component';
import { ShowJerseysComponent} from "./jerseys/show-jerseys.component";
import { MealComponent } from './meal/meal.component';
import { MealAttendanceComponent } from './meal/meal-attendance.component';
import { MealFormComponent } from './meal/meal-form.component';
import { QuizComponent } from './quiz/quiz.component';
import { TableFormComponent } from './quiz/table-form.component';
import { TableListComponent } from './quiz/table-list.component';
import { SeatingPlanComponent } from './seating-plan/seating-plan.component';
import { SeatingPlanFormComponent } from './seating-plan/seating-plan-form.component';
import { SeatingPlanListComponent } from './seating-plan/seating-plan-list.component';
import { AttendeeListComponent } from './event/attendee-list.component';
import { AttendeeFormComponent } from './event/attendee-form.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileFormComponent } from './profile/profile-form.component';
import { ProfileEditComponent } from './profile/profile-edit.component';
import { CompComponent } from './competitions/comp.component';
import { CompListComponent } from './competitions/comp-list.component';
import { CompFormComponent } from './competitions/comp-form.component';



const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [

            { path : '', component: EventsComponent },
            { path: 'events/:id', children: [
                { path: '', component: EventComponent},
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'hotel/:id', children: [
                { path: '', component: DisplayBookingsComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'jerseys/:id', children: [
                { path: '', component: JerseysComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'quiz/:id', children: [
                { path: '', component: QuizComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'meal/:id', children: [
                { path: '', component: MealComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'comps/:id', children: [
                { path: '', component: CompComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'seating/:id', children: [
                { path: '', component: SeatingPlanComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'edit/event/:id', canActivate: [AuthorizeGuard], children: [
                { path: '', component: EditComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'new/event', canActivate: [AuthorizeGuard], children: [
                { path: '', component: NewComponent },
            ]},
            { path: 'edit/event/attendee/:id/:attendee', canActivate: [AuthorizeGuard], children: [
                { path: '', component: AttendeeComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'new/booking/:id' , canActivate: [AuthorizeGuard], children: [
                { path: '', component: BookingFormComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'edit/booking/:id/:event', canActivate: [AuthorizeGuard], children: [
                { path: '', component: BookingComponent },
                { path: '', component: NavbarComponent, outlet: 'nav'}
            ]},
            { path: 'profile/:id', component: ProfileComponent },
            { path: 'profile/edit/:id', component: ProfileEditComponent },


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
        EventsComponent,
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
        MealFormComponent,
        QuizComponent,
        TableFormComponent,
        TableListComponent,
        CompListComponent,
        CompFormComponent,
        SeatingPlanComponent,
        SeatingPlanFormComponent,
        SeatingPlanListComponent,
        AttendeeListComponent,
        AttendeeFormComponent,
        EventStatsComponent,
        ProfileComponent,
        ProfileFormComponent,
        ProfileEditComponent,
        CompComponent
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
