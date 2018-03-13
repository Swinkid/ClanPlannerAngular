import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Jersey} from "../../../../interfaces/jersey";
import {ApiService} from "../../../../services/api.service";
import {UserService} from "../../../../services/user.service";
import {Event} from "../../../../interfaces/event";
import {Attendance} from "../../../../interfaces/attendance";

import * as _ from 'lodash';

@Component({
    selector: 'app-show-jerseys',
    templateUrl: 'show-jerseys.component.html',
    styles: []
})
export class ShowJerseysComponent implements OnInit {

    @Input() private _event : Event;
    @Output() notify: EventEmitter<String> = new EventEmitter<String>();

    public jerseys: Jersey[];
    private attendance : Attendance[];
    public admin : Boolean;
    public userId : String;

    constructor(private apiService: ApiService, private userService: UserService) {
    }

    ngOnInit() {
        this.setJerseys();

        this.admin = this.userService.isAdmin();
        this.userId = this.userService.getUserId();
        this.attendance = this._event.users;
    }

    setJerseys() {
        this.apiService.getJerseys(this._event._id).subscribe(
            jerseys => { this.jerseys = jerseys },
            error => {},
            () => {
                this.translateUserIds();
            }
        );
    }

    translateUserIds(){

        for(let i = 0; i < this.jerseys.length; i++){

            let currentJersey = this.jerseys[i];
            this.jerseys[i].username = this.findUsername(currentJersey.userId).discord.username + '#' + this.findUsername(currentJersey.userId).discord.discriminator;

        }

    }

    findUsername(userId){
        return _.find(this.attendance, function (a) {
            return a.userId == userId;
        });
    }

    editJersey(user){
        this.notify.emit(user);
    }

    deleteJersey(user){
        this.apiService.deleteJersey(this._event._id, user).subscribe(
            data => {},
            error => {},
            () => {
                this.setJerseys();
            }
        );
    }

}


