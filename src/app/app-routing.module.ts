import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ServersComponent} from "./servers/servers.component";
import {UserComponent} from "./user/user.component";
import {NewServerComponent} from "./new-server/new-server.component";

const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: '', component: DashboardComponent},
    {path: 'servers', component: ServersComponent},
    {path: 'user/:userId', component: UserComponent},
    {path: 'new-server', component: NewServerComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
