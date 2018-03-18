import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Seat} from "../../interfaces/seat";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-seating-plan-list',
    templateUrl: 'seating-plan-list.component.html',
    styles: []
})
export class SeatingPlanListComponent implements OnInit {


    @Input() public _seats : Seat[];

    public isAdmin : Boolean;
    public userId : String;

    @Output() _editNotify : EventEmitter<String> = new EventEmitter<String>();

    constructor(private route: ActivatedRoute, private apiService: ApiService, private userService: UserService, private _fb: FormBuilder) { }

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();
        this.userId = this.userService.getUserId();
    }

    public editSeat(seat){
        this._editNotify.emit(seat);
    }

}
