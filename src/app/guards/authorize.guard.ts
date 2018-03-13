import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService) {}

    public canActivate(){

        if(this.userService.isAdmin()){
            return true;
        }

        this.router.navigate(['/dashboard']);
        return false;
    }
}
