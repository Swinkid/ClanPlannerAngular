import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";


@Injectable()
export class ApiService {

    constructor(private _http: HttpClient, private authService: AuthService) { }

    getEvents(){
        return this._http.get('/api/events', { headers: {'x-access-token': this.authService.getToken()} });
    }

}
