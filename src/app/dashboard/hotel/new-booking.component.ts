import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {Booking} from "../../interfaces/hotel/booking";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-new-booking',
    templateUrl: 'new-booking.component.html',
    styles: []
})
export class NewBookingComponent implements OnInit {

    @Input() _event: Event;
    @Input() _attendance : Attendance[];
    @Input() _selectedBooking : String;

    @Output() savedForm: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    public fetchedBooking : Booking;
    public bookingForm : FormGroup;

    public roomType: String[] = [
        'Single',
        'Twin',
        'Family'
    ];

    constructor(private _fb : FormBuilder, private apiService : ApiService) { }

    ngOnInit() {

        if(this._selectedBooking){
            this.initBooking();
        } else {
            this.initForm();
        }
    }

    initBooking(){
        this.apiService.getBooking(this._selectedBooking).subscribe(data => {
            this.fetchedBooking = data;
            this.initForm();
        });
    }

    initForm(){
        if(this._selectedBooking){
            this.bookingForm = new FormGroup({
                bookedBy: new FormControl(this.fetchedBooking.bookedBy._id, [
                    Validators.required
                ]),
                totalCost: new FormControl(this.fetchedBooking.totalCost, [
                    Validators.required
                ]),
                roomType: new FormControl(this.fetchedBooking.roomType, [
                    Validators.required
                ]),
                rooms: this._fb.array(this.initRooms(this._fb, this.fetchedBooking))
            });
        } else {
            this.bookingForm = new FormGroup({
                bookedBy: new FormControl(this._attendance[0].user._id, [
                    Validators.required
                ]),
                totalCost: new FormControl(0, [
                    Validators.required
                ]),
                roomType: new FormControl(this.roomType[0], [
                    Validators.required
                ]),
                rooms: this._fb.array( [ this.createRoom()] )
            });
        }
    }

    initRooms(_fb, fetched){
        var oldRooms = [];

        fetched.rooms.forEach(function (room) {
            var oldOccupants = [];

            room.roomOccupants.forEach(function (occupant) {
                oldOccupants.push(_fb.control(occupant._id));
            });

            oldRooms.push(_fb.group({
                roomOccupants: _fb.array(oldOccupants)
            }));
        });

        return oldRooms;
    }

    createRoom(){
        return this._fb.group({
            roomOccupants: this._fb.array([this.createOccupant()])
        });
    }

    createOccupant(){
        return this._fb.control(this._attendance[0].user._id);
    }

    addRoom(){
        let rooms = <FormArray>this.bookingForm.get('rooms');
        rooms.push(this.createRoom());
    }

    removeRoom(r: number){
        const control = <FormArray>this.bookingForm.controls['rooms'];
        control.removeAt(r);
    }

    addOccupant(r){
        let room = <FormArray>r.controls['roomOccupants'];
        room.push(this.createOccupant());
    }

    removeOccupant(r, o){
        var occupants = <FormArray>r.controls['roomOccupants'];
        occupants.removeAt(o);
    }

    getRooms(form){
        return form.controls.rooms.controls;
    }

    getOccupants(form){
        return form.controls.roomOccupants.controls;
    }

    onSubmit(form){

        if(form.valid){
            if(this._selectedBooking){

                this.apiService.updateBooking(this._selectedBooking, form.value).subscribe(data => {
                    this.savedForm.emit(true);
                });

            } else {

                this.apiService.addBooking(this._event._id, form.value).subscribe(data => {
                    this.savedForm.emit(true);
                });

            }
        }

    }

}
