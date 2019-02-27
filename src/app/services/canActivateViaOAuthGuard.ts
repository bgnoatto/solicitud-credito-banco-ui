import { Injectable } from '@angular/core';
import { CanActivate , Router} from '@angular/router';
import {UserService} from "./user.service";

@Injectable()
export class CanActivateViaOAuthGuard implements CanActivate {

  constructor(public router : Router,private userService: UserService) {}
  canActivate() {

    if(localStorage.getItem("token") === null){
      this.router.navigateByUrl('/login');
    }
    if(!this.userService.user){
      this.userService.getUser().subscribe(user=>{
      }, error => {
        if (error.status == 401) {
          console.log("error al obtener el usuario 401");
          localStorage.getItem("token");
          this.userService.user=null;
          this.router.navigateByUrl('/');
        } else {
          if (error.status > 499) {
            console.log("error al obtener el usuario 499")
          }
        }
      });
    }
    return (localStorage.getItem("token") === null) ? false : true;
  }
}
