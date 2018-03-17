import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Attendance} from "../../interfaces/attendance";
import {ApiService} from "../../services/api.service";
import {Event} from "../../interfaces/event";
import {Booking} from "../../interfaces/hotel/booking";

@Component({
  selector: 'app-booking',
  templateUrl: 'booking.template.html',
  styles: []
})
export class BookingComponent implements OnInit {

    private event: Event;
    public bookingForm  : FormGroup;
    public attendees    : Attendance[];
    public oldBooking      : Booking;
    public oldBookingId     : String;

    public roomType: String[] = [
        'Single',
        'Twin',
        'Family'
    ];

    constructor(private _fb : FormBuilder, private route : ActivatedRoute, public apiService : ApiService, public router : Router) {


    }

    ngOnInit() {
        this.oldBookingId = this.route.snapshot.params['id'];

        if(this.oldBookingId) {
            this.apiService.getBooking(this.oldBookingId).subscribe(

                data => {
                    this.oldBooking = data;
                },
                error => {},
                () => {

                    this.setAttendance();
                }
            );
        } else {
            this.router.navigate(['/dashboard']);
        }
    }

    setForm(){

        this.bookingForm = new FormGroup({

            bookedBy: new FormControl(this.oldBooking.booking.bookedBy, [
                Validators.required,
            ]),
            bookedRoomType: new FormControl(this.oldBooking.booking.roomType, [
                Validators.required
            ]),
            totalCost: new FormControl(this.oldBooking.booking.totalCost || 0.00,[
                Validators.required,
            ]),
            rooms: this.buildRoomsArray(this._fb)

        });


    }

    buildRoomsArray(_fb){

        let oldRooms = [];

        this.oldBooking.booking.rooms.forEach(function (room) {

            var oldRoomOccupants = [];

            room.roomOccupants.forEach(function (occupant) {

               oldRoomOccupants.push(_fb.group({
                   occupant: occupant
               }));

            });

            oldRooms.push(_fb.group({
                roomOccupants: _fb.array(oldRoomOccupants)
            }));

        });

        return new FormArray(oldRooms);

    }

    setAttendance(){
        this.apiService.getEvent(this.oldBooking.event).subscribe(
            event => {
                this.event = event;
            },
            err => {

            },
            () => {
                //TODO: prob remove this
                // /this.attendees = this.event.users;
                this.setForm();
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

    onSubmit(form){

        if(form.valid){

            var updatedBooking = {
                event: this.event._id,
                booking: form.value
            };

            this.apiService.updateBooking(this.oldBooking._id, updatedBooking).subscribe(
                booking => {},
                error => { console.log(error); },
                () => {
                    this.router.navigate(['/dashboard/events']);
                }
            );


        }

    }
}
