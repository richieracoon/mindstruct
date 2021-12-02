import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;

  constructor(public authService:AuthService, public activeModal: NgbActiveModal, public router: Router) {
    this.username = '';
    this.password = '';
  }

  ngOnInit() {
  }

  save() {
    if (this.username.trim().length > 0 && this.password.trim().length > 0) {
      this.authService.logIn(this.username.trim(), this.password.trim())
        .then((res:any)=>{
          if(this.authService.isLoggedIn){
            this.router.navigate(['/loggedin'])
          }
        });
      this.activeModal.close(this.username);
    }
  }
}
