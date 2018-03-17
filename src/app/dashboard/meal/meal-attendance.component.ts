import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {Meal} from "../../interfaces/meal";
import {ApiService} from "../../services/api.service";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-meal-attendance',
    templateUrl: 'meal-attendance.component.html',
    styles: []
})
export class MealAttendanceComponent implements OnInit {

    @Input() _event : Event;
    @Input() _attendance : Attendance[];

    @Output() editPrompt : EventEmitter<String> = new EventEmitter<String>();

    public meals : Meal[];

    public isAdmin : Boolean;

    constructor(private apiService : ApiService, private userService : UserService) { }

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();
        this.initMeal();
    }

    initMeal(){
        this.apiService.getMeals(this._event._id).subscribe(data =>{
            this.meals = data;
        }, error =>{});

    }

    getArray(length) {
        var someArray = [];

        for(let i = 0; i < 4; i++){
            someArray.push('');
        }

        return someArray;
    }

    deleteMeal(meal){
        this.apiService.deleteMeal(meal).subscribe(data => {
            this.meals = undefined;
            this.initMeal();
        });
    }

    editMeal(meal){
        this.editPrompt.emit(meal);
    }



}
