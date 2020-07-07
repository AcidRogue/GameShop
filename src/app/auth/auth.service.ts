import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {UserBackendService} from "../http/user-http";
import {User} from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private userBackendService: UserBackendService) {

    }

    login(email: string, password: string): Observable<User> {
        return this.userBackendService.findUserByEmail(email)
            .map(user => {
                if (user && user.password === password) {
                    return user;
                }
            });
    }
}
