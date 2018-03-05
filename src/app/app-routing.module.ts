import {ModuleWithProviders, NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticateGuard} from "./guards/authenticate.guard";

import { LoginComponent } from "./login/login.component"
import {LogoutComponent} from "./logout.component";


const routes: Routes = [
    { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthenticateGuard]},
    { path: 'logout', component: LogoutComponent, canActivate: [AuthenticateGuard] },
    { path: '', component: LoginComponent }
];

export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes);
