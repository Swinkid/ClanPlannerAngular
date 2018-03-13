import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";

import {Event} from "../interfaces/event";
import {User} from "../interfaces/user";
import {Attendance} from "../interfaces/attendance";
import {Booking} from "../interfaces/hotel/booking";
import {Jersey} from "../interfaces/jersey";

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

    public addBooking(event, formValue){
        return this._http.post('/api/booking', {
            event,
            booking: formValue
        }, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public getBookings(event){
        return this._http.get<Booking[]>('/api/booking/' + event._id, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public getUser(userId){
        return this._http.get<User>('/api/user/' + userId, { headers: {'x-access-token': this.authService.getToken()} })
    }

    public removeBooking(booking){
        return this._http.delete('/api/booking/' + booking, {
            headers: {
                'x-access-token': this.authService.getToken()
            }});
    }

    public getBooking(booking){
        return this._http.get<Booking>('/api/booking/edit/' + booking, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public updateBooking(booking, formValues){
        return this._http.post('/api/booking/edit/' + booking, formValues,{ headers: {'x-access-token': this.authService.getToken()}});
    }

    public getJerseys(event){
        return this._http.get<Jersey[]>('/api/jersey/' + event, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public getJersey(event, user){
        return this._http.get<Jersey>('/api/jersey/' + event + '/' + user, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public deleteJersey(event, user){
        return this._http.delete('/api/jersey/' + event + '/' + user, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public addJersey(event, user, formValue){
        return this._http.post('/api/jersey/' + event + '/' + user, formValue, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public updateJersey(event, user, formValue){
        return this._http.post('/api/jersey/update/' + event + '/' + user, formValue, { headers: {'x-access-token': this.authService.getToken()}});
    }

}
