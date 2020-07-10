import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {User} from "../models/user";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    currentUser:User;

    constructor(private storageService: StorageService, private router: Router) {
    }

    ngOnInit(): void {
        var user = this.storageService.getCurrentUser();

        if (!user) {
            this.router.navigate(['/login']);
        }

        this.currentUser = user;

        console.log(this.currentUser)
    }
}
