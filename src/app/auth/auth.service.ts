import {Injectable} from '@angular/core';
import {UserBackendService} from "../http/user-http";
import {User} from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private userBackendService: UserBackendService) {
    }

    login(email: string, password: string): any {
        return this.userBackendService.authenticate({Email: email, Password: password});
    }

    register(user: User): any{
        return this.userBackendService.createUser(user);
    }

}
