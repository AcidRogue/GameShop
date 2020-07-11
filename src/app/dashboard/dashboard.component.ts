import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {User} from "../models/user";
import {UserBackendService} from "../http/user-http";
import {ServerBackendService} from "../http/server-http";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    currentUser:User;
    isDataAvailable = false;
    selectedServer;

    constructor(private storageService: StorageService,
                private router: Router,
                private userBackendService: UserBackendService,
                private serverBackendService: ServerBackendService) {
    }

    ngOnInit(): void {
        var userId = this.storageService.getCookie("currentUserId");

        if(!userId){
            this.router.navigate(['/login']);
        }

        this.userBackendService.getUserById(userId).subscribe(user => {
            if(user){
                this.currentUser = user;

                if(user.SubscribedServers && user.SubscribedServers.length !== 0){
                    this.serverBackendService.getServerById(user.SubscribedServers[0]._id).subscribe(resp=>{
                        if(resp){
                            this.selectedServer = resp;
                            this.isDataAvailable = true;
                        }
                    })
                }
            }
        });
    }

    onServerChange(serverId){
        console.log(serverId);
    }
}
