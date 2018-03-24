import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../../interfaces/event";
import {Booking} from "../../interfaces/hotel/booking";
import {Attendance} from "../../interfaces/attendance";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-display-bookings',
    templateUrl: 'display-booking.template.html',
    styles: []
})
export class DisplayBookingsComponent implements OnInit {

    @Input() _event : Event;
    @Input() _attendance : Attendance[];

    @Output() savedForm: EventEmitter<Boolean> = new EventEmitter<Boolean>();
    @Output() editForm: EventEmitter<String> = new EventEmitter<String>();

    public bookings : Booking[];

    public isAdmin  : Boolean = false;

    constructor(private userService : UserService, public apiService : ApiService, private route : ActivatedRoute) { }

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();
        this.setBookings(this.route.snapshot.params['id']);
    }

    setBookings(event){

        this.apiService.getBookings(event).subscribe(
            bookings => {
                this.bookings = bookings;
            }
        );

    }

    calcBiggestRoom(booking){

        var l = 0;

        booking.rooms.forEach(function (room) {
            if(room.roomOccupants.length > l){
                l = room.roomOccupants.length;
            }
        });

        var sizeArray = new Array(l);

        return sizeArray;

    }

    deleteBooking(booking){
        this.apiService.removeBooking(booking).subscribe(
            data => {
                this.savedForm.emit(true);
            }
        );
    }

    editBooking(booking){
        this.editForm.emit(booking);
    }

}
