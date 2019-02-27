import { Component,AfterViewInit,ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { SolicitudService } from './services/solicitud.service';
import { UserCarsa } from './domain/userCarsa';
import { Local } from './domain/local'
import { environment } from '../environments/environment';
import {UserDetailComponent} from "./pages/user-detail/user-detail.component";
import {Message} from "primeng/components/common/api";
import {MdSidenav} from "@angular/material";
import {LoginService} from "./services/LoginService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  user: UserCarsa;
  local: number;
  disponible: number;
  legajo:number;
  userError:boolean = false;
  envname:string='';
  versionPjson:string='';
  public msgs: Message[] = [];
  public usrName = 'Mi cuenta';

  constructor(private viewContainerRef: ViewContainerRef,
              private router: Router,
              private userService:UserService,
              private solicitudService:SolicitudService) {

    this.envname=environment.name;
    this.versionPjson = environment.version;
    userService.userAsync.subscribe(user=>{
      this.user=user;
      this.local=this.user.storeCode;
      this.usrName=user.email;
      if(user.storeCode){
        this.solicitudService.getDisponible(user.storeCode).subscribe(disponible => {
          /*if(disponible != 0){
           this.disponible = disponible;
           }
           else {
           this.disponible = 0.1;
           }*/
          this.disponible = disponible;
        }, error => {
          if(error.status > 499){
            this.userError = true;
          }
        });
      }else{
        this.disponible =null;
      }
    });

  }

  ngAfterViewInit() {

  }

  public logout(start:MdSidenav){
    this.userService.logout();
    this.router.navigateByUrl('/login');
    start.close();
  }

  openSidevar(start:MdSidenav){
    if(start._isClosed){
      start.open();
    }
    else{
      start.close();
    }
  }
}
