import { EventEmitter, Injectable, Input } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../../model/project';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  crossDomain: true,
  xhrFields: {withCredentials: true}
};


@Injectable({
  providedIn: 'root'
})


export class ProjectsService {

  public projectlistChangedEmitter = new EventEmitter<void>();


  constructor(public httpClient: HttpClient) {
  }

  addProject(pname: string) {
    console.log('dataservice addProject geht');
    return this.httpClient.post(`https://localhost:8843/addProject`, {pname}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully added Project with Project');
        this.projectlistChangedEmitter.emit();
      }).catch((err) => {
        console.log(err);
      });
  }

  getProjects(): Promise<Project[]> {
    console.log('dataservice getProjects geht');
    return this.httpClient.get(`https://localhost:8843/getProjects`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully found Projects for User');
        return res.projectList as Project[];
      }).catch((err) => {
        console.log(err);
        return [];
      });
  }

  getProject() {
    console.log('dataservice getProject geht');
    return this.httpClient.get(`https://localhost:8843/getProject`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully found Project for User');
        return res.Project as Project;
      }).catch((err) => {
        console.log(err);
      });
  }

  editProject(project: Project) {
    console.log('dataservice editProject geht');
    return this.httpClient.put(`https://localhost:8843/editProject/${project._id}`, project, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successful edited project' + project.pname);
        this.projectlistChangedEmitter.emit();
      }).catch((err) => {
        console.log('Edit not successful: ' + err);
      });
  }

  deleteProject(project: Project) {
    console.log('dataservice deleteProject geht');
    return this.httpClient.delete(`https://localhost:8843/deleteProject/${project._id}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully deleted project!' + project.pname);
        this.projectlistChangedEmitter.emit();
      }).catch((err) => {
        console.log('Delete not successful: ' + err);
      });
  }


}
