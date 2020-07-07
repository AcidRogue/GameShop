import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {User} from "../models/user";
import {Injectable} from "@angular/core";

@Injectable()
export class UserBackendService {
    url:string = "http://localhost:9000";

    constructor(private http: HttpClient) {

    }

    findUserById(id: number): Observable<User> {
        return this.http.get<User>(this.url + '/api/users/' + id);
    }

    findUserByEmail(email: string): Observable<User>{
        return this.findAllUsers().map(users => {
            return users.find(user => user.email === email);
        })
    }

    findAllUsers():Observable<User[]>{
        return this.http.get<User[]>(this.url + '/api/users');
    }
}

