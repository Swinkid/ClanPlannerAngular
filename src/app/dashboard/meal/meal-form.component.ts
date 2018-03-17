import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attendance} from "../../interfaces/attendance";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Meal} from "../../interfaces/meal";
import * as _ from 'lodash';
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";
import {Event} from "../../interfaces/event";

@Component({
    selector: 'app-meal-form',
    templateUrl: 'meal-form.component.html',
    styles: []
})
export class MealFormComponent implements OnInit {

    @Input() _editing : Boolean;
    @Input() _attendees : Attendance[];
    @Input() _event : Event;
    @Input() _selectedMeal : Meal;

    @Output() submittedForm : EventEmitter<Boolean> = new EventEmitter<Boolean>();

    public mealForm : FormGroup;

    public needLiftSelection : Boolean[] = [
      true,
      false
    ];

    constructor(private userService : UserService, private _fb : FormBuilder, private apiService : ApiService) { }

    ngOnInit() {
        this.initForm();
    }

    initForm(){

        if(this._editing && this._selectedMeal){

            if(this.userService.isAdmin()){
                this.mealForm = new FormGroup({
                    needsLift: new FormControl(this._selectedMeal.needsLift, [
                        Validators.required
                    ]),
                    drivingNumberOfSeats: new FormControl(this._selectedMeal.drivingNumberOfSeats, [

                    ]),
                    dietaryRequirements: new FormControl(this._selectedMeal.dietaryRequirements, [

                    ]),
                    passenger: new FormArray(this.setPassengers(this._fb))
                });
            }

            if(!this.userService.isAdmin()){
                this.mealForm = new FormGroup({
                    needsLift: new FormControl(this._selectedMeal.needsLift, [
                        Validators.required
                    ]),
                    drivingNumberOfSeats: new FormControl(this._selectedMeal.drivingNumberOfSeats, [

                    ]),
                    dietaryRequirements: new FormControl(this._selectedMeal.dietaryRequirements, [

                    ])
                });
            }

        } else {

            this.mealForm = new FormGroup({
                needsLift: new FormControl(true, [
                    Validators.required
                ]),
                drivingNumberOfSeats: new FormControl(0, [

                ]),
                dietaryRequirements: new FormControl('', [

                ]),
            });

        }

    }

    setPassengers(_fb){
        var passengers = [];

        this._selectedMeal.passengers.forEach(function (passenger) {
           passengers.push(new FormControl(passenger, [
               Validators.required
           ]));
        });

        return passengers;
    }

    onSubmit(form){

        if(form.valid){
            if(this._editing){
                //DO EDIT
            } else {

                this.apiService.addMeal(this._event._id, this.userService.getUserId(), form.value).subscribe(data =>{

                    this.submittedForm.emit(true);

                }, error => {})


            }
        }

    }

}
