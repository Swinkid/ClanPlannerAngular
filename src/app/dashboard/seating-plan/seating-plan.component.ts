import { Component, OnInit } from '@angular/core';
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {Seat} from "../../interfaces/seat";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-seating-plan',
    templateUrl: 'seating-plan.component.html',
    styles: []
})
export class SeatingPlanComponent implements OnInit {

    public _event : Event;
    public _attendees : Attendance[];

    public _selectedSeat : Seat;

    public showForm : Boolean = false;

    public _seats : Seat[];

    constructor(private route: ActivatedRoute, private apiService : ApiService, private userService : UserService) { }

    ngOnInit() {
        this.initEvent();
        this.initSeat();
        this.initSeats();
    }

    public initSeat(){
        this.apiService.getSeat(this.userService.getUserId(), this.route.snapshot.params['id']).subscribe(
            data => {
                this._selectedSeat = data;
                this.showForm = false;
            },
            error => {
                this._selectedSeat = undefined;
                this.showForm = true;
            },
            () => {}
        )
    }

    public initEvent(){
        this.apiService.getEventAndAttendace(this.route.snapshot.params['id']).subscribe(data =>{
            this._event = data[0];
            this._attendees = data[1];
        });
    }

    public initSeats(){
        this.apiService.getSeats(this.route.snapshot.params['id']).subscribe(data => {
            this._seats = data;
        })
    }


    public savedNotify(message){
        this.showForm = false;
        this._selectedSeat = undefined;
        this.initSeat();
        this.initEvent();
        this.initSeats();
    }

    editNotify(message){
        this._selectedSeat = undefined;
        this.showForm = false;

        this.apiService.getSeatById(message).subscribe(data =>{
           this._selectedSeat = data;
           this.showForm = true;
        });
    }

}
