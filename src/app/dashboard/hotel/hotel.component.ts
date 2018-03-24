import { Component, OnInit } from '@angular/core';
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-hotel',
    templateUrl: 'hotel.component.html',
    styles: []
})
export class HotelComponent implements OnInit {

    public _event : Event;
    public _attendance : Attendance[];

    public _showForm : Boolean = false;
    public _selectedBooking : String;

    public isAdmin : Boolean;

    constructor(private apiService : ApiService, private route : ActivatedRoute, private userService : UserService) { }

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();
        this.initEvent();
    }

    initEvent(){
        this.apiService.getEventAndAttendace(this.route.snapshot.params['id']).subscribe(data => {
            this._event = data[0];
            this._attendance = data[1];
        });
    }

    submitForm(message){
        this._showForm = false;
        this._selectedBooking = undefined;

        this._event = undefined;
        this._attendance = undefined;

        this.initEvent();
    }

    newBooking(){
        this._showForm = true;
    }

    editBooking(booking){
        this._selectedBooking = booking;
        this._showForm = true;
    }

}
