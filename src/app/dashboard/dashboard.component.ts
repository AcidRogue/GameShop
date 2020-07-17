import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {User} from "../models/user";
import {UserBackendService} from "../http/user-http";
import {ServerBackendService} from "../http/server-http";
import {MessageBackendService} from "../http/message-http";
import * as $ from 'jquery';
import * as moment from 'moment';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {UserPopupComponent} from "../user-popup/user-popup.component";

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
    selectedMessage: string = "";
    selectedMessageId: string = "";
    searchString: string = "";
    searchUserId: string = "";

    constructor(private storageService: StorageService,
                private router: Router,
                private userBackendService: UserBackendService,
                private serverBackendService: ServerBackendService,
                private messageBackendService: MessageBackendService,
                public dialog: MatDialog) {
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

                            this.messageBackendService.getServerMessages(this.selectedServer._id).subscribe(messages => {
                                this.currentMessages = messages;
                                this.isDataAvailable = true;
                            });
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

        if (this.selectedMessageId) { //Updating a message
            let messageObj = {
                Content: message
            };

            this.messageBackendService.updateMessage(this.selectedMessageId, messageObj).subscribe(result => {
                this.getServerMessages();
            });

            event.target.value = "";
            this.selectedMessage = "";
            this.selectedMessageId = "";
        } else { //Creating a message
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
    }

    getServerMessages() {
        let that = this;
        that.messageBackendService.getServerMessages(that.selectedServer._id).subscribe(messages => {
            that.currentMessages = messages;
        });
    }

    dateToLocal(date: moment.Moment): string {
        return this.formatDate(moment.utc(date).local().format());
    }

    formatDate(date: string): string {
        return moment(date).format("DD/MM/YYYY hh:mm");
    }

    onUserSelect(userId: string) {
        this.dialog.open(UserPopupComponent, {
            data: {
                UserId: userId
            },
        });
    }

    openProfile() {
        this.router.navigate(['/user/' + this.currentUser._id]);
    }

    searchMessages() {
        let searchObj:any = {
            ServerId: this.selectedServer._id
        };
        if (this.searchString) {
            searchObj.Content = this.searchString;
        }
        if(this.searchUserId){
            searchObj.SenderId = this.searchUserId;
        }
        this.messageBackendService.searchMessages(searchObj).subscribe(messages => {
            this.currentMessages = messages;
        })
    }

    editMessage(message: string, messageId: string) {
        this.selectedMessage = message;
        this.selectedMessageId = messageId;
    }

    deleteMessage(messageId: string) {
        this.messageBackendService.deleteMessage(messageId).subscribe(result => {
            this.getServerMessages();
        })
    }

    logout(){
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}
