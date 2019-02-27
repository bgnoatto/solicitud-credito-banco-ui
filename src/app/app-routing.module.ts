import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AcercadeComponent }    from './pages/acercade/acercade.component';
import {SolicitudListComponent} from "./pages/solicitud-list/solicitud-list.component";
import {SolicitudComponent} from "./pages/solicitud/solicitud.component";
import {UserDetailComponent} from "./pages/user-detail/user-detail.component";
import {CanActivateViaOAuthGuard} from "./services/canActivateViaOAuthGuard";
import {LoginComponent} from "./pages/login/login.component";

const appRoutes: Routes = [

  {path: '',redirectTo: '/solicitudes',pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'userdetail', component: UserDetailComponent },
  { path: 'acercade', component: AcercadeComponent },
  { path: 'solicitudes', component: SolicitudListComponent, canActivate : [CanActivateViaOAuthGuard]},
  { path: 'solicitud', component: SolicitudComponent },
  { path: 'solicitud/:id', component: SolicitudComponent }

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
