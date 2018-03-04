import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component"

import {AuthenticateGuard} from "./guards/authenticate.guard";

const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticateGuard]},
    {path: '', component: LoginComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
