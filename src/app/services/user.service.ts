import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

import { AuthService } from "./auth.service";

@Injectable()
export class UserService {

    constructor(public authService : AuthService) { }

    public getUserId(){
        return jwt_decode(this.authService.getToken()).user._id;
    }

    public getUsername(){
        return jwt_decode(this.authService.getToken()).user.discord.username;
    }

    public getEmail(){
        return jwt_decode(this.authService.getToken()).user.discord.email;
    }

}
