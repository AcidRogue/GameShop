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
    loginError: boolean = false;

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit(): void {
    }

    onLoginSubmit(loginForm: NgForm) {
        let email = loginForm.form.value.email;
        let password = loginForm.form.value.password;

        this.authService.login(email, password).subscribe(user  => {
            if(user){
                this.router.navigate(['/dashboard'])
            }
        });

        /*this.authService.login(email,password).subscribe(success => {
            console.log(success);


            /!*if (success && this.authService.isUserLoggedIn()) {
                this.errorMessage = '';
                this.message = this.authService.getSalutation();
                if ( this.redirectUrl ) {
                    this.router.navigate([this.redirectUrl]) // redirect user to initially requested url
                        .then(() => this.redirectUrl = undefined);
                }
            } else {
                this.errorMessage = 'Invalid username or password. Please try again.';
            }*!/
        });*/
    }

}


