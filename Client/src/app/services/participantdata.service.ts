import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../../model/project';
import {Participants} from '../../model/participants';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  crossDomain: true,
  xhrFields: {withCredentials: true}
};

@Injectable({
  providedIn: 'root'
})
export class ParticipantdataService {

  public participantlistChangedEmitter = new EventEmitter<void>();

  constructor(public httpClient: HttpClient) { }

  getParticipants(project: Project): Promise<string[]> {
    console.log('dataservice getParticipants geht');
    console.log(project._id);
    return this.httpClient.get(`https://localhost:8843/getParticipants/${project._id}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully found Participants for Project');
        return res.partList as string[];
      }).catch((err) => {
        console.log(err);
        return [];
      });
  }

  deleteParticipant(participant: string) {
    console.log('dataservice deleteProject geht');
    console.log(participant);
    return this.httpClient.delete(`https://localhost:8843/deleteParticipant/${participant}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully deleted Participant of Project');
        this.participantlistChangedEmitter.emit();
      }).catch((err) => {
        console.log('Delete not successful: ' + err);
      });
  }

  getRights(participant): Promise<string> {
    console.log('dataservice getRights geht');
    console.log(participant);
    return this.httpClient.get(`https://localhost:8843/getRights/${participant}`, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully retrieved rights of ' + participant);
        console.log(res.rights);
        return res.rights as string;
      }).catch((err) => {
        console.log(err);
        return '';
      });
  }

  changeRights(participant, rights) {
    console.log('dataservice changeRights geht');
    console.log(participant);
    return this.httpClient.put(`https://localhost:8843/changeRights/${participant}`, {rights}, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('Successfully added Project with Project');
        // this.projectlistChangedEmitter.emit();
      }).catch((err) => {
        console.log(err);
      });
  }


}
