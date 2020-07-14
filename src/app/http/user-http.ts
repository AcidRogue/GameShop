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

    getUserById(id: string): Observable<User>{
        return this.http.get<User>(this.url + '/api/users/' + id);
    }

    findAllUsers():Observable<User[]>{
        return this.http.get<User[]>(this.url + '/api/users');
    }

    authenticate(credentials: object): Observable<User>{
        return this.http.post<User>(this.url + '/api/authenticate', credentials);
    }

    createUser(user: User): Observable<User>{
        return this.http.post<User>(this.url + '/api/users', user);
    }

    updateUser(user: User): Observable<User>{
        return this.http.put<User>(this.url + '/api/users', user);
    }
}

