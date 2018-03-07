import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";

import {Event} from "../interfaces/event";
import {User} from "../interfaces/user";


@Injectable()
export class ApiService {

    constructor(private _http: HttpClient, private authService: AuthService) { }

    getEvents(){
        return this._http.get('/api/events', { headers: {'x-access-token': this.authService.getToken()} });
    }

    public getEvent(event : String){
        return this._http.get<Event>('/api/events/' + event, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public getUsers(users : String[]){
        return this._http.get<User[]>('/api/users?id=' + users.join(), { headers: {'x-access-token': this.authService.getToken()} });
    }

}
