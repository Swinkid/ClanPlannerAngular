import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {Seat} from "../../interfaces/seat";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-seating-plan-form',
    templateUrl: 'seating-plan-form.component.html',
    styles: []
})
export class SeatingPlanFormComponent implements OnInit {

    @Input() _event : Event;
    @Input() _attendance : Attendance[];
    @Input() _selectedSeat : Seat;

    @Output() _savedNotify : EventEmitter<Boolean> = new EventEmitter<Boolean>();

    public seatForm : FormGroup;
    public isAdmin : Boolean;

    constructor(private route: ActivatedRoute, private apiService: ApiService, private userService: UserService, private _fb: FormBuilder) { }

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();
        this.initForm();
        console.log('!');
    }

    initForm(){
        if(this._selectedSeat){

            if(this.isAdmin){
                this.seatForm = this._fb.group({
                    onPicker: this._fb.control(this._selectedSeat.onPicker, [
                        Validators.required,
                        Validators.maxLength(5)
                    ]),
                    actualSeat: this._fb.control(this._selectedSeat.actualSeat, [
                        Validators.required,
                        Validators.maxLength(5)
                    ]),
                    notes: this._fb.control(this._selectedSeat.notes)
                });
            } else {
                this.seatForm = this._fb.group({
                    onPicker: this._fb.control(this._selectedSeat.onPicker, [
                        Validators.required,
                        Validators.maxLength(5)
                    ])
                });
            }

        } else {

            this.seatForm = this._fb.group({
                onPicker: this._fb.control('', [
                    Validators.required,
                    Validators.maxLength(5)
                ])
            });

        }
    }

    onSubmit(form){
        if(form.valid){
            if(this._selectedSeat){
                this.apiService.updateSeat(this._selectedSeat._id, form.value).subscribe(
                    data => {
                        this._savedNotify.emit(true);
                    },
                    error => {},
                    () => {}
                );
            } else {
                this.apiService.addSeat(this._event._id, form.value).subscribe(
                    data => {
                        this._savedNotify.emit(true);
                    },
                    error => {},
                    () => {}
                    );
            }
        }
    }

}
