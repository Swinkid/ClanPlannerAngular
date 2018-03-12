import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Attendance} from "../../../interfaces/attendance";
import {ApiService} from "../../../services/api.service";
import {Event} from "../../../interfaces/event";


@Component({
    selector: 'booking-form',
    templateUrl: 'booking-form.template.html',
    styles: []
})
export class BookingFormComponent implements OnInit {

    private event: Event;
    public bookingForm  : FormGroup;
    public attendees    : Attendance[];

    public roomType: String[] = [
        'Single',
        'Twin',
        'Family'
    ];

    constructor(private _fb : FormBuilder, private route : ActivatedRoute, public apiService : ApiService, public router : Router) {


    }

    ngOnInit() {
        if(this.route.snapshot.params['id']){
            this.bookingForm = new FormGroup({

                bookedBy: new FormControl('', [
                    Validators.required,
                ]),
                bookedRoomType: new FormControl('', [
                   Validators.required
                ]),
                totalCost: new FormControl(0.00,[
                    Validators.required,
                ]),
                rooms: this._fb.array([
                    this.initRooms()
                ])

            });

            this.setAttendance();
        } else {
            this.router.navigate(['/dashboard']);
        }

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

    onSubmit(form){

        if(form.valid){

            this.apiService.addBooking(this.event._id, form.value).subscribe(
                booking => {},
                error => { console.log(error); },
                () => {
                    this.router.navigate(['/dashboard/events']);
                }
            );


        }

    }

}
