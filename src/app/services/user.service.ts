import { Injectable } from '@angular/core';
import {UserCarsa} from "../domain/userCarsa";
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {SecureHttpService} from "./secure-http.service";
import {AppSettings} from "../app.settings";
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {

  resource: string = '/user/me';
  public userAsync: BehaviorSubject<UserCarsa>;
  public user:UserCarsa;

  constructor(private http:SecureHttpService) {
    this.userAsync=<BehaviorSubject<UserCarsa>>new BehaviorSubject(new UserCarsa());
  }

  getUser():BehaviorSubject<UserCarsa>{
    this.http
      .get(AppSettings.SSO_ENDPOINT + this.resource)
      .map(this._extractData)
      .catch(UserService._handleErrors).subscribe(userCarsa => {
        this.user=userCarsa;
        this.userAsync.next(userCarsa);
      });
    return this.userAsync;
  }

  private _extractData(res: Response){
    let body = res.json() || {};
    return body;
  }

  private static _handleErrors (error: any) {
    if(error.status == '403'){
      window.location.replace('#/forbidden');
    }
    else {
      return Observable.throw(error);
    }
  }

  public logout(){
    localStorage.removeItem('token');
    this.user=null;
    this.userAsync.next(new UserCarsa);
  }
}
