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

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ServersComponent,
        UserComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        AuthModule,
        HttpClientModule
    ],
    providers: [
        StorageService,
        MessageBackendService,
        ServerBackendService,
        UserBackendService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
