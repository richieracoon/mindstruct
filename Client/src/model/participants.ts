import {projectRights} from './projectRights';

export class Participants {
  public id: string;
  public userID: string;
  public projectID: string;
  public pRights: projectRights;
  public entryDate: Date;

  constructor(id: string, userID: string, projectID: string, pRights: projectRights, entryDate: Date) {
    this.id = id;
    this.userID = userID;
    this.projectID = projectID;
    this.pRights = pRights;
    this.entryDate = entryDate;
  }
}
