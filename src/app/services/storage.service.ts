import {Injectable} from '@angular/core';
import {User} from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() {
    }

    setCookie(key: string, val: object):void {
        localStorage.setItem(key, JSON.stringify(val));
    }

    getCookie(key): {}{
        return JSON.parse(localStorage.getItem(key));
    }

    getCurrentUser(): User{
        return <User>this.getCookie("currentUser");
    }
}
