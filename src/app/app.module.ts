import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {LogoutComponent} from "./logout.component";

import { AuthService } from "./services/auth.service";
import { AuthenticateGuard } from "./guards/authenticate.guard";

import { CookieService } from 'ngx-cookie-service';
import { UserService } from "./services/user.service";
import { ApiService } from "./services/api.service";




@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LogoutComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule.forRoot()
    ],
    providers: [
        AuthService,
        AuthenticateGuard,
        CookieService,
        UserService,
        ApiService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
