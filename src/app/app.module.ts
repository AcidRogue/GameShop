import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {AuthModule} from "./auth/auth.module";
import {DashboardComponent} from './dashboard/dashboard.component';
import {StorageService} from "./services/storage.service";
import {ServersComponent} from './servers/servers.component';
import {MessageBackendService} from "./http/message-http";
import {ServerBackendService} from "./http/server-http";
import {UserBackendService} from "./http/user-http";
import { UserComponent } from './user/user.component';
import { UserPopupComponent } from './user-popup/user-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {OVERLAY_PROVIDERS, OverlayModule} from "@angular/cdk/overlay";
import { NewServerComponent } from './new-server/new-server.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ServersComponent,
        UserComponent,
        UserPopupComponent,
        NewServerComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        AuthModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatDialogModule
    ],
    providers: [
        StorageService,
        MessageBackendService,
        ServerBackendService,
        UserBackendService,
        MatDialog,
        OverlayModule,
        OVERLAY_PROVIDERS,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
