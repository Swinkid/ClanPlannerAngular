import { Component, OnInit } from '@angular/core';
import {Attendance} from "../../interfaces/attendance";
import {ApiService} from "../../services/api.service";
import {UserService} from "../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {Meal} from "../../interfaces/meal";
import * as _ from 'lodash';

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
    public userId : String;

    constructor(private route: ActivatedRoute, private apiService : ApiService, private userService : UserService) { }

    ngOnInit() {
        this.userId = this.userService.getUserId();

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
                this.initShowForm();
            },
            error => {
                this.initShowForm();
            },
            () => {

            }
        );
    }

    initShowForm(){
        if(this._selectedMeal){
            this.showForm = false;
        } else {
            this.showForm = true;
            this._editing = false;
        }
    }

    refresh(message){
        this._selectedMeal = undefined;
        this.showForm = false;
        this._editing = false;
        this.initMeal();

        this._event = undefined;
        this._attendees = undefined;
        this.initEvent();
    }

    editForm(meal){
        this._selectedMeal = undefined;

        this.apiService.getMeal(meal).subscribe(
            data => {
                this._selectedMeal = data;
                this.showForm = true;
                this._editing = true;
            }
        );
    }

    isUserAttending(user : String){
        let foundUser = _.find(this._attendees, function (attendee) {
            if(attendee.user._id === user){
                return true;
            } else {
                return false;
            }
        });

        return foundUser !== undefined;
    }

}
