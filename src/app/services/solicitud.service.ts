import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import {Observable}              from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
//import 'rxjs/Rx';  // use this line if you want to be lazy, otherwise:
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';  // debug
import 'rxjs/add/operator/catch';
import { Solicitud } from '../domain/solicitud';
import { Estado } from '../domain/estado';
import {Page} from "../domain/page";
import {UserService} from "./user.service";
import {SecureHttpService} from "./secure-http.service";
import {AppSettings} from "../app.settings";

@Injectable()
export class SolicitudService {

  headers: Headers;
  localStorage: number;
  solicitudStatusUrl:string=AppSettings.API_ENDPOINT;

  constructor(private secureHttpService:SecureHttpService,private userServices:UserService) {
    this.headers = new Headers();
  }

  getSolicitudrd(filterAndSort:string):Observable<Page<Solicitud>>{
    return this.secureHttpService
      .get(this.solicitudStatusUrl+'/solicitudes'+filterAndSort)
      .map(this._extractData)
      .catch(this._handleErrors);
  }

  getSolicitud(id:string):Observable<Solicitud>{
    return this.secureHttpService
      .get(this.solicitudStatusUrl+'/solicitud/'+id)
      .map(this._extractData)
      .catch(this._handleErrors);
  }

  getDisponible(local:number):Observable<number>{
    return this.secureHttpService
      .get(this.solicitudStatusUrl+'/disponible/'+local)
      .map(this._extractData)
      .catch(this._handleErrors);
  }

  saveSolicitud(solicitud:Solicitud):Observable<Solicitud>{
    solicitud.legajoCajero=this.userServices.user.code;
    solicitud.codigoLocal=`${this.userServices.user.storeCode}`;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let request:string=JSON.stringify(solicitud);
    return this.secureHttpService
      .post(this.solicitudStatusUrl+'/solicitud', request, headers)
      .map(this._extractData)
      .catch(this._handleErrors);
  }

  borrarSolicitud(solicitud:Solicitud):Observable<Solicitud>{
    solicitud.legajoCajero=this.userServices.user.code;
    solicitud.codigoLocal=`${this.userServices.user.storeCode}`;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const clone = JSON.parse(JSON.stringify(solicitud));
    clone.estadoAnt = solicitud.estado;
    let request:string=JSON.stringify(clone);
    return this.secureHttpService
      .post(this.solicitudStatusUrl+'/borrar', request, headers)
      .map(this._extractData)
      .catch(this._handleErrors);
  }

  setEstado(solicitud:Solicitud, nuevoEstado:Estado):Observable<Solicitud>{
    solicitud.legajoCajero=this.userServices.user.code;
    solicitud.codigoLocal=`${this.userServices.user.storeCode}`;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const clone = JSON.parse(JSON.stringify(solicitud));
    clone.estadoAnt = solicitud.estado;
    clone.estado = nuevoEstado;
    let request:string=JSON.stringify(clone);
    return this.secureHttpService
      .post(this.solicitudStatusUrl+'/cambiarEstado', request, headers)
      .map(this._extractData)
      .catch(this._handleErrors);
  }

  existeCodigoOperacion(codigo:string):Observable<number>{
    return this.secureHttpService
      .get(this.solicitudStatusUrl+'/existeCredito/'+codigo)
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
