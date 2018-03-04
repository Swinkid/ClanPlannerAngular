import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

import { CookieService } from 'ngx-cookie-service';

export const TOKEN_NAME: string = 'jwt_token';


@Injectable()
export class AuthService {

    public redirectUrl: string;

    constructor(private cookieService: CookieService) {

    }


    getToken(){
        return this.cookieService.get(TOKEN_NAME);
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);

        if (decoded.exp === undefined) return null;

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired(token?: string): boolean {
        if(!token) token = this.getToken();
        if(!token) return true;

        const date = this.getTokenExpirationDate(token);
        if(date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

}
