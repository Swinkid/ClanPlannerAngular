import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Attendance} from "../../interfaces/attendance";
import {ApiService} from "../../services/api.service";
import {Event} from "../../interfaces/event";
import {Quiz} from "../../interfaces/quiz";

@Component({
    selector: 'app-table-form',
    templateUrl: 'table-form.component.html',
    styles: []
})
export class TableFormComponent implements OnInit {

    @Input() public _event : Event;
    @Input() public _attendees : Attendance[];
    @Input() editing : Boolean;
    @Input() selectedTable : String;

    @Output() notify: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    public quizForm : FormGroup;
    public table : Quiz;

    public tableTypes : String[] = [
        'Premium',
        'Standard'
    ];

    public paidOptions : Boolean[] = [
        true,
        false
    ];

    constructor(private _fb : FormBuilder, private apiService : ApiService) { }

    ngOnInit() {

        if(this.editing == true && this.table == undefined){
            this.initTable();
        } else {
            this.initForm();
        }
    }

    initTable(){
        this.apiService.getTable(this.selectedTable).subscribe(
            data => { this.table = data },
            error => {},
            () => {
                this.initForm();
            }
        );
    }

    initForm(){
        if(this.editing && this.table){
            this.quizForm = new FormGroup({
                tableNumber : new FormControl(this.table.tableNumber, [
                    Validators.required,
                    Validators.min(1),
                    Validators.max(200)
                ]),
                bookedBy: new FormControl(this.table.bookedBy._id, [
                    Validators.required
                ]),
                paypalLink: new FormControl(this.table.paypalLink, [
                    Validators.required
                ]),
                tableType: new FormControl(this.table.tableType, [
                    Validators.required
                ]),
                attendees: this._fb.array(
                    this.fetchAttendees(this._fb)
                )
            });
        } else {
            this.quizForm = new FormGroup({
                tableNumber : new FormControl(0, [
                   Validators.required,
                   Validators.min(1),
                   Validators.max(200)
                ]),
                bookedBy: new FormControl('', [
                   Validators.required
                ]),
                paypalLink: new FormControl('', [
                    Validators.required
                ]),
                tableType: new FormControl('', [
                    Validators.required
                ]),
                attendees: this._fb.array([
                    this.initAttendees()
                ])
            });
        }
    }

    initAttendees(){
        return this._fb.group({
            user: '',
            paid: false
        });
    }

    fetchAttendees(_fb){
        var attendees = [];

        this.table.attendees.forEach(function (attendee) {
            var a = {
                user: attendee.user._id,
                paid: attendee.paid
            };

            attendees.push(_fb.group(a));
        });

        return attendees;
    }

    addAttendee(){
        const control = <FormArray>this.quizForm.get('attendees');
        control.push(this.initAttendees());
    }

    removeAttendee(r){
        const control = <FormArray>this.quizForm.controls['attendees'];
        control.removeAt(r);
    }

    getAttendees(form){
        return form.controls.attendees.controls;
    }

    onSubmit(form){

        if(form.valid){

            if(this.editing){

                let formData = form.value;
                formData.event = this._event._id;

                this.apiService.updateTable(this.table._id, formData).subscribe(
                    data => {},
                    error => {},
                    () => {
                        this.notify.emit(true);
                    }
                )


            } else {

                this.apiService.addTable(this._event._id, form.value).subscribe(
                    data => {},
                    error => {},
                    () => {
                        this.notify.emit(true);
                    }
                )

            }

        }

    }

}
