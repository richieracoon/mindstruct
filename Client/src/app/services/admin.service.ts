import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Rights} from '../../model/rights';
import {User} from '../../model/user';
import {ParticipantdataService} from './participantdata.service';
import {ProjectsService} from './projects.service';
import {Project} from '../../model/project';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  crossDomain: true,
  xhrFields: { withCredentials: true }
};


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(public httpClient: HttpClient,
              private participantdataService: ParticipantdataService,
              private projectsService: ProjectsService) { }

  editUser(id: string, username: string, email: string, password: string) {
    return this.httpClient.put(`https://localhost:8843/edit/${id}`, {username, email , password}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successful edit!');
      }).catch((err) => {
        console.log('Edit not successful: ' + err);
      });
  }

  deleteUser(id: string) {
    return this.httpClient.delete(`https://localhost:8843/delete/${id}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successful delete!');
      }).catch((err) => {
        console.log('Delete not successful: ' + err);
      });
  }

  getUsers() {
    return this.httpClient.get('https://localhost:8843/getUsers', httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Numbers of Users found: ' + res.users.length);
      }).catch((err) => {
        console.log(err);
      });
  }

  getUser(id: string) {
    return this.httpClient.get(`https://localhost:8843/getUser/${id}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully found User with ID ' + id);
      }).catch((err) => {
        console.log(err);
      });
  }

  getUsername(username: string): Promise<User> {
    console.log(username);
    return this.httpClient.get(`https://localhost:8843/getUsername/${username}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully found User with username ' + username);
        return res.user as User;
      }).catch((err) => {
        return err;
      });
  }

  getUserProjects(user: User): Promise<Project[]> {
    console.log(user);
    return this.httpClient.post(`https://localhost:8843/getUserProjects`, {user}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully found Projects for User');
        return res.pList as Project[];
      }).catch((err) => {
        return [];
      });
  }

  getInvitedUserIDs(projectId: string) {
    return this.httpClient.get(`https://localhost:8843/getProjectInvites/${projectId}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        // Array mit zum Projekt eingeladenen User-IDs
      }).catch((err) => {
        console.log(err);
      });
  }

  testRoute() {
    // this.editUser("5e149cba24c0ed379c27b1d6", "MaxMusti77", "muster@mail.com","1234");
    // this.deleteUser("5e149cba24c0ed379c27b1d6");
    // this.getUsers();
    // this.getUser('5e134f547d59e10c14b913bd');
    this.getInvitedUserIDs('abc');
  }
}
