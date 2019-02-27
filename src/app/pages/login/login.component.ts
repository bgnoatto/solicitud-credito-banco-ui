import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {LoginService} from "../../services/LoginService";
import {UserService} from "../../services/user.service";
import {UserCarsa} from "../../domain/userCarsa";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user:UserCarsa;
  username: string;
  password: string;
  authForm: FormGroup;

  submitted: boolean;

  active: boolean=true;

  badCredentials: boolean;
  forbiddenError: boolean;

  loading: boolean;

  constructor(public router:Router,
              private fb: FormBuilder,
              private loginService:LoginService,
              private userService:UserService) {

    this.user=this.userService.user;
    this.badCredentials = false;
    this.forbiddenError = false;
    this.buildForm();
  }

  login(event, username, password) {
    event.preventDefault();
    this.forbiddenError=false;
    this.badCredentials=false;
    this.loginService.login(username, password)
      .subscribe(
        response => {
          localStorage.setItem('token', response.access_token);
          this.getUser();
          //this.router.navigateByUrl('/solicitudes');
          window.location.replace('');
        },
        error => {
          this.badCredentials=true;
          console.log(error);
        }
      );
  }


  getUser():void {
    this.userService.getUser();
  }

  logout(){
    this.userService.logout();
    window.location.replace('');
  }


  buildForm(): void {
    this.authForm = this.fb.group({
      'username': [this.username, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern('(\\w+[a-zA-Z0-9])')
      ]],
      'password': [this.password, [
        Validators.required
      ]]
    });
    this.authForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }


  onValueChanged(data?: any) {
    if (!this.authForm) { return; }
    const form = this.authForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'username':'',
    'password': ''
  };
  validationMessages = {
    'username': {
      'required':      'Campo Requerido.',
      'minlength':     'Minimo 4 letras.',
      'maxlength':     'Maximo 20 letras.',
      'pattern':       'El usuario ingresado no tienen un formato valido.'
    },
    'password': {
      'required':      'Campo Requerido.'
    }
  };

}
