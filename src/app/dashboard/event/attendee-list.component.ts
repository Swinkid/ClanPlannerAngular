import {Component, Input, OnInit} from '@angular/core';
import {Attendance} from "../../interfaces/attendance";

@Component({
    selector: 'app-attendee-list',
    templateUrl: 'attendee-list.component.html',
    styles: []
})
export class AttendeeListComponent implements OnInit {

    @Input() public _event : Event;
    @Input() public _attendees : Attendance[];

    constructor() { }

    ngOnInit() {

    }

}
