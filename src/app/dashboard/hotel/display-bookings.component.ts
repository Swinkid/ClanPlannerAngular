import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../../interfaces/event";
import {Booking} from "../../interfaces/hotel/booking";
import {Attendance} from "../../interfaces/attendance";
import * as _ from 'lodash';
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-display-bookings',
    templateUrl: 'display-booking.template.html',
    styles: []
})
export class DisplayBookingsComponent implements OnInit {

    public _event : Event;
    public bookings : Booking[];
    public _attendees : Attendance[];
    public isAdmin  : Boolean = false;

    constructor(private userService : UserService, public apiService : ApiService, private route : ActivatedRoute) { }

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();
        this.setEvent();
    }

    setEvent(){
        this.apiService.getEventAndAttendace(this.route.snapshot.params['id']).subscribe(
            data => {
                this._event = data[0];
                this._attendees = data[1];
                this.setBookings(this.route.snapshot.params['id']);
            }
        );
    }

    setBookings(event){

        this.apiService.getBookings(event).subscribe(
            bookings => {this.bookings = bookings;},
            error => {},
            () => {

            },

        );

    }

    //TODO: Fix dirtyness below
    /*translateUserIdFromBooking(){

        for(let i = 0; i < this.bookings.length; i++) {

            var currentBooking = this.bookings[i];

            var bookedByUser = this.findUsername(this.bookings[i].booking.bookedBy).user;
            this.bookings[i].booking.bookedBy = bookedByUser.discord.username + '#' + bookedByUser.discord.discriminator;

            for(let j = 0; j < this.bookings[i].booking.rooms.length; j++){

                for(let k = 0; k < this.bookings[i].booking.rooms[j].roomOccupants.length; k++){

                    if(this.bookings[i].booking.rooms[j].roomOccupants[k] !== 'Available'){
                        var guest = this.findUsername(this.bookings[i].booking.rooms[j].roomOccupants[k]).user;
                        this.bookings[i].booking.rooms[j].roomOccupants[k] = guest.discord.username + '#' + guest.discord.discriminator;
                    }

                }


            }

        }
    }*/

    findUsername(userId){
        return _.find(this._attendees, function (a) {
            return a.user._id == userId;
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
