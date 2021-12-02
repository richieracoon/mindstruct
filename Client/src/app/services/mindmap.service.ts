import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {DiagramService} from "./diagram.service";
import {Invitation} from '../../model/invitation';
import {Mindmap} from '../../model/mindmap';
import {Router} from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  crossDomain: true,
  xhrFields: { withCredentials: true }
};

@Injectable({
  providedIn: 'root'
})
export class MindmapService {

  public mindmaps: Mindmap[] = [];

  constructor(private httpClient: HttpClient, private diagramService: DiagramService, public router: Router) { }

  createMindmap(rootname: string, projectID: string) {
    const data = this.diagramService.serizalizeNewMindmap(rootname);
    return this.httpClient.post('https://localhost:8843/createMindmap', {rootname, projectID, data}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successful created Mindmap!');
      }).catch((err) => {
        // Registration not successful
      });
  }

  getMindmaps(projectId: string){
    this.mindmaps = [];
    return this.httpClient.get(`https://localhost:8843/getMindmaps/${projectId}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        for(const row of res.mindmaps){
          this.mindmaps.push(new Mindmap(row.id, row.name, row.data));
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  editMindmap(mindmapId: string, rootname: string){
    return this.httpClient.put(`https://localhost:8843/editMindmap/${mindmapId}`, {rootname}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successful edit!');
      }).catch((err) => {
        console.log('Edit not successful: ' + err);
      });
  }

  deleteMindmap(mindmapId: string){
    return this.httpClient.delete(`https://localhost:8843/deleteMindmap/${mindmapId}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully deleted mindmap!');
      }).catch((err) => {
        console.log(err);
      });
  }

  loadMindmap(data: Object, mindmapId: string){
    this.diagramService.deserializeMindmap(data, mindmapId);
    this.router.navigate(['/mindmap'])
  }

  updateMindmap(data: Object, mindmapId: string){
    return this.httpClient.put(`https://localhost:8843/updateMindmap/${mindmapId}`, {data}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successful update mindmap data!');
      }).catch((err) => {
        console.log('Update not successful: ' + err);
      });
  }

  syncMindmap(mindmapId: string){
    return this.httpClient.get(`https://localhost:8843/syncMindmap/${mindmapId}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        this.diagramService.deserializeMindmap(res.data, mindmapId);
      }).catch((err) => {
        console.log(err);
      });
  }
}
