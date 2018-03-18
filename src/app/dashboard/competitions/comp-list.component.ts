import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../interfaces/event";
import {Attendance} from "../../interfaces/attendance";
import {Competition} from "../../interfaces/comp";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-comp-list',
    templateUrl: 'comp-list.component.html',
    styles: []
})
export class CompListComponent implements OnInit {

    @Input() _event : Event;
    @Input() _attendance : Attendance[];
    @Input() _comps : Competition[];


    @Output() notify: EventEmitter<Boolean> = new EventEmitter<Boolean>();
    @Output() sendEdit: EventEmitter<String> = new EventEmitter<String>();

    constructor(private route: ActivatedRoute, private apiService: ApiService, private userService: UserService, private _fb: FormBuilder) { }

    ngOnInit() {

    }

    getTeamArraySize(comp){
        var arrSize = [];

        for(let i = 0; i < this.calcBiggestTeam(comp); i++){
            arrSize.push('')
        }

        return arrSize;
    }

    calcBiggestTeam(comp){
        let count = 0;

        if(comp.mainTeam.length > count){
            count = comp.mainTeam.length;
        }

        if(comp.subs.length > count){
            count = comp.subs.length;
        }

        return count;
    }

    removecomp(comp){
        this.apiService.deleteComp(comp).subscribe(data => {
           this.notify.emit(true);
        });
    }

    editComp(comp){
        this.sendEdit.emit(comp);
    }

}
