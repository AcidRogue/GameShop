import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {ServerBackendService} from "../http/server-http";
import {UserBackendService} from "../http/user-http";

@Component({
    selector: 'app-servers',
    templateUrl: './servers.component.html',
    styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
    currentUser;
    isDataAvailable = false;
    serverList: any[];
    currentUserId: string;
    showList: boolean = false;

    constructor(private router: Router,
                private storageService: StorageService,
                private serverBackendService: ServerBackendService,
                private userBackendService: UserBackendService) {
    }

    ngOnInit(): void {
        var userId = this.storageService.getCookie("currentUserId");

        if (!userId) {
            this.router.navigate(['/login']);
        }

        this.currentUserId = userId;

        this.reRenderServerList();
    }

    reRenderServerList(){
        this.userBackendService.getUserById(this.currentUserId).subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.getServers();
            }
        });
    }

    getServers() {
        this.serverBackendService.getServers().subscribe(servers => {
            if (servers) {
                this.serverList = servers;
                for(let i = 0; i < this.serverList.length; i++){
                    this.serverList[i].IsSubscribed = false;
                    for(let j = 0; j < this.currentUser.SubscribedServers.length; j++){
                        if(this.serverList[i]._id === this.currentUser.SubscribedServers[j]._id){
                            this.serverList[i].IsSubscribed = true;
                        }
                    }
                }
                this.isDataAvailable = true;
                this.showList = true;
            }
        });
    }

    subscribe(serverId: string){
        this.showList = false;
        this.serverBackendService.subscribeToServer(this.currentUser._id, serverId).subscribe(response => {
            if(response.status === 1){
                this.reRenderServerList();
            }
        });
    }

    unsubscribe(serverId: string){
        this.showList = false;
        this.serverBackendService.unsubscribeFromServer(this.currentUser._id, serverId).subscribe(response => {
            if(response.status === 1){
                this.reRenderServerList();
            }
        })
    }
}
