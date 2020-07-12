import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {User} from "../models/user";
import {UserBackendService} from "../http/user-http";
import {ServerBackendService} from "../http/server-http";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    currentUser:User;
    isDataAvailable = false;
    selectedServer;
    subscribedServers: any[];
    subscribedUsers: any[];

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
                    this.subscribedServers = user.SubscribedServers;

                    this.serverBackendService.getServerById(user.SubscribedServers[0]._id).subscribe(resp => {
                        if(resp) {
                            this.selectedServer = resp;
                            this.subscribedUsers = this.selectedServer.SubscribedUsers;
                            this.isDataAvailable = true;
                        }
                    })
                }
                else{
                    this.isDataAvailable = true;
                }
            }
        });
    }

    onServerChange(serverId){
        this.serverBackendService.getServerById(serverId).subscribe(resp => {

        })
    }

    serverList(){
        this.router.navigate(['/servers']);
    }
}
