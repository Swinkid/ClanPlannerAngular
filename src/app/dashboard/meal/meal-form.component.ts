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

    public isAdmin : Boolean;

    constructor(private userService : UserService, private _fb : FormBuilder, private apiService : ApiService) { }

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();
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
                        Validators.max(4)
                    ]),
                    dietaryRequirements: new FormControl(this._selectedMeal.dietaryRequirements, [

                    ]),
                    passengers: this._fb.array(this.initPassengers(this._fb))
                });
            }

        } else {

            this.mealForm = new FormGroup({
                needsLift: new FormControl(true, [
                    Validators.required
                ]),
                drivingNumberOfSeats: new FormControl(0, [
                    Validators.max(4)
                ]),
                dietaryRequirements: new FormControl('', [

                ]),
            });

        }

        console.log(this.mealForm);

    }

    initPassengers(_fb){
        var returnArray = [];

        if(this._selectedMeal.passengers.length > 0){
            this._selectedMeal.passengers.forEach(function (p) {
                if(p){
                    returnArray.push(_fb.control(p._id));
                } else {
                    returnArray.push(_fb.control(''));
                }
            });
        } else {
            returnArray.push(_fb.control(''));
        }


        return returnArray;
    }

    initPassenger(){
        return this._fb.control('');
    }

    onSubmit(form){

        if(form.valid){
            if(this._editing){

                this.apiService.updateMeal(this._selectedMeal._id, form.value).subscribe(data =>{
                    this.submittedForm.emit(true);
                })
            } else {

                this.apiService.addMeal(this._event._id, this.userService.getUserId(), form.value).subscribe(data =>{

                    this.submittedForm.emit(true);

                }, error => {})


            }
        }

    }

    addPassenger(){
       const control = <FormArray>this.mealForm.controls['passengers'];
       control.push(this.initPassenger());
       console.log(this.mealForm.value.passengers.length);
    }

    getPassengers(form){
        return form.controls.passengers.controls;
    }

}
