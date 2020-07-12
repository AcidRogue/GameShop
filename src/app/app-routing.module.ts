import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ServersComponent} from "./servers/servers.component";

const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: '', component: DashboardComponent},
    {path: 'servers', component: ServersComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
