import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthenticateGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService) {}

    public canActivate(){

        if(!this.authService.isTokenExpired()){
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }

}
