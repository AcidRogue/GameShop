import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserBackendService} from "../http/user-http";
import {User} from "../models/user";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['../auth/auth.component.css']
})
export class UserComponent implements OnInit {
    currentUser;
    error: false;
    errorMessage: string = "";
    isDataAvailable = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private userBackEndService: UserBackendService) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if(params['userId']){
                this.userBackEndService.getUserById(params['userId']).subscribe(user => {
                    if(user){
                        this.currentUser = user;
                        this.isDataAvailable = true;
                    }
                }, error => {
                    this.router.navigate(['/dashboard']);
                })
            }
        });
    }

    onUserFormSubmit(userForm: NgForm){
        let userId = this.currentUser._id;
        let username = userForm.form.value.Username;
        let email = userForm.form.value.Email;
        let password = userForm.form.value.Password;
        let confirmPassword = userForm.form.value.ConfirmPassword;
        let firstName = userForm.form.value.FirstName;
        let lastName = userForm.form.value.LastName;

        let newUser:any = {
            Username: username,
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            ProfileImage: this.currentUser.ProfileImage
        };

        if(!username){
            this.errorMessage = "Username required";
            return;
        }
        if(!email){
            this.errorMessage = "Email required";
            return;
        }
        if(password){
            if(password !== confirmPassword){
                this.errorMessage = "Passwords must match";
                return;
            }
            newUser.Password = password;
        }

        this.errorMessage = "";

        this.userBackEndService.updateUser(userId, newUser).subscribe(result => {
            if(result){
                this.router.navigate(['/dashboard']);
            }
        }, err => {
            this.errorMessage = err.error;
        });
    }

    onPfpChange(value:string) {
        let img = new Image();
        img.onload = () => {
            this.currentUser.ProfileImage = value;
        };
        img.onerror = () => {
            this.currentUser.ProfileImage = "https://3.bp.blogspot.com/-qDc5kIFIhb8/UoJEpGN9DmI/AAAAAAABl1s/BfP6FcBY1R8/s1600/BlueHead.jpg";
        };
        img.src = value;
    }
}
