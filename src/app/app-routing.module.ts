import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RateComponent} from "./rate/rate.component";
import {LoginComponent} from "./login/login.component";
import {ReportComponent} from "./report/report.component";
import {AuthResolver} from "./auth.resolver";
import {AuthGuard} from "./auth.guard";

export const LOGIN_PATH = 'login'
export const RATE_PATH = 'rate'
export const REPORT_PATH = 'report'

const routes: Routes = [
  {
    path: LOGIN_PATH,
    component: LoginComponent
  },
  {
    path: RATE_PATH,
    component: RateComponent,
    canActivate: [AuthGuard],
    resolve: {name: AuthResolver},
    runGuardsAndResolvers: "always"
  },
  {
    path: REPORT_PATH,
    component: ReportComponent,
    canActivate: [AuthGuard],
    resolve: {name: AuthResolver},
    runGuardsAndResolvers: "always",
  },
  {path: '', redirectTo: RATE_PATH, pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
