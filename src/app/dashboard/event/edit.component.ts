import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-edit',
    templateUrl: 'edit.template.html',
    styles: []
})
export class EditComponent implements OnInit {

    event            : Event;
    attendees        : Attendance[];
    public eventForm        : FormGroup;

    submitted        : Boolean = false;

    constructor(public authService : AuthService, private apiService : ApiService, private route: ActivatedRoute, public userService : UserService,  private router: Router) { }

    ngOnInit() {
        this.setEvent();
    }

    setForm(event : Event){
        this.eventForm = new FormGroup({
            name: new FormControl(event.name,[
                Validators.required,
                Validators.maxLength(20)
            ]),
            fromDate: new FormControl(this.formatDate(event.fromDate), [
                Validators.required
            ]),
            toDate: new FormControl(this.formatDate(event.toDate), [
                Validators.required
            ]),
            seatPickerUrl: new FormControl(event.seatPickerUrl,[
                Validators.required,
                Validators.maxLength(20)
            ]),
            eventLocation: new FormControl(event.eventLocation,[
                Validators.required,
                Validators.maxLength(20)
            ]),

        });
    }

    setEvent(){

        this.apiService.getEvent(this.route.snapshot.params['id']).subscribe(
            event => {
                this.event = event;
            },
            err => {},
            () => {
                this.setForm(this.event);
            }
        );

    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }


    submitForm(){
        if(this.eventForm.status === "VALID"){

            this.apiService.updateEvent(this.event._id, this.eventForm.value).subscribe(
                event => {},
                err => {},
                () => {
                    this.setEvent();
                    this.submitted = true;
                }
            )

        }
    }

    deleteEvent() {
        this.apiService.deleteEvent(this.event._id).subscribe(
            event => {

            },
            err => {

            },
            () =>{
                this.router.navigate(['/dashboard/events/' + this.event._id]);
            }
        );
    }
}
