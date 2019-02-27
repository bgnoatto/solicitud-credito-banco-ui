import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SecureHttpService {

  headers: Headers;

  constructor(private http: Http){
    this.headers = new Headers();
  }

  get(url, params?: URLSearchParams): Observable<Response>{
    this.addHeaders();
    return this.http.get(url, {headers: this.headers, search: params});
    //.timeout(5000, new Error(""));
  }

  post(url, data, headers?:Headers,options?: RequestOptionsArgs){
    if(headers){
      this.headers=headers;
    }
    this.addHeaders();
    return this.http.post(url, data, {headers: this.headers});
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response>{
    this.addHeaders();
    return this.http.delete(url, {headers: this.headers});
  }

  addHeaders(){
    this.headers.append("Authorization","Bearer "+ localStorage.getItem('token'));
  }
}
