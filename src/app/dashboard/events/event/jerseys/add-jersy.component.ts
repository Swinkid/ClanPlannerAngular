import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from "../../../../services/api.service";
import {Event} from "../../../../interfaces/event";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Jersey} from "../../../../interfaces/jersey";
import {UserService} from "../../../../services/user.service";

@Component({
    selector: 'app-add-jersy',
    templateUrl: 'add-jersy.component.html',
    styles: []
})
export class AddJersyComponent implements OnInit {

    @Input() public _selectedUser : String;
    @Input() public _editing : Boolean;
    @Input() public _event : Event;

    @Output() notify: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    public jerseyForm : FormGroup;
    public jersey : Jersey;

    public isAdmin : Boolean;

    public jerseySizes : String[] = [
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        'XXXL'
    ];

    public hidden : Boolean[] = [
        true,
        false
    ];

    public hasPaid : Boolean[] = [
        true,
        false
    ];

    constructor(private apiService : ApiService, private userService : UserService) { }

    ngOnInit() {
        this.setJersey();
        this.isAdmin = this.userService.isAdmin();
    }

    setJersey(){
        this.apiService.getJersey(this._event._id, this._selectedUser).subscribe(
            data => {
                this.jersey = data
            },
            error => {
                this.initForm();
            },
            () => {
                this.initForm();
            }
        );
    }

    initForm(){
        if(this.jersey){

            this.jerseyForm = new FormGroup({
                size: new FormControl(this.jersey.size, [
                    Validators.required
                ]),
                hidden: new FormControl(this.jersey.hidden, [
                    Validators.required
                ]),
                paid: new FormControl(this.jersey.paid, [
                    Validators.required
                ])
            });
        } else {
            this.jerseyForm = new FormGroup({
                size: new FormControl('', [
                    Validators.required
                ]),
                hidden: new FormControl( false, [
                    Validators.required
                ]),
                paid: new FormControl(false, [
                    Validators.required
                ])
            });
        }


        console.log(this.jerseyForm);
    }


    onSubmit(form){

        if(form.valid){
            if(this._editing){

                this.apiService.updateJersey(this._event._id, this._selectedUser, form.value).subscribe(
                    data =>{},
                    error => {},
                    () => {
                        this.notify.emit(true);
                    }
                );

            }

            if(this._editing === false){

                this.apiService.addJersey(this._event._id, this._selectedUser, form.value).subscribe(
                    data =>{},
                    error => {},
                    () => {
                        this.notify.emit(true);
                    }
                );
            }
        }

    }

}
