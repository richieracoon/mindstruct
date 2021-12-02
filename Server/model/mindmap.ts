export class Mindmap{
  public id: string;
  public name: string;
  public data: Object;

  constructor(id: string, name: string, data:Object) {
    this.id = id;
    this.name = name;
    this.data = data;
  }
}
