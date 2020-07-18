import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {User} from "../../models/user";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    registerError: boolean;
    registerErrorMessage: string;

    pfpSrc: string = "https://3.bp.blogspot.com/-qDc5kIFIhb8/UoJEpGN9DmI/AAAAAAABl1s/BfP6FcBY1R8/s1600/BlueHead.jpg";
    pfpInput: string;

    constructor(private authService: AuthService, private router: Router, private storageService: StorageService) {
    }

    ngOnInit(): void {
        let userId = this.storageService.getCookie("currentUserId");

        if (userId) {
            this.router.navigate(['/dashboard']);
        }
    }

    onRegisterSubmit(registerForm: NgForm) {
        let email = registerForm.form.value.email;
        let username = registerForm.form.value.username;
        let password1 = registerForm.form.value.password;
        let password2 = registerForm.form.value.confirmPassword;

        if (password1 !== password2) {
            this.registerError = true;
            this.registerErrorMessage = "Passwords don't match";
            return;
        }

        let user: User = {
            FirstName: "",
            LastName: "",
            Username: username,
            Email: email,
            Password: password1,
            ProfileImage: this.pfpSrc,
            SubscribedServers: []
        };

        this.authService.register(user).subscribe(response => {
            this.registerError = false;
            this.registerErrorMessage = "";
            this.router.navigate(['/login']);
        }, err => {
            this.registerError = true;
            this.registerErrorMessage = err.error;
        })
    }

    onPfpChange() {
        let img = new Image();
        img.onload = () => {
            this.pfpSrc = this.pfpInput;
        };
        img.onerror = () => {
            this.pfpSrc = "https://3.bp.blogspot.com/-qDc5kIFIhb8/UoJEpGN9DmI/AAAAAAABl1s/BfP6FcBY1R8/s1600/BlueHead.jpg";
        };
        img.src = this.pfpInput;
    }
}
