import {EventEmitter, Component, Input, OnInit, Output} from '@angular/core';
import {Project} from '../../../../../model/project';

@Component({
  selector: 'app-projectdetail',
  templateUrl: './projectdetail.component.html',
  styleUrls: ['./projectdetail.component.scss']
})
export class ProjectdetailComponent implements OnInit {

  @Input() project: Project;
  @Output() deleteEvent: EventEmitter<Project> = new EventEmitter<Project>();
  @Output() updateEvent: EventEmitter<Project> = new EventEmitter<Project>();
  @Output() openEvent: EventEmitter<Project> = new EventEmitter<Project>();
  hideEdit = true;

  constructor() { }

  ngOnInit() {
  }

  delete() {
    console.log(this.project);
    this.deleteEvent.emit(this.project);
  }

  update(pname: string) {
    console.log(this.project);
    this.updateEvent.emit(this.project);
  }

  open() {
    console.log(this.project);
    this.openEvent.emit(this.project);
  }
}
