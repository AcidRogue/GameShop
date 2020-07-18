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

    createServer(serverData: any): Observable<Server>{
        return this.http.post<Server>(this.url + '/api/servers/', serverData);
    }

    getServerById(id: string): Observable<Server>{
        return this.http.get<Server>(this.url + '/api/servers/' + id);
    }

    getServers(): Observable<Server[]>{
        return this.http.get<Server[]>(this.url + '/api/servers');
    }

    subscribeToServer(userId: string, serverId: string): Observable<any>{
        return this.http.get(this.url + '/api/subscribe/' + userId + "/" + serverId);
    }

    unsubscribeFromServer(userId: string, serverId: string): Observable<any>{
        return this.http.get(this.url + '/api/unsubscribe/' + userId + "/" + serverId);
    }
}



