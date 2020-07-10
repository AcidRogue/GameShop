import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {AuthModule} from "./auth/auth.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import {StorageService} from "./services/storage.service";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AuthModule,
    HttpClientModule
  ],
  providers: [StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
