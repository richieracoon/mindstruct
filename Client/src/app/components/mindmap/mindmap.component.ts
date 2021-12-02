import {Component, OnInit} from '@angular/core';
import {DiagramService} from '../../services/diagram.service';
import {AuthService} from "../../services/auth.service";
import {MindmapService} from "../../services/mindmap.service";
import {SocketService} from "../../services/socket.service";

@Component({
  selector: 'app-mindmap',
  templateUrl: './mindmap.component.html',
  styleUrls: ['./mindmap.component.scss']
})
export class MindmapComponent implements OnInit {
  // Not selectable Ids of Nodes
  lockedIDs: number[] = [];

  // form
  chosenParentID: string = null;
  isLeaf: boolean;
  label: string;
  nodeColor: string;
  labelColor: string;
  borderColor: string;

  constructor(public diagram: DiagramService, private authService: AuthService, private mindmapService: MindmapService, private socketService: SocketService) {
  }

  ngOnInit() {
    this.authService.checkIfLoggedIn();
    // listen to an socket event
    this.socketService.listen('updated').subscribe(()=>{
      this.mindmapService.syncMindmap(this.diagram.mindmapID);
    });
    this.socketService.listen('lock').subscribe((data: any)=>{
      this.lockedIDs.push(data.id);
    });
    this.socketService.listen('unlock').subscribe((data: any)=>{
      this.unlock(data.id);
    });
    this.nodeColor = '#ffffff';
    this.labelColor = '#000000';
    this.borderColor = '#000000';
  }

  isLocked(id: number):boolean {
    for(const i of this.lockedIDs){
      if(i == id){
        return true;
      }
    }
    return false;
  }

  unlock(id:number){
    let index = 0;
    for(const i of this.lockedIDs){
      if(i == id){
        this.lockedIDs.splice(index, 1);
        break;
      }
      index++;
    }
  }

  add() {
    this.diagram.addKnoten(this.isLeaf, this.label, +this.chosenParentID, this.nodeColor, this.labelColor, this.borderColor);
    //Send data to Database
    this.mindmapService.updateMindmap(this.diagram.serializeMindmap(), this.diagram.mindmapID)
      .then(()=>{ this.socketService.update(this.diagram.mindmapID);});
    // Reset form
    this.label = '';
    this.chosenParentID = null;
    this.isLeaf = false;
  }

  select(id: number) {
    if(!this.isLocked(id)){
      this.socketService.emit('select', {mindmapID: this.diagram.mindmapID, id: id});
      this.diagram.highlightKnoten(id);
      this.label = this.diagram.highlightedLabel;
      this.nodeColor = this.diagram.highlightedNodeColor;
      this.borderColor = this.diagram.highlightedBorderColor;
      this.labelColor = this.diagram.highlightedLabelColor;
    }
  }

  delete() {
    let id = this.diagram.highlightedID;
    this.diagram.deleteKnoten(this.diagram.knoten[this.diagram.highlightedID], this.diagram.highlightedID);
    this.mindmapService.updateMindmap(this.diagram.serializeMindmap(), this.diagram.mindmapID)
      .then(()=>{
      this.socketService.update(this.diagram.mindmapID);
    }).then(()=>{
      // Unlocks Node for other users
      this.socketService.emit("deselect", {mindmapID: this.diagram.mindmapID,id: id});
    });
    this.label = '';
  }

  edit() {
    let id = this.diagram.highlightedID;
    this.diagram.adjustColor(this.nodeColor, this.borderColor, this.labelColor);
    this.diagram.setLabel(this.label);
    this.mindmapService.updateMindmap(this.diagram.serializeMindmap(), this.diagram.mindmapID)
      .then(()=>{
        this.socketService.update(this.diagram.mindmapID);
      }).then(()=>{
      // Unlocks Node for other users
      this.socketService.emit("deselect", {mindmapID: this.diagram.mindmapID,id: id});
    });
    this.label = '';
    this.nodeColor = '#ffffff';
    this.labelColor = '#000000';
    this.borderColor = '#000000';
  }

  cancel(){
    let id = this.diagram.highlightedID;
    this.diagram.resetHighlight();
    // Unlocks Node for other users
    this.socketService.emit('deselect', {mindmapID: this.diagram.mindmapID, id: id});
    this.label = '';
  }
}
