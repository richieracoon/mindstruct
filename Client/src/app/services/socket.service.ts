import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Observable} from "rxjs";
import {DiagramService} from "./diagram.service";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket, private diagramService: DiagramService) {
    // Connects Socket
    this.socket.connect();
    // Registers User for current Mindmap
    this.emit("register", diagramService.mindmapID);
  }

  update(mindmapID: string){
    // Send Update Event to Server
    this.socket.emit("update", mindmapID);
  }

  listen(eventName: string){
    return new Observable(subscriber => {
      this.socket.on(eventName, (data)=>{
        subscriber.next(data);
     });
    });
  }

  emit(eventName: string, data:any){
    this.socket.emit(eventName, data);
  }
}
