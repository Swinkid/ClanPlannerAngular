import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";

import {Event} from "../interfaces/event";
import {User} from "../interfaces/user";
import {Attendance} from "../interfaces/attendance";
import {Booking} from "../interfaces/hotel/booking";
import {Jersey} from "../interfaces/jersey";
import {Quiz} from "../interfaces/quiz";
import {forkJoin} from "rxjs/observable/forkJoin";
import {Competition} from "../interfaces/comp";
import {Meal} from "../interfaces/meal";

@Injectable()
export class ApiService {

    public HEADERS : Object = { headers: {'x-access-token': this.authService.getToken()}};

    constructor(private _http: HttpClient, private authService: AuthService) { }



    getEventsAndAttendeeAttendance(user){
        return forkJoin([this.getAttendeeAttendances(user), this.getEvents()])
    }

    getAttendeeAttendances(user){
        return this._http.get<Attendance[]>('/api/attendance/all/' + user, { headers: {'x-access-token': this.authService.getToken()}});
    }

    getEvents(){
        return this._http.get<Event[]>('/api/events', { headers: {'x-access-token': this.authService.getToken()} });
    }

    public getEvent(event : String){
        //TODO make private
        return this._http.get<Event>('/api/events/' + event, { headers: {'x-access-token': this.authService.getToken()} });
    }

    private getAttendance(event : String){
        return this._http.get<Attendance[]>('/api/attendance/' + event, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public getEventAndAttendace(event : String){
        return forkJoin([this.getEvent(event), this.getAttendance(event)]);
    }


    public registerAttendance(event : String, attending : Boolean){
        return this._http.post('/api/attendee/register/' + event, { attendance: attending }, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public updateAttendance(eventId : String, user : String, formValue){
        return this._http.post('/api/attendance/' + user + '/' + eventId, formValue, { headers: {'x-access-token': this.authService.getToken()} });
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
        return this._http.get<User>('/api/user/' + userId, { headers: {'x-access-token': this.authService.getToken()} });
    }

    public updateUser(user, formValue){
        return this._http.post('/api/user/' + user, formValue, { headers: {'x-access-token': this.authService.getToken()} });
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

    public getTable(table){
        return this._http.get<Quiz>('/api/quiz/' + table, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public getEventTables(event){
        return this._http.get<Quiz[]>('/api/quiz/event/' + event, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public addTable(event, formValue){
        return this._http.post('/api/quiz/' + event, formValue, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public updateTable(table, formValue){
        return this._http.post('/api/quiz/update/' + table, formValue, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public deleteTable(table){
        return this._http.delete('/api/quiz/' + table, { headers: {'x-access-token': this.authService.getToken()}});
    }

    public getComps(event){
        return this._http.get<Competition[]>('/api/comps/all/' + event, this.HEADERS);
    }

    public getComp(comp){
        return this._http.get<Competition>('/api/comps/' + comp, this.HEADERS);
    }

    public addComp(event, formValue){
        return this._http.post('/api/comps/all/' + event, formValue, this.HEADERS);
    }

    public updateComp(comp, formvalue){
        return this._http.post('/api/comps/' + comp, formvalue, this.HEADERS);
    }

    public deleteComp(comp){
        return this._http.delete('/api/comps/' + comp, this.HEADERS);
    }

    public getMeals(event){
        return this._http.get<Meal[]>('/api/meal/all/' + event, this.HEADERS);
    }

    public getMeal(meal){
        return this._http.get<Meal>('/api/meal/' + meal, this.HEADERS);
    }

    public getMealByUser(user){
        return this._http.get<Meal>('/api/meal/user/' + user, this.HEADERS);
    }

    public addMeal(event, user, formValue){
        return this._http.post('/api/meal/all/' + event + '/' + user, formValue, this.HEADERS);
    }

    public updateMeal(meal, formValue){
        return this._http.post('/api/meal/' + meal, formValue, this.HEADERS);
    }

    public deleteMeal(meal){
        return this._http.delete('/api/meal/' + meal, this.HEADERS);
    }

}
