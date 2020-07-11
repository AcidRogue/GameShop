import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() {
    }

    setCookie(key: string, val: string) {
        localStorage.setItem(key, val);
    }

    getCookie(key): string{
        return localStorage.getItem(key);
    }
}
