import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Rights} from '../../model/rights';
import {User} from '../../model/user';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  crossDomain: true,
  xhrFields: { withCredentials: true }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn = false;
  public User = null;

  constructor(private httpClient: HttpClient) { }

  logIn(username: string, password: string): Promise<void> {
    return this.httpClient.post('https://localhost:8843/login', {username, password}, httpOptions)
      .toPromise()
      .then((res: any) => {
        this.User = new User(res.user._id, res.user.username, res.user.email, res.user.password , res.user.rights, res.user.isGoogle);
        console.log(this.User.username + ' has logged in!');
        this.isLoggedIn = true;
        console.log(this.isLoggedIn);
      }).catch((err) => {
        // Login not successful
      });
  }

  logout(){
    return this.httpClient.post('https://localhost:8843/logout', null, httpOptions)
      .toPromise()
      .then(() => {
        this.isLoggedIn = false;
        console.log("Successfully logged out!");
      }).catch((err) => {
        // Logout not successful
      });
  }

  checkIfLoggedIn(){
    return this.httpClient.get('https://localhost:8843/login')
      .toPromise()
      .then((res: any)=>{
        this.isLoggedIn = true;
        this.User = new User(res.user._id, res.user.username, res.user.email, res.user.password , res.user.rights, res.user.isGoogle);
      }).catch((err)=>{
        this.isLoggedIn = false;
        console.log(err);
      });
  }

  register(username: string, email: string, password: string) {
    return this.httpClient.post('https://localhost:8843/registration', {username, email , password}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successful registration!');
      }).catch((err) => {
        // Registration not successful
      });
  }

  edit(username: string, email: string, password: string) {
    console.log(username);
    return this.httpClient.put(`https://localhost:8843/user/${this.User.id}`, {username, email , password}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successful edit!');
      }).catch((err) => {
        // Edit not successful
      });
  }
}
