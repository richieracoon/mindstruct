import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {OnInit} from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(public authService:AuthService) {
  }

  ngOnInit(): void {
    this.authService.checkIfLoggedIn();
  }

}
