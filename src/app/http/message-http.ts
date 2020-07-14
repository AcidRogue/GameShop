import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Message} from "../models/message";

@Injectable()
export class MessageBackendService {
    url:string = "http://localhost:9000";

    constructor(private http: HttpClient) {
    }

    getServerMessages(serverId: string): Observable<Message[]>{
        return this.http.get<Message[]>(this.url + '/api/servers/messages/' + serverId);
    }

    sendMessage(messageObj){
        return this.http.post(this.url + '/api/messages', messageObj);
    }

}



