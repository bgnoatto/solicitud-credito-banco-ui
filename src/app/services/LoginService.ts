import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {AppSettings} from "../app.settings";


@Injectable()
export class LoginService {

  constructor(public http: Http) {}

  login(username, password) : Observable<any> {
    let headers = new Headers();
    let body = "username="+username+"&password="+password+"&grant_type=password&client_id=musipago&client_secret=musipago";
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post( AppSettings.SSO_ENDPOINT + "/oauth/token", body, {headers: headers} )
      .map(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
