export class Knoten {
  x: number;
  y: number;
  rx: number;
  ry: number;
  color: string;
  border: string;
  borderWidth: number;
  label: string;
  labelColor: string;
  isLeaf = false;
  parent: Knoten = null;
  children: Knoten[] = [];

  constructor(x: number, y: number, r: number, color: string, border: string, borderWidth: number, label: string, labelColor: string) {
    this.x = x;
    this.y = y;
    this.rx = r;
    this.ry = r;
    this.color = color;
    this.border = border;
    this.borderWidth = borderWidth;
    this.label = label;
    this.labelColor = labelColor;
  }

  addParent(parent: Knoten) {
    this.parent = parent;
  }

  addChildren(child: Knoten) {
    this.children.push(child);
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }

  markAsLeaf() {
    this.isLeaf = true;
  }

  adjustWidth(width: number) {
    this.rx = width;
  }
}
