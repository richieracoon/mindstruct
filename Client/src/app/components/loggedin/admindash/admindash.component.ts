import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {ProjectsService} from '../../../services/projects.service';
import {BrowserModule} from '@angular/platform-browser';
import {User} from '../../../../model/user';
import {RegisterComponent} from '../../register/register.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Project} from '../../../../model/project';

@Component({
  selector: 'app-admindash',
  templateUrl: './admindash.component.html',
  styleUrls: ['./admindash.component.scss']
})
export class AdmindashComponent implements OnInit {

  foundproject = 'Destroy Ring';
  inviteuser = 'Legolas';
  searchuser: string;
  founduser: User;
  userprojects: Project[];
  newPname: string;
  hideEdit: boolean;

  constructor(public adminService: AdminService,
              private projectsService: ProjectsService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.hideEdit = true;
  }

  addProject(pname: string) {
    console.log('addproject geht');
    console.log('neuer projektname: ' + pname);
    this.projectsService.addProject(pname);
  }

  deleteProject(project: Project) {
    console.log('deleteproject geht');
    console.log(project);
    this.projectsService.deleteProject(project);
  }

  editProject(project: Project) {
    console.log('editproject geht');
    console.log(project);
    this.projectsService.editProject(project);
  }

  findUsername(searchuser) {
    this.adminService.getUsername(searchuser).then(user => this.founduser = user).then(user => this.getUserProjects(user));
  }

  getUserProjects(user: User) {
    this.adminService.getUserProjects(user).then(pList => this.userprojects = pList);
  }

  deleteUser(founduser) {
    this.adminService.deleteUser(this.founduser.id);
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
