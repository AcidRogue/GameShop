import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../auth.component.css']
})
export class LoginComponent implements OnInit {
    loginError: boolean;
    loginErrorMessage: string;

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit(): void {
    }

    onLoginSubmit(loginForm: NgForm) {
        let email = loginForm.form.value.email;
        let password = loginForm.form.value.password;

        this.authService.login(email, password).subscribe(response  => {
            this.loginError = false;
            this.loginErrorMessage = "";
        }, err => {
            console.log(err);
            this.loginError = true;
            this.loginErrorMessage = err.error;
        });
    }

    redirectToRegister(){
        this.router.navigate(['register']);
    }

}


