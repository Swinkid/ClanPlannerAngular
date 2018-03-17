import {Component, Input, OnInit} from '@angular/core';
import {Attendance} from "../../interfaces/attendance";
import {UserService} from "../../services/user.service";
import {Event} from "../../interfaces/event";

@Component({
    selector: 'app-attendee-list',
    templateUrl: 'attendee-list.component.html',
    styles: []
})
export class AttendeeListComponent implements OnInit {

    @Input() public _event : Event;
    @Input() public _attendees : Attendance[];

    public _isAdmin : Boolean;

    constructor(private userService : UserService) { }

    ngOnInit() {
        this._isAdmin = this.userService.isAdmin();
    }

}
