import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../../interfaces/event";
import {UserService} from "../../services/user.service";
import {Attendance} from "../../interfaces/attendance";

@Component({
    selector: 'app-quiz',
    templateUrl: 'quiz.component.html',
    styles: []
})
export class QuizComponent implements OnInit {

    public editing : Boolean = false;
    public selectedTable : String;

    public showForm : Boolean = false;

    public _event : Event;
    public _attendees : Attendance[];

    public isAdmin : Boolean;

    constructor(private apiService : ApiService, private route : ActivatedRoute, private userService : UserService) { }

    ngOnInit() {
        this.initEvent();
        this.isAdmin = this.userService.isAdmin();
    }

    private toggleForm(){
        if(this.showForm){
            this.showForm = false;
        } else {
            this.showForm = true;
        }
    }

    public initEvent(){
        this.apiService.getEventAndAttendace(this.route.snapshot.params['id']).subscribe(
            data => {
                this._event = data[0];
                this._attendees = data[1];
            },
            error => {
                //TODO: Error handling
            }
        )
    }

    public toggleAddTable(){
        this.toggleForm();
    }

    public formSubmitted(message){
        this.toggleForm();
        this._event = undefined;
        this.initEvent();
        this.editing = false;
    }

    public refreshTable(){
        this._event = undefined;
        this.initEvent();
    }

    public editTable(message){
        this.editing = true;
        this.selectedTable = message;
        this.toggleForm();
    }

}
