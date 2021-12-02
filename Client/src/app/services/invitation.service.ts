import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Invitation} from '../../model/invitation';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  crossDomain: true,
  xhrFields: { withCredentials: true }
};

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  public invitations: Invitation[] = [];

  constructor(private httpClient: HttpClient) { }

  createInvitation(projectID: string, senderID: string, username: string){
    return this.httpClient.post('https://localhost:8843/invite', {username, senderID, projectID}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Created new Invitation!');
      }).catch((err) => {
        // Login not successful
      });
  }

  retrieveInvitations(userId: string){
    this.invitations = [];
    return this.httpClient.get(`https://localhost:8843/getInvites/${userId}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        for(const row of res.invites){
          this.invitations.push(new Invitation(row.invitationID, row.projectID, row.projectName, row.senderName));
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  answerInvitation(invitationId: string) {
    return this.httpClient.delete(`https://localhost:8843/answerInvite/${invitationId}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successful answered and deleted pending invitation!');
      }).catch((err) => {
        console.log(err);
      });
  }
}
