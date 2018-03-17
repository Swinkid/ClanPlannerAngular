import { Component, OnInit } from '@angular/core';
import {Attendance} from "../../interfaces/attendance";
import {ApiService} from "../../services/api.service";
import {UserService} from "../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {Meal} from "../../interfaces/meal";

@Component({
    selector: 'app-meal',
    templateUrl: 'meal.component.html',
    styles: []
})
export class MealComponent implements OnInit {

    public _event : Event;
    public _attendees : Attendance[];

    public _editing : Boolean = false;
    public _selectedMeal : Meal;

    public showForm : Boolean = false;

    constructor(private route: ActivatedRoute, private apiService : ApiService, private userService : UserService) { }

    ngOnInit() {
        this.initEvent();
        this.initMeal();
    }

    initEvent(){
        this.apiService.getEventAndAttendace(this.route.snapshot.params['id']).subscribe(
            data => {
                this._event = data[0];
                this._attendees = data[1];
            },
            error => {},
            () => {}
        );
    }

    initMeal(){
        this.apiService.getMealByUser(this.userService.getUserId()).subscribe(
            data => {
                this._selectedMeal = data;
                this.initShowForm(this._selectedMeal);
            },
            error => {
                this.initShowForm(this._selectedMeal);
            },
            () => {

            }
        );
    }

    initShowForm(meal){
        if(this._selectedMeal){
            this.showForm = false;
        } else {
            this.showForm = true;
            this._editing = false;
        }
    }

    refresh(message){
        this._selectedMeal = undefined;
        this.initMeal();
    }

}
