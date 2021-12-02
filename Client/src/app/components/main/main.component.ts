import { Component, OnInit } from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private modalService: NgbModal, public authService:AuthService) { }

  ngOnInit() {
    this.authService.checkIfLoggedIn();
  }
  loginBtnClicked() {
    console.log('loginbtn geht');
    const modalReference = this.modalService.open(LoginComponent);
    modalReference.result
      .then((result: any) => {
        console.log('loginstuff läuft');
      })
      .catch((error) => {
        console.log('Window closed: ' + error);
      });
  }

  regBtnClicked() {
    console.log('regbtn geht');
    const modalReference = this.modalService.open(RegisterComponent);
    modalReference.result
      .then((result: any) => {
        console.log('regstuff läuft');
      })
      .catch((error) => {
        console.log('Window closed: ' + error);
      });
  }
}
