import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Competition} from "../../interfaces/comp";
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-comp-form',
    templateUrl: 'comp-form.component.html',
    styles: []
})
export class CompFormComponent implements OnInit {

    @Input() public _event: Event;
    @Input() public _attendees: Attendance[];
    @Input() public _selectedComp: Competition;

    @Output() notifyRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    public compForm: FormGroup;
    public isAdmin: Boolean;

    constructor(private route: ActivatedRoute, private apiService: ApiService, private userService: UserService, private _fb: FormBuilder) {
    }

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();
        this.initForm();
    }

    initForm() {
        if (this._selectedComp) {
            this.compForm = this._fb.group({
                game: new FormControl(this._selectedComp.game, [
                    Validators.required,
                    Validators.maxLength(20)
                ]),
                teamName: new FormControl(this._selectedComp.teamName, [
                    Validators.required,
                    Validators.maxLength(20)
                ]),
                mainTeam: this.setTeam(this._fb),
                subs: this.setSubs(this._fb)
            });
        } else {

            this.compForm = this._fb.group({
                game: new FormControl('', [
                    Validators.required,
                    Validators.maxLength(20)
                ]),
                teamName: new FormControl('', [
                    Validators.required,
                    Validators.maxLength(20)
                ]),
                mainTeam: this.setTeam(this._fb),
                subs: this.setSubs(this._fb)
            });

        }
    }

    initTeam() {
        return this._fb.control('', [
            Validators.required
        ]);
    }

    initSubs() {
        return this._fb.control('', [
            Validators.required
        ]);
    }

    getMainTeam(form) {
        return form.controls['mainTeam'].controls;
    }

    getSubTeam(form) {
        return form.controls['subs'].controls;
    }

    addTeamMember() {
        const control = <FormArray>this.compForm.controls['mainTeam'];
        control.push(this.initTeam());
    }

    removeTeamMember(i) {
        const control = <FormArray>this.compForm.controls['mainTeam'];
        control.removeAt(i);
    }

    addSubMember(){
        const control = <FormArray>this.compForm.controls['subs'];
        control.push(this.initSubs());
    }

    removeSubMember(i){
        const control = <FormArray>this.compForm.controls['subs'];
        control.removeAt(i);
    }

    setTeam(formB){
        var team = [];

        if(this._selectedComp){

            this._selectedComp.mainTeam.forEach(function (member) {
               team.push(formB.control(member._id, [
                   Validators.required
               ]))
            });

        } else {
            team.push(this.initTeam());
        }

        return this._fb.array(team);
    }

    setSubs(formB){
        var subs = [];

        if(this._selectedComp){
            this._selectedComp.subs.forEach(function (sub) {
                subs.push(formB.control(sub._id, [
                    Validators.required
                ]))
            });
        } else {
            subs.push(this.initSubs());
        }

        return new FormArray(subs);
    }

    onSubmit(form){

        if(form.valid){

            if(this._selectedComp){

                this.apiService.updateComp(this._selectedComp._id, form.value).subscribe(data =>{
                    this.notifyRefresh.emit(true);
                });

            } else {

                this.apiService.addComp(this._event._id, form.value).subscribe(data => {
                    this.notifyRefresh.emit(true);
                });

            }
        }
    }

}
