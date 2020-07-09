import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../auth.component.css']
})
export class RegisterComponent implements OnInit {
    registerError: boolean;
    registerErrorMessage: string;

    pfpSrc: string = "https://3.bp.blogspot.com/-qDc5kIFIhb8/UoJEpGN9DmI/AAAAAAABl1s/BfP6FcBY1R8/s1600/BlueHead.jpg";
    pfpInput: string;

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit(): void {
    }

    onRegisterSubmit(registerForm: NgForm) {
        var email = registerForm.form.value.email;
        var username = registerForm.form.value.username;
        var password1 = registerForm.form.value.password;
        var password2 = registerForm.form.value.confirmPassword;

        if (password1 !== password2) {
            this.registerError = true;
            this.registerErrorMessage = "Passwords don't match";
            return;
        }

        let user = {
            FirstName: "",
            LastName: "",
            Username: username,
            Email: email,
            Password: password1,
            ProfileImage: this.pfpSrc,
            Role: 1
        };

        this.authService.register(user).subscribe(response => {
            this.registerError = false;
            this.registerErrorMessage = "";
            this.router.navigate(['/']);
        }, err => {
            this.registerError = true;
            this.registerErrorMessage = err.error;
        })
    }

    onPfpChange() {
        var img = new Image();
        img.onload = () => {
            this.pfpSrc = this.pfpInput;
        };
        img.onerror = () => {
            this.pfpSrc = "../../../assets/empty-pfp.png";
        };
        img.src = this.pfpInput;
    }
}
