import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {FormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {RegisterComponent} from "./register/register.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule
    ],
    declarations: [LoginComponent, RegisterComponent],
    exports: [AuthRoutingModule, LoginComponent, RegisterComponent]
})
export class AuthModule {
}
