import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {AuthService} from "./auth.service";
import {RegisterComponent} from "./register/register.component";

const loginRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(loginRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
      AuthService
  ]
})
export class AuthRoutingModule {}
