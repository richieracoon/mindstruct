import { Component, OnInit } from '@angular/core';
import {InvitationService} from '../../../services/invitation.service';
import {AuthService} from '../../../services/auth.service';
import {ProjectsService} from '../../../services/projects.service';
import {Project} from '../../../../model/project';
import {ParticipantdataService} from '../../../services/participantdata.service';
import {Participants} from '../../../../model/participants';
import {MindmapService} from '../../../services/mindmap.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects = ['Destroy Ring', 'Project 2', 'Project 3', 'Project 4'];
  userprojects: Project[] =
    [{_id: '5e165e6ce8de0647e4a0b905', pname: 'Reach Rivendell', creationDate: new Date()}];
  projectparticipants: string[];
  mindmaps = ['Fellowship', 'Mindmap 2', 'Mindmap 3', 'Mindmap 4'];
  participants = ['Legolas', 'Gandalf', 'Boromir', 'Frodo', 'Samweis'];
  rights = ['Admin', 'Contributor', 'Spectator'];
  partRights: string;
  hideparticipantinput: boolean;
  hideaddproject: boolean;
  hideaddmindmap: boolean;
  hideaddinvite: boolean;
  toggleeditprojectinput: boolean;
  currentProjectID: string;

  newPname: string;
  editPname: string;

  addMindmap: string;
  addPerson: string;
  pickproject = 'Destroy Ring';
  pickmindmap = '';
  pickparticipant = 'Gandalf';


  constructor(private invitationService: InvitationService,
              private authService: AuthService,
              private projectsService: ProjectsService,
              private participantdataService: ParticipantdataService,
              private mindmapService: MindmapService) {
    this.projectsService.projectlistChangedEmitter.subscribe(() => this.getProjects()); }

  ngOnInit() {
    this.hideparticipantinput = true;
    this.hideaddproject = true;
    this.hideaddmindmap = true;
    this.hideaddinvite = true;
    this.toggleeditprojectinput = true;


    this.getProjects();
  }

  addParticipant() {
    console.log('Username:' + this.addPerson);
    this.invitationService.createInvitation('abc', this.authService.User.id, this.addPerson);
    this.addPerson = '';
  }

  openProject(project: Project) {
    console.log('get participants geht');
    this.mindmapService.getMindmaps(project._id);
    this.currentProjectID = project._id;
    this.participantdataService.getParticipants(project).then(partList => this.projectparticipants = partList);
    this.pickproject = project.pname;
  }

  deleteParticipant(participant) {
    console.log('delete participants geht');
    this.participantdataService.deleteParticipant(participant);
  }

  getUserRights(participant: string) {
    console.log('get user rights geht');
    this.participantdataService.getRights(participant). then(rights => this.partRights = rights);
  }

  changeUserRights(participant: string, rights) {
    console.log('change user rights geht');
    this.participantdataService.changeRights(participant, rights);
  }

  addProject(pname: string) {
    console.log('addproject geht');
    console.log('neuer projektname: ' + pname);
    this.projectsService.addProject(pname);
  }

  getProjects() {
    console.log('getprojects geht');
    this.projectsService.getProjects().then(projectList => this.userprojects = projectList);
  }

  editProject(project: Project) {
    console.log('editproject geht');
    console.log(project);
    this.projectsService.editProject(project);
  }

  deleteProject(project: Project) {
    console.log('deleteproject geht');
    console.log(project);
    this.projectsService.deleteProject(project);
  }

  editMindmap(mindmapID: string) {
    this.mindmapService.editMindmap(mindmapID, 'Dummyrootname');
    this.mindmapService.getMindmaps(this.currentProjectID);
  }

  newMindmap() {
    this.mindmapService.createMindmap(this.addMindmap, this.currentProjectID);
    this.mindmapService.getMindmaps(this.currentProjectID);
    this.addMindmap = '';
  }

  deleteMindmap(mindmapID: string) {
    this.mindmapService.deleteMindmap(mindmapID);
    this.mindmapService.getMindmaps(this.currentProjectID);
  }

}
