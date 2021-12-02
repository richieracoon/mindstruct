export class Project {
  // tslint:disable-next-line:variable-name
  public _id: string;
  public pname: string;
  public creationDate: Date;

  // tslint:disable-next-line:variable-name
  constructor(_id: string, pname: string, creationDate: Date) {
    this._id = _id;
    this.pname = pname;
    this.creationDate = creationDate;
  }
}
