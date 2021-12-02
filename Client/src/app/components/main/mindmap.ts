export class Mindmap {
  public id: string;
  public rootname: string;
  public projectID: string;
  public data: [];
  public creationDate: Date;

  constructor(id: string, rootname: string, projectID: string, data: [], creationDate: Date) {
    this.id = id;
    this.rootname = rootname;
    this.projectID = projectID;
    this.data = data;
    this.creationDate = creationDate;
  }
}
