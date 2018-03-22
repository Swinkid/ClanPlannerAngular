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
                Validators.maxLength(30)
            ]),
            fromDate: new FormControl(this.formatDate(event.fromDate), [
                Validators.required
            ]),
            toDate: new FormControl(this.formatDate(event.toDate), [
                Validators.required
            ]),
            seatPickerUrl: new FormControl(event.seatPickerUrl,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            eventLocation: new FormControl(event.eventLocation,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            showJersey : new FormControl(event.showJersey,[
                Validators.required,
            ]),
            showQuiz : new FormControl(event.showQuiz,[
                Validators.required,
            ]),
            showComps : new FormControl(event.showComps,[
                Validators.required,
            ]),
            showSeating : new FormControl(event.showSeating,[
                Validators.required,
            ]),
            showMeal : new FormControl(event.showMeal,[
                Validators.required,
            ]),
            mealDate: new FormControl(this.formatDate(event.mealDate), [
                Validators.required
            ]),
            mealName: new FormControl(event.mealName,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            mealTime: new FormControl(event.mealTime,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            mealAddress: new FormControl(event.mealAddress,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelCheckinTime: new FormControl(event.hotelCheckinTime,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelCheckin: new FormControl(this.formatDate(event.hotelCheckin), [
                Validators.required
            ]),
            hotelCheckoutTime: new FormControl(event.hotelCheckoutTime,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelCheckout: new FormControl(this.formatDate(event.hotelCheckout), [
                Validators.required
            ]),
            hotelAddress: new FormControl(event.hotelAddress,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelNumber: new FormControl(event.hotelNumber,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelName: new FormControl(event.hotelName,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            jerseySizeChart: new FormControl(event.jerseySizeChart,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            jerseyPaymentLink: new FormControl(event.jerseyPaymentLink,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            jerseyDesignLink: new FormControl(event.jerseyDesignLink,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            clanTracker: new FormControl(event.clanTracker,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            clanPage: new FormControl(event.clanPage,[
                Validators.required,
                Validators.maxLength(30)
            ]),
            chatLink: new FormControl(event.chatLink,[
                Validators.required,
                Validators.maxLength(30)
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
                event => {
                    this.router.navigate(['/dashboard/events', this.event._id]);
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
