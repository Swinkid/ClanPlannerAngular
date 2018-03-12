import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../../../../interfaces/event";
import {Booking} from "../../../../interfaces/hotel/booking";
import {Attendance} from "../../../../interfaces/attendance";
import * as _ from 'lodash';

@Component({
    selector: 'app-display-bookings',
    templateUrl: 'display-booking.template.html',
    styles: []
})
export class DisplayBookingsComponent implements OnInit {

    public event : Event;
    public bookings : Booking[];
    public attendance : Attendance[];

    constructor(public apiService : ApiService, private route : ActivatedRoute) { }

    ngOnInit() {
        this.setEvent();
    }

    setEvent(){
        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(
            event => {
                this.event = event;
            },
            err => {

            },
            () => {
                this.setBookings(this.event);
            }
        )
    }

    setBookings(event){

        this.apiService.getBooking(event).subscribe(
            bookings => {this.bookings = bookings;},
            error => {},
            () => {
                this.setAttendance();
            },

        );

    }

    setAttendance(){
        this.attendance = this.event.users;

        this.translateUserIdFromBooking();
    }

    //TODO: Fix dirtyness below
    translateUserIdFromBooking(){

        for(let i = 0; i < this.bookings.length; i++) {

            var currentBooking = this.bookings[i];

            console.log(currentBooking);

            var bookedByUser = this.findUsername(this.bookings[i].booking.bookedBy);
            this.bookings[i].booking.bookedBy = bookedByUser.discord.username + '#' + bookedByUser.discord.discriminator;

            for(let j = 0; j < this.bookings[i].booking.rooms.length; j++){

                for(let k = 0; k < this.bookings[i].booking.rooms[j].roomOccupants.length; k++){

                    if(this.bookings[i].booking.rooms[j].roomOccupants[k] !== 'Available'){
                        var guest = this.findUsername(this.bookings[i].booking.rooms[j].roomOccupants[k]);
                        this.bookings[i].booking.rooms[j].roomOccupants[k] = guest.discord.username + '#' + guest.discord.discriminator;
                    }

                }


            }

        }
    }

    findUsername(userId){
        return _.find(this.attendance, function (a) {

            return a.userId == userId;

        });
    }

    calcBiggestRoom(rooms){

        var l = 0;

        rooms.booking.rooms.forEach(function (room) {
            if(room.roomOccupants.length > l){
                l = room.roomOccupants.length;
            }
        });

        var sizeArray = new Array(l);

        return sizeArray;

    }

    deleteBooking(booking){
        this.apiService.removeBooking(booking).subscribe(
            data => {},
            error => {},
            () => {
                this.setEvent();
            });
    }

}
