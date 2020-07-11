import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {Server} from "../models/server";
import {Injectable} from "@angular/core";

@Injectable()
export class ServerBackendService {
    url:string = "http://localhost:9000";

    constructor(private http: HttpClient) {
    }

    getServerById(id: string): Observable<Server>{
        return this.http.get<Server>(this.url + '/api/servers/' + id);
    }

}

