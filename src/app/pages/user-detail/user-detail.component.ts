import {Component, AfterViewInit, ViewContainerRef, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserCarsa} from "../../domain/userCarsa";



@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  public user: UserCarsa;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.userAsync.subscribe(u=>{
      this.user=u;
    });
  }

}
