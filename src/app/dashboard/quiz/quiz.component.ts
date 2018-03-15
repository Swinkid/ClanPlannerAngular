import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../../interfaces/event";

@Component({
    selector: 'app-quiz',
    templateUrl: 'quiz.component.html',
    styles: []
})
export class QuizComponent implements OnInit {

    public editing : Boolean = false;
    public adding : Boolean = false;
    public selectedTable : String;

    public showForm : Boolean = false;

    public _event : Event;

    constructor(private apiService : ApiService, private route : ActivatedRoute) { }

    ngOnInit() {
        this.initEvent();
    }

    private toggleForm(){
        if(this.showForm){
            this.showForm = false;
        } else {
            this.showForm = true;
        }
    }

    public initEvent(){
        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(
            event => {
                this._event = event;
            },
            err => {

            },
            () => {}
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
