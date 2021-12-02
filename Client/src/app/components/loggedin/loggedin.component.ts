import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Rights} from "../../../model/rights";

@Component({
  selector: 'app-loggedin',
  templateUrl: './loggedin.component.html',
  styleUrls: ['./loggedin.component.scss']
})
export class LoggedinComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkIfLoggedIn();
  }

}
