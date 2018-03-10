import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";

import {Event} from "../interfaces/event";
import {User} from "../interfaces/user";
import {Attendance} from "../interfaces/attendance";


@Injectable()
export class ApiService {

    constructor(private _http: HttpClient, private authService: AuthService) { }

    getEvents(){
        return this._http.get<Event[]>('/api/events', { headers: {'x-access-token': this.authService.getToken()} });
    }

    public getEvent(event : String){
        return this._http.get<Event>('/api/events/' + event, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public getUsers(users : Attendance[]){
        var queryId = users.map(function (u) {
            return u._id;
        }).join(',');

        return this._http.get<Attendance[]>('/api/users?id=' + queryId, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public registerAttendance(event : String, attending : String){
        return this._http.post('/api/events/register/' + event, { attendance: attending }, { headers: {'x-access-token': this.authService.getToken()} });
    }

    //public updateAttendance(eventId : String, realName : String, broughtTicket : Boolean, onSeatPicker : Boolean, dateArriving : String, accommodation : String, transportPlans : String, location : String, inFacebookChat : Boolean){
    public updateAttendance(eventId : String, formValue){
        return this._http.post('/api/events/attendance/' + eventId,
            {
                formValue
            }, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public updateAttendee(eventId, userId, formValue){
        return this._http.post('/api/events/attendee/' + eventId + '/' + userId,
            {
                formValue
            }, { headers: {'x-access-token': this.authService.getToken()} });

    }

    public updateEvent(eventId, formValue){
        return this._http.post('/api/events/' + eventId,
            {
                formValue
            }, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public deleteEvent(eventId){
        return this._http.delete('/api/events/' + eventId, {
            headers: {
                'x-access-token': this.authService.getToken()
            }});
    }

    public addEvent(formValue){
        return this._http.post('/api/events',
            {
                formValue
            }, { headers: {'x-access-token': this.authService.getToken()} });
    }

}
