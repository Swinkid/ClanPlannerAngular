import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Event} from "../../interfaces/event";

import {ApiService} from "../../services/api.service";
import {UserService} from "../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {Jersey} from "../../interfaces/jersey";
import {Attendance} from "../../interfaces/attendance";

import * as _ from 'lodash';

@Component({
    selector: 'app-jerseys',
    templateUrl: 'jerseys.component.html',
    styles: [],
})
export class JerseysComponent implements OnInit {

    public _event : Event;
    public _attendees : Attendance[];

    public selectedUser : String;
    public jersey   : Jersey;

    public editing : Boolean;

    public showForm : Boolean;


    constructor(private apiService : ApiService, private userService : UserService, private route : ActivatedRoute) { }

    ngOnInit() {
        this.setEvent();
    }

    initSelectedUser() {
        if(!this.jersey && this.isUserAttending(this.userService.getUserId())){
            this.selectedUser = this.userService.getUserId();
            this.editing = false;
            this.showForm = true;
        }
    }

    setJersey() {
        this.apiService.getJersey(this.route.snapshot.params['id'], this.userService.getUserId()).subscribe(
            data => {
                this.jersey = data;
                this.initSelectedUser();
            },
            error => {
                this.initSelectedUser();
            },
            () => {

            }
        );
    }

    setEvent(){
        this.apiService.getEventAndAttendace(this.route.snapshot.params['id']).subscribe(
            data => {
                this._event = data[0];
                this._attendees = data[1];
                this.setJersey();
            },
            error => {
                //TODO: Error handling
                this.setJersey();
            }
        )
    }

    onNotify(message: String): void {

        this.selectedUser = undefined;
        this.editing = false;
        this.showForm = false;

        this.selectedUser = message;
        this.editing = true;
        this.showForm = true;
    }

    submittedForm(done : Boolean): void {
        this.selectedUser = undefined;
        this._event = undefined;
        this.showForm = false;
        this.setEvent();
        this.setJersey();

    }

    isUserAttending(user : String){
        let foundUser = _.find(this._attendees, function (attendee) {
            if(attendee.user._id === user){
                return true;
            } else {
                return false;
            }
        });

        return foundUser !== undefined;
    }
}
