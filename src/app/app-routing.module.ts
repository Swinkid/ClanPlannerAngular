import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticateGuard} from "./guards/authenticate.guard";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component"
import { DashboardRegisterComponent } from "./dashboard/dashboard-register.component";
import { DashboardLogoutComponent } from "./dashboard/dashboard-logout.component";

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticateGuard]},
    { path: 'dashboard/register', component: DashboardRegisterComponent, canActivate: [AuthenticateGuard] },
    { path: 'logout', component: DashboardLogoutComponent, canActivate: [AuthenticateGuard] },
    { path: '', component: LoginComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
