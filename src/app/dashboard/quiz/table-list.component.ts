import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {Quiz} from "../../interfaces/quiz";
import {ApiService} from "../../services/api.service";
import * as _ from 'lodash';

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

    constructor(private apiService : ApiService) { }

    ngOnInit() {
        this.initTables();
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

    getUsername(userId){
        return this.findUsername(userId).discord.username + '#' + this.findUsername(userId).discord.discriminator;
    }

    findUsername(userId){
        return _.find(this._attendees, function (a) {
            return a.userId == userId;
        });
    }

}
