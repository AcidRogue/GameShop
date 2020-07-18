import {Component, OnInit} from '@angular/core';
import {ServerBackendService} from "../http/server-http";
import {StorageService} from "../services/storage.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-new-server',
    templateUrl: './new-server.component.html'
})
export class NewServerComponent implements OnInit {
    serverError: string = "";
    serverImg: string = "https://icon-library.com/images/discord-server-icon-template/discord-server-icon-template-13.jpg";
    serverSrc: string = "";

    constructor(private serverBackendService: ServerBackendService,
                private storageService: StorageService,
                private router: Router) {
    }

    ngOnInit(): void {
        let userId = this.storageService.getCookie("currentUserId");

        if (!userId) {
            this.router.navigate(['/login']);
        }
    }

    createServer(form: NgForm) {
        let server = {
            Name: form.form.value.name,
            Description: form.form.value.description,
            ServerImage: this.serverImg
        };

        this.serverBackendService.createServer(server).subscribe(result => {
            if (result) {
                this.router.navigate(['/dashboard'])
            }
        }, err => {
            this.serverError = err.error.message;
        })
    }

    onImageChange() {
        let img = new Image();
        img.onload = () => {
            this.serverImg = this.serverSrc;
        };
        img.onerror = () => {
            this.serverImg = "https://icon-library.com/images/discord-server-icon-template/discord-server-icon-template-13.jpg";
        };
        img.src = this.serverSrc;
    }

}
