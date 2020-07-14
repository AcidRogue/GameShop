import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {User} from "../models/user";
import {UserBackendService} from "../http/user-http";
import {ServerBackendService} from "../http/server-http";
import {MessageBackendService} from "../http/message-http";
import * as $ from 'jquery';
import * as moment from 'moment';
import {formatDate} from "@angular/common";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    currentUser;
    isDataAvailable = false;
    selectedServer;
    subscribedServers: any[];
    subscribedUsers: any[];
    messages: any[];
    currentMessages: any[];

    constructor(private storageService: StorageService,
                private router: Router,
                private userBackendService: UserBackendService,
                private serverBackendService: ServerBackendService,
                private messageBackendService: MessageBackendService) {
    }

    ngOnInit(): void {
        let userId = this.storageService.getCookie("currentUserId");

        if (!userId) {
            this.router.navigate(['/login']);
        }

        this.userBackendService.getUserById(userId).subscribe(user => {
            if (user) {
                this.currentUser = user;

                if (user.SubscribedServers && user.SubscribedServers.length !== 0) {
                    this.subscribedServers = user.SubscribedServers;

                    this.serverBackendService.getServerById(user.SubscribedServers[0]._id).subscribe(resp => {
                        if (resp) {
                            this.selectedServer = resp;
                            this.subscribedUsers = this.selectedServer.SubscribedUsers;
                            $(`#${this.selectedServer._id}`).addClass('selected-server');

                            this.getServerMessages();
                        }
                    })
                } else {
                    this.isDataAvailable = true;
                }
            }
        });
    }

    onServerChange(serverId) {
        if (this.selectedServer._id === serverId) {
            return;
        }

        $('.server-row').removeClass("selected-server");
        $(`#${serverId}`).addClass("selected-server");

        this.serverBackendService.getServerById(serverId).subscribe(server => {
            if (server) {
                this.selectedServer = server;

                this.getServerMessages();
            }
        });
    }

    serverList() {
        this.router.navigate(['/servers']);
    }

    sendMessage(event) {
        var serverId = this.selectedServer._id;
        var userId = this.currentUser._id;

        if (!serverId || !userId) {
            return;
        }

        let message = event.target.value;
        if (!message) {
            return;
        }

        let messageObj = {
            Content: message,
            SenderId: this.currentUser._id,
            ServerId: this.selectedServer._id
        };

        event.target.value = "";

        this.messageBackendService.sendMessage(messageObj).subscribe(result => {
            this.getServerMessages();
        })
    }

    getServerMessages() {
        let that = this;
        that.messageBackendService.getServerMessages(that.selectedServer._id).subscribe(messages => {
            that.currentMessages = messages;
            that.isDataAvailable = true;
        });
    }

    dateToLocal(date: moment.Moment): string{
        return this.formatDate(moment.utc(date).local().format());
    }

    formatDate(date:string): string{
        return moment(date).format("DD/MM/YYYY hh:mm");
    }

    onUserSelect(userId:string){
        this.router.navigate(['/users/' + userId]);
    }
}
