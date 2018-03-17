import { Component, OnInit } from '@angular/core';
import {User} from "../../interfaces/user";
import {UserService} from "../../services/user.service";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    styles: []
})
export class ProfileComponent implements OnInit {

    public user : User;

    public loggedInUserId : String;

    constructor(public authService : AuthService, private apiService : ApiService, private route: ActivatedRoute, public userService : UserService) { }

    ngOnInit() {
        this.setUser(this.route.snapshot.params['id']);
        this.loggedInUserId = this.userService.getUserId();
    }

    setUser(userId){
        this.apiService.getUser(userId).subscribe(
            data => {this.user = data},
            error => {}
        );
    }

}
