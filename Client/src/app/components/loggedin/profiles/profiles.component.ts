import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {InvitationService} from '../../../services/invitation.service';
import {Project} from '../../../../model/project';
import {ParticipantdataService} from '../../../services/participantdata.service';
import {ProjectsService} from '../../../services/projects.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {

  username = 'Gandalf The White';
  password = '123456';
  usermail = 'gandalf@magic';
  edituser = true;
  editmail = true;
  editpass = true;
  lastproject = 'Fellowship';

  constructor(public authService: AuthService,
              private invitationService: InvitationService,
              private participantdataService: ParticipantdataService,
              private projectService: ProjectsService) {

  }

  ngOnInit() {
    this.username = this.authService.User.username;
    this.password = this.authService.User.password;
    this.usermail = this.authService.User.email;
    this.invitationService.retrieveInvitations(this.authService.User.id);
    }

  getlastproject() {
    this.projectService.getProject();
  }


  edit() {
    this.authService.edit(this.username, this.usermail, this.password)
      .then(() => {
        this.authService.User.username = this.username;
        this.authService.User.password = this.password;
        this.authService.User.email = this.usermail;
      });
  }

  acceptInvitation(invitationId: string, projectName: string) {
    // Removes pending Invitation
    this.invitationService.answerInvitation(invitationId);
    // TODO: Add User to Userlist of Project
    // Get updated Invitationlist
    this.invitationService.retrieveInvitations(this.authService.User.id);
  }

  denyInvitation(invitationId: string) {
    // Removes pending Invitation
    this.invitationService.answerInvitation(invitationId);
    // Get updated Invitationlist
    this.invitationService.retrieveInvitations(this.authService.User.id);
  }

}
