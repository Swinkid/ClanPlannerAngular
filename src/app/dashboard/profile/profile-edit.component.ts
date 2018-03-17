import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../interfaces/user";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-profile-edit',
    templateUrl: 'profile-edit.component.html',
    styles: []
})
export class ProfileEditComponent implements OnInit {

    public user : User;

    constructor(private userService : UserService, private apiService : ApiService) { }

    ngOnInit() {
        this.initUser();
    }

    initUser(){
        this.apiService.getUser(this.userService.getUserId()).subscribe(
          data => {this.user = data}
        );
    }

}
