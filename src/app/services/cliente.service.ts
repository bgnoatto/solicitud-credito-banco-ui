import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import {Observable}              from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
//import 'rxjs/Rx';  // use this line if you want to be lazy, otherwise:
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';  // debug
import 'rxjs/add/operator/catch';
import { Solicitud } from '../domain/solicitud';
import {Page} from "../domain/page";
import {UserService} from "./user.service";
import {SecureHttpService} from "./secure-http.service";
import {AppSettings} from "../app.settings";
import {Cliente} from "../domain/cliente";

@Injectable()
export class ClienteService {

  headers: Headers;
  clienteStatusUrl:string=AppSettings.API_CLIENTE_ENDPOINT;

  constructor(private http:Http,private userServices:UserService) {
    this.headers = new Headers();
  }

  getCliente(documento:string,sexo:string):Observable<Cliente>{
    let sexoN:number= (sexo==='M')?0:1;
    return this.http
      .get(this.clienteStatusUrl+`/${sexoN}/${documento}`)
      .map(this._extractData)
      .catch(this._handleErrors);
  }

  private _extractData(res: Response){
    let body = res.json() || [];
    return body;
  }
  private _handleErrors (error: any) {;
    return Observable.throw(error);
  }

  addHeaders(){
    /*if(Cookie.get('Carsa-Token')){
      this.headers.append('Authorization', 'Bearer ' + Cookie.get('Carsa-Token'));
    }*/
  }
}
