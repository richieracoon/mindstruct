import { Injectable } from '@angular/core';
import {Knoten} from '../../model/knoten';
import {Kante} from '../../model/kante';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {

  // diagramm
  knoten: Knoten[] = [];
  kanten: Kante[] = [];
  root: Knoten = null;
  height = window.innerHeight * 0.8;

  // highlighted node
  highlightedID = -1;
  highlightedLabel = '';
  highlightedLabelColor = '';
  highlightedBorderColor = '';
  highlightedNodeColor = '';

  // Current Mindmap-ID
  mindmapID = null;
  constructor() { }

  public addKnoten(isLeaf: boolean, label: string, parentID: number, nodeColor: string, labelColor: string, borderColor: string) {
    let length: number;
    if (!isLeaf) {
      // root was not yet initialized
      if (this.root === null) {
        length = this.knoten.push(new Knoten(window.innerWidth / 2, 250, 35, nodeColor, borderColor, 3, label, labelColor));
        this.root = this.knoten[0];
        // Calculates and adjusts width of node depending on label length
        this.calcNodeWidth(this.knoten[length - 1], this.knoten[length - 1].label);
      } else {
        const rootChildrenCount = this.root.children.length;
        if (rootChildrenCount % 2 !== 0) {
          // tslint:disable-next-line:max-line-length 75 + (100 * (rootChildrenCount / 2 - 0.5))
          length = this.knoten.push(new Knoten(this.root.x - (window.innerWidth * 0.15), this.height * 0.2 + (170 * (rootChildrenCount / 2 - 0.5)), 35, nodeColor, borderColor, 3, label, labelColor));
        } else {
          // tslint:disable-next-line:max-line-length
          length = this.knoten.push(new Knoten(this.root.x + (window.innerWidth * 0.15), this.height * 0.2 + (170 * (rootChildrenCount / 2)), 35, nodeColor, borderColor, 3, label, labelColor));
        }
        if (length >= 2) {
          this.kanten.push(new Kante(this.knoten[0], this.knoten[length - 1], 'black', 2));
        }
        // Adds new node to children of root
        this.root.addChildren(this.knoten[length - 1]);
        // Calculates and adjusts width of node depending on label length
        this.calcNodeWidth(this.knoten[length - 1], this.knoten[length - 1].label);
        // Sets root as parent of new node
        this.knoten[length - 1].parent = this.root;
      }
    } else {
      const selectedParent = this.root.children[parentID];
      if (selectedParent.x < this.root.x) {
        // tslint:disable-next-line:max-line-length 0.15
        length = this.knoten.push(new Knoten(selectedParent.x - (window.innerWidth * 0.15), selectedParent.y , 25, nodeColor, borderColor, 3, label, labelColor));
      } else {
        // tslint:disable-next-line:max-line-length
        length = this.knoten.push(new Knoten(selectedParent.x + (window.innerWidth * 0.15), selectedParent.y , 25, nodeColor, borderColor, 3, label, labelColor));
      }
      this.kanten.push(new Kante(selectedParent, this.knoten[length - 1], 'black', 2));
      // Mark new node as leaf
      this.knoten[length - 1].markAsLeaf();
      // Adds new node to children of selected node
      selectedParent.addChildren(this.knoten[length - 1]);
      // Calculates and adjusts width of node depending on label length
      this.calcNodeWidth(this.knoten[length - 1], this.knoten[length - 1].label);
      // Sets root as parent of new node
      this.knoten[length - 1].parent = selectedParent;
      // Adjusts position of childs
      this.adjustChildrenPosition(selectedParent);
    }
  }

  public calcNodeWidth(node: Knoten, label: string) {
    let length = label.length;
    if (length < 9) {
      node.adjustWidth(35);
    } else {
      // length >= 8
      length = length - 7;
      node.adjustWidth(35 + (5 * length));
    }
  }

  public inspectNode(node: Knoten) {
    console.log(node.label);
    if (node.parent !== null) {
      console.log('parent: ' + node.parent.label);
    } else {
      console.log('parent: null');
    }
    console.log('children: ');
    node.children.forEach(elem => console.log(elem.label));
    console.log('isLeaf: ' + node.isLeaf);
  }

  public deleteKnoten(node: Knoten, pos: number) {
    console.log('deleting ' + node.label);
    // node is not a leaf
    if (!node.isLeaf) {
      const children = node.children;
      for (let i = children.length - 1; i >= 0; i--) {
        this.deleteKnoten(children[i], -1);
      }
    }
    // remove selected node from knoten
    if (pos !== -1) {
      this.knoten.splice(pos, 1);
    } else {
      for (let i = 0; i < this.knoten.length; i++) {
        if (this.knoten[i] === node) {
          this.knoten.splice(i, 1);
          break;
        }
      }
    }
    // remove selected node from children of parent
    const parent = node.parent;
    if (parent !== null) {
      for (let i = 0; i < node.parent.children.length; i++) {
        if (parent.children[i] === node) {
          parent.children.splice(i, 1);
          break;
        }
      }
    }
    this.removeKanten(node);
    // checks if node is root
    if (node === this.root) {
      this.root = null;
    } else {
      // Adjusts the positions of root children
      this.adjustRootChildrenPosition();
    }
    this.highlightedID = -1;
    this.highlightedLabel = '';
  }

  removeKanten(knoten: Knoten) {
    const k: Kante[] = [];
    for (const kante of this.kanten) {
      if (kante.knotenB !== knoten && kante.knotenA !== knoten) {
        k.push(kante);
      }
    }
    this.kanten = k;
  }

  private adjustRootChildrenPosition() {
    for (let i = 0; i < this.root.children.length; i++) {
      const currentChild = this.root.children[i];
      if (i % 2 !== 0) {
        currentChild.x = this.root.x - (window.innerWidth * 0.15);
        currentChild.y = this.height * 0.2 + (170 * ((i / 2) - 0.5));
      } else {
        currentChild.x = this.root.x + (window.innerWidth * 0.15);
        currentChild.y = this.height * 0.2 + (170 * (i / 2));
      }
      if (currentChild.hasChildren()) {
        for (const child of currentChild.children) {
          if (currentChild.x < this.root.x) {
            child.x = currentChild.x - (window.innerWidth * 0.15);
          } else {
            child.x = currentChild.x + (window.innerWidth * 0.15);
          }
        }
        this.adjustChildrenPosition(currentChild);
      }
    }
  }

  private adjustChildrenPosition(parent: Knoten) {
    const childrenCount = parent.children.length;

    if (childrenCount % 2 !== 0) {
      const center = (childrenCount / 2) - 0.5;
      console.log(center);
      for (let i = 0; i < childrenCount; i++) {
        if (i < center) {
          parent.children[i].y =  parent.y - (2.2 * parent.children[i].ry);
        } else if ( i > center ) {
          parent.children[i].y =  parent.y + (2.2 * parent.children[i].ry);
        } else {
          parent.children[i].y = parent.y;
        }
      }
    } else {
      if (childrenCount === 2) {
        parent.children[0].y = parent.y - (1.5 * parent.children[0].ry);
        parent.children[1].y = parent.y +  (1.5 * parent.children[1].ry);
      }
    }
  }

  public highlightKnoten(id: number) {
    this.highlightedID = id;
    this.highlightedLabel = this.knoten[id].label;
    this.highlightedLabelColor = this.knoten[id].labelColor;
    this.highlightedNodeColor = this.knoten[id].color;
    this.highlightedBorderColor = this.knoten[id].border;
  }

  public resetHighlight() {
    this.highlightedID = -1;
    this.highlightedLabel = '';
  }

  public adjustColor(nodeColor: string, borderColor: string, labelColor: string) {
    this.knoten[this.highlightedID].color = nodeColor;
    this.knoten[this.highlightedID].border = borderColor;
    this.knoten[this.highlightedID].labelColor = labelColor;
  }

  public setLabel(label: string) {
    this.knoten[this.highlightedID].label = label;
    this.calcNodeWidth(this.knoten[this.highlightedID], label);
    this.highlightedID = -1;
    this.highlightedLabel = '';
  }

  public serizalizeNewMindmap(label: string): Object{
    return {label: label, color: '#ffffff', border: '#000000', borderWidth: 3, labelColor: '#000000', children: []};
  }

  public serializeMindmap(){
    let mindmap: Object;
    let children: {label: string, color: string, border: string, borderWidth: number, labelColor: string, children: Object[]}[] = [];
    let grandchildren: {label: string, color: string, border: string, borderWidth: number, labelColor: string, children: Object[]}[] = [];
    for(const child of this.root.children){
      if(!child.isLeaf){
        grandchildren = [];
        for(const grandchild of child.children){
          grandchildren.push({label: grandchild.label, color: grandchild.color, border: grandchild.border, borderWidth: grandchild.borderWidth, labelColor: grandchild.labelColor ,children: []});
        }
      }
      children.push({label: child.label, color: child.color, border: child.border, borderWidth: child.borderWidth, labelColor: child.labelColor ,children: grandchildren});
    }
    mindmap = {label: this.root.label, color: this.root.color, border: this.root.border, borderWidth: this.root.borderWidth, labelColor: this.root.labelColor, children: children};
    console.log(mindmap);
    return mindmap;
  }

  private resetMindmap(){
    // diagramm
    this.knoten = [];
    this.kanten = [];
    this.root = null;
  }

  public deserializeMindmap(data, mindmapID: string){
    this.resetMindmap();
    this.addKnoten(false, data.label, -1, data.color, data.labelColor, data.border);
    let index = 0;
    for(const row of data.children){
        this.addKnoten(false, row.label, -1, row.color, row.labelColor, row.border);
    }
    for(const row of data.children){
      if(row.children.length>0){
        for(const gc of row.children){
          this.addKnoten(true, gc.label, index, gc.color, gc.labelColor, gc.border);
        }
      }
      index = index + 1;
    }
    this.mindmapID = mindmapID;
  }
}
