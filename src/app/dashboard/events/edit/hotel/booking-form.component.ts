import { Component, OnInit } from '@angular/core';
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Attendance} from "../../../../interfaces/attendance";
import {ApiService} from "../../../../services/api.service";

import {Booking} from "../../../../interfaces/hotel/booking";
import {Event} from "../../../../interfaces/event";


@Component({
    selector: 'booking-form',
    templateUrl: 'booking-form.template.html',
    styles: []
})
export class BookingFormComponent implements OnInit {

    private event: Event;
    public bookingForm  : FormGroup;
    public attendees    : Attendance[];

    roomType: String[] = [
        'Single',
        'Twin',
        'Family'
    ];

    constructor(private _fb : FormBuilder, private route : ActivatedRoute, public apiService : ApiService) {

        this.bookingForm = new FormGroup({

            bookedBy: new FormControl(),
            totalCost: new FormControl(),
            rooms: this._fb.array([
                this.initRooms()
            ])

        });

        console.log(this.bookingForm);
        this.setAttendance();
    }

    ngOnInit() {
    }

    setAttendance(){
        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(
            event => {
                    this.event = event;
            },
            err => {

            },
            () => {
                this.attendees = this.event.users;
            }
        )
    }

    initRooms(){
        return this._fb.group({

            roomOccupants: this._fb.array([
                this.initOccupants()
            ])

        });
    }

    initOccupants(){
        return this._fb.group({
            occupant: 'Available'
        });
    }

    addRoom(){
       const control = <FormArray>this.bookingForm.get('rooms');
       control.push(this.initRooms());
    }

    removeRoom(r: number){
        const control = <FormArray>this.bookingForm.controls['rooms'];
        control.removeAt(r);
    }

    getRooms(form){
        return form.controls.rooms.controls;
    }

    getOccupants(form){
        return form.controls.roomOccupants.controls;
    }

    addOccupant(r){
        const control = <FormArray>this.bookingForm.get('rooms')['controls'][r].controls.roomOccupants;
        control.push(this.initOccupants());
    }

    removeOccupant(r, o){
        const control = <FormArray>this.bookingForm.get('rooms')['controls'][r].controls.roomOccupants;
        control.removeAt(o);
    }

}
