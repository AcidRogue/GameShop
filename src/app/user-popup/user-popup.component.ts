import {Component, Inject, Input, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {UserBackendService} from "../http/user-http";

@Component({
    selector: 'app-user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user-popup.component.css']
})
export class UserPopupComponent implements OnInit {
    userId: string = "";
    selectedUser: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private userBackendService: UserBackendService) {
    }

    ngOnInit(): void {
        this.userBackendService.getUserById(this.data.UserId).subscribe(user => {
            if(user){
                this.selectedUser = user;
                console.log(this.selectedUser)
            }
        }, err => {
            console.log("User not found");
        })
    }

    ngOnDestroy(){

    }

}
