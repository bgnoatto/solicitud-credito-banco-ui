import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
//importante para nginx
import {LocationStrategy, HashLocationStrategy} from "@angular/common";

import { MaterialModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MessagesModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import {InputMaskModule} from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { DataTableModule} from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import {DropdownModule} from 'primeng/primeng';
import {CalendarModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import {SplitButtonModule} from 'primeng/primeng';
import {ContextMenuModule} from 'primeng/primeng';
import {FieldsetModule} from 'primeng/primeng';
import {TooltipModule} from 'primeng/primeng';
import { ConfirmDialogModule, SharedModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { AcercadeComponent } from './pages/acercade/acercade.component';
import {AppRoutingModule} from "./app-routing.module";
import { SolicitudListComponent } from './pages/solicitud-list/solicitud-list.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';
import {SolicitudService} from "./services/solicitud.service";
import {UserService} from "./services/user.service";
import {SecureHttpService} from "./services/secure-http.service";
import {ClienteService} from "./services/cliente.service";
import {RoleAccessComponent} from './pages/component/RoleAccessComponent';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { LoginComponent } from './pages/login/login.component';
import {CanActivateViaOAuthGuard} from "./services/canActivateViaOAuthGuard";
import {LoginService} from "./services/LoginService";
import { DescripcionEstadoPipe } from './pipe/descripcion-estado.pipe';
import { CapitalizeStringPipe } from './pipe/capitalize-string.pipe';


@NgModule({
  declarations: [
    AppComponent,
    AcercadeComponent,
    SolicitudListComponent,
    SolicitudComponent,
	  RoleAccessComponent,
    UserDetailComponent,
    LoginComponent,
    DescripcionEstadoPipe,
    CapitalizeStringPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ButtonModule,
    MessagesModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    PasswordModule,
    CalendarModule,
    ReactiveFormsModule,
    FieldsetModule,
    DataTableModule,
    DialogModule,
    GrowlModule,
    SplitButtonModule,
    ContextMenuModule,
    TooltipModule,
    ConfirmDialogModule,
    SharedModule,
    SlimLoadingBarModule.forRoot()
  ],
  providers: [SolicitudService,LoginService,UserService,ClienteService,SecureHttpService,CanActivateViaOAuthGuard,{ provide: LOCALE_ID, useValue: "es-AR" },{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
