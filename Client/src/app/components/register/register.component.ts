import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public username: string;
  public mail: string;
  public password: string;
  public repeatpass: string;
  constructor(public activeModal: NgbActiveModal, public authService: AuthService) {
  }

  ngOnInit() {
    this.username = '';
    this.mail = '';
    this.password = '';
    this.repeatpass = '';
  }

  save() {
    if (this.password.trim() === this.repeatpass.trim()) {
      if (this.username.trim().length > 0 && this.password.trim().length > 0 && this.mail.trim().length > 0) {
        this.authService.register(this.username.trim(), this.mail.trim(), this.password.trim());
        this.activeModal.close(this.username);
      }
    }
  }
}
