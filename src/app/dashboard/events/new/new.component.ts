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
                Validators.maxLength(20)
            ]),
            eventLocation: new FormControl('',[
                Validators.required,
                Validators.maxLength(20)
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
                    this.router.navigate(['/dashboard/events']);
                }
            )

        }
    }

}
