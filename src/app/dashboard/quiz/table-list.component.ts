import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {Quiz} from "../../interfaces/quiz";
import {ApiService} from "../../services/api.service";
import * as _ from 'lodash';
import {UserService} from "../../services/user.service";
import {User} from "../../interfaces/user";

@Component({
    selector: 'app-table-list',
    templateUrl: 'table-list.component.html',
    styles: []
})
export class TableListComponent implements OnInit {

    @Input() _event : Event;
    @Input() _attendees : Attendance[];

    @Output() editNotify: EventEmitter<String> = new EventEmitter<String>();
    @Output() refreshNotify: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    public tables : Quiz[];

    public isAdmin : Boolean;

    constructor(private apiService : ApiService, private userService : UserService) { }

    ngOnInit() {
        this.initTables();
        this.isAdmin = this.userService.isAdmin();
    }

    initTables(){
        this.apiService.getEventTables(this._event._id).subscribe(
            data => {
                this.tables = data;
            },
            error => {},
            () => {}
        );
    }

    deleteTable(table){
        this.apiService.deleteTable(table).subscribe(
            data => {},
            error => {},
            () => {
                this.refreshTable();
            }
        )
    }

    editTable(table){
        this.editNotify.emit(table);
    }

    refreshTable(){
        this.refreshNotify.emit(true);
    }

    /*getUsername(userId){

        var username;

        if(this.findUsername(userId)){
            username = this.findUsername(userId).discord.username + '#' + this.findUsername(userId).discord.discriminator;
        } else {
            username = "Available";
        }

        return username;
    }*/

    findUser(userId) {
        return _.find(this._attendees, function (a) {
            return a.user._id == userId;
        });
    }

}
