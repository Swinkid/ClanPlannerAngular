import { Component, OnInit } from '@angular/core';
import {Attendance} from "../../interfaces/attendance";
import {Event} from "../../interfaces/event";
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {Competition} from "../../interfaces/comp";

@Component({
    selector: 'app-comp',
    templateUrl: 'comp.component.html',
    styles: []
})
export class CompComponent implements OnInit {

    public _event : Event;
    public _attendees : Attendance[];

    public _selectedComp : Competition;
    public _comps       : Competition[];

    public showForm : Boolean = false;

    constructor(private route: ActivatedRoute, private apiService : ApiService, private userService : UserService) {
    }

    ngOnInit() {
        this.initEvent();
        this.getComps();
    }

    initEvent(){
        this.apiService.getEventAndAttendace(this.route.snapshot.params['id']).subscribe(data => {
            this._event = data[0];
            this._attendees = data[1];
        });
    }

    addCompetition(){
        this.showForm = true;
    }

    getComps(){
        this.apiService.getComps(this.route.snapshot.params['id']).subscribe(data => {
            this._comps = data;
        })
    }

    refresh(message){
        this.showForm = false;
        this._comps = undefined;
        this._selectedComp = undefined;
        this._attendees = undefined;

        this.initEvent();
        this.getComps();
    }

    sendEdit(comp){
        this.apiService.getComp(comp).subscribe(data => {
           this._selectedComp = data;
           this.showForm = true;
        }, error => {}, () => {});

    }


}
