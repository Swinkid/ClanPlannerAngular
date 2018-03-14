import {Component, EventEmitter, OnInit, Output} from '@angular/core';

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

    public event : Event;
    public selectedUser : String;
    public jersey   : Jersey;

    public editing : Boolean;


    constructor(private apiService : ApiService, private userService : UserService, private route : ActivatedRoute) { }

    ngOnInit() {
        this.setEvent();
        this.setJersey();
    }

    initSelectedUser() {
        if(!this.jersey && this.isUserAttending(this.userService.getUserId(), this.event.users)){
            this.selectedUser = this.userService.getUserId();
            this.editing = false;
        }
    }

    setJersey() {
        this.apiService.getJersey(this.route.snapshot.params['id'], this.userService.getUserId()).subscribe(
            data => {
                this.jersey = data;
            },
            error => {
                this.initSelectedUser();
            },
            () => {
                this.initSelectedUser();
            }
        );
    }

    setEvent(){
        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(
            event => {
                this.event = event;
            },
            err => {

            },
            () => {}
        )
    }

    onNotify(message: String): void {
        this.selectedUser = message;
        this.editing = true;
    }

    submittedForm(done : Boolean): void {
        this.selectedUser = undefined;

        this.event = undefined;
        this.setEvent();
        this.setJersey();

    }

    isUserAttending(user : String, event : Attendance[]){
        let foundUser = _.find(event, function (u) {
            if(u.userId === user){
                return true;
            } else {
                return false;
            }
        });

        return foundUser !== undefined;
    }
}
