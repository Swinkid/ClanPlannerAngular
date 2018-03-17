import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../interfaces/user";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-profile-form',
    templateUrl: 'profile-form.component.html',
    styles: []
})
export class ProfileFormComponent implements OnInit {

    @Input() user : User;

    public userForm : FormGroup;

    constructor(private apiService : ApiService,  private router: Router) { }

    ngOnInit() {

        this.initForm();

    }

    initForm(){
        this.userForm = new FormGroup({

            realName: this.initRealName(this.user.realName),
            nickname: this.initNicknName(this.user.nickname)

        });
    }

    initRealName(realName){
        if(realName){
            return new FormControl(this.user.realName,[
                Validators.required
            ]);
        } else {
            return new FormControl('',[
                Validators.required
            ]);
        }
    }

    initNicknName(nickname){
        if(nickname){
            return new FormControl(this.user.nickname, [
                Validators.required
            ])
        } else {
            return new FormControl("", [
                Validators.required
            ])
        }
    }

    onSubmit(form){
        if(form.valid){

            this.apiService.updateUser(this.user._id, form.value).subscribe(
                data => {
                    this.router.navigate(['/dashboard/profile/' + this.user._id]);
                },
                error => {}
            )

        }
    }

}
