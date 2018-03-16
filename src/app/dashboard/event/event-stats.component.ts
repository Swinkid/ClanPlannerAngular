import { Component, OnInit } from '@angular/core';
import {Event} from "../../interfaces/event";

@Component({
    selector: 'app-event-stats',
    templateUrl: 'event-stats.component.html',
    styles: []
})
export class EventStatsComponent implements OnInit {

    public ticketsPurchased : Number = 0;
    public seatsSelected    : Number = 0;

    constructor() { }

    ngOnInit() {
    }

    calcPurchasedTicket(event : Event){
        let purchased = 0;

        event.users.forEach(function (attendee) {
            if(attendee.broughtTicket){
                purchased++;
            }
        });

        return purchased;
    }

    calcSelectedSeats(event : Event){
        let selected = 0;

        event.users.forEach(function (attendee) {
            if(attendee.onSeatPicker){
                selected++;
            }
        });

        return selected;
    }

}
