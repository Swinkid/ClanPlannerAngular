import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-new',
    templateUrl: 'new.template.html',
    styles: []
})
export class NewComponent implements OnInit {

    public eventForm        : FormGroup;

    submitted        : Boolean = false;

    constructor(public apiService : ApiService, private router: Router) { }

    ngOnInit() {
        this.setForm();
    }

    setForm(){
        this.eventForm = new FormGroup({
            name: new FormControl('',[
                Validators.required,
                Validators.maxLength(20)
            ]),
            fromDate: new FormControl(this.formatDate(new Date()), [
                Validators.required
            ]),
            toDate: new FormControl(this.formatDate(new Date()), [
                Validators.required
            ]),
            seatPickerUrl: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            eventLocation: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            showJersey : new FormControl(true,[
                    Validators.required,
            ]),
            showQuiz : new FormControl(true,[
                Validators.required,
            ]),
            showComps : new FormControl(true,[
                Validators.required,
            ]),
            showSeating : new FormControl(true,[
                Validators.required,
            ]),
            showMeal : new FormControl(true,[
                Validators.required,
            ]),
            mealDate: new FormControl(this.formatDate(new Date()), [
                Validators.required
            ]),
            mealName: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            mealTime: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            mealAddress: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelCheckinTime: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelCheckin: new FormControl(this.formatDate(new Date()), [
                Validators.required
            ]),
            hotelCheckoutTime: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelCheckout: new FormControl(this.formatDate(new Date()), [
                Validators.required
            ]),
            hotelAddress: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelNumber: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            hotelName: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            jerseySizeChart: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            jerseyPaymentLink: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            jerseyDesignLink: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            clanTracker: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            clanPage: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
            chatLink: new FormControl('',[
                Validators.required,
                Validators.maxLength(30)
            ]),
        });
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

            this.apiService.addEvent(this.eventForm.value).subscribe(
                event => {},
                err => {},
                () => {
                    this.router.navigate(['/dashboard']);
                }
            )

        }
    }

}
