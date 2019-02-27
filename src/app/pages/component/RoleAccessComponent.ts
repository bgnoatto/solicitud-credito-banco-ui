import {Directive,ElementRef} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserCarsa} from "../../domain/userCarsa";
import {forEach} from "@angular/router/src/utils/collection";

@Directive({
  selector:'[is-role]',
  inputs: ['validar:is-role']
})

export class RoleAccessComponent{

  constructor(private el:ElementRef,
              private userServices:UserService){ }

  set validar(rolesArray:string){
    var usr:UserCarsa = this.userServices.user;

    if(usr == null){
      console.log();
    }
    else{
      //let rolUsr = usr.roles["0"].authority;
      let rolesUsr = usr.roles;
      let rolesUsrAux:Array<string> = [];
      let valido:boolean = false;
      let rolesVar = rolesArray.split(',');

      rolesUsr.forEach(ru=>{
        rolesUsrAux.push(ru["authority"]);
      });
      rolesUsrAux.forEach(rua=>{
        rolesVar.forEach(rv=>{
          if(rv == rua){
            valido = true;
          }
        })
      })
      //let valido = (rolesVar.indexOf(rolUsr)>-1);
      this.el.nativeElement.hidden = !valido;
    }
  }
}
