"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var knoten_1 = require("../../model/knoten");
var kante_1 = require("../../model/kante");
var DiagramService = /** @class */ (function () {
    function DiagramService() {
        // diagramm
        this.knoten = [];
        this.kanten = [];
        this.root = null;
        this.height = window.innerHeight * 0.8;
        // highlighted node
        this.highlightedID = -1;
        this.highlightedLabel = '';
        this.highlightedLabelColor = '';
        this.highlightedBorderColor = '';
        this.highlightedNodeColor = '';
        // Current Mindmap-ID
        this.mindmapID = null;
    }
    DiagramService.prototype.addKnoten = function (isLeaf, label, parentID, nodeColor, labelColor, borderColor) {
        var length;
        if (!isLeaf) {
            // root was not yet initialized
            if (this.root === null) {
                length = this.knoten.push(new knoten_1.Knoten(window.innerWidth / 2, 250, 35, nodeColor, borderColor, 3, label, labelColor));
                this.root = this.knoten[0];
                // Calculates and adjusts width of node depending on label length
                this.calcNodeWidth(this.knoten[length - 1], this.knoten[length - 1].label);
            }
            else {
                var rootChildrenCount = this.root.children.length;
                if (rootChildrenCount % 2 !== 0) {
                    // tslint:disable-next-line:max-line-length 75 + (100 * (rootChildrenCount / 2 - 0.5))
                    length = this.knoten.push(new knoten_1.Knoten(this.root.x - (window.innerWidth * 0.15), this.height * 0.2 + (170 * (rootChildrenCount / 2 - 0.5)), 35, nodeColor, borderColor, 3, label, labelColor));
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    length = this.knoten.push(new knoten_1.Knoten(this.root.x + (window.innerWidth * 0.15), this.height * 0.2 + (170 * (rootChildrenCount / 2)), 35, nodeColor, borderColor, 3, label, labelColor));
                }
                if (length >= 2) {
                    this.kanten.push(new kante_1.Kante(this.knoten[0], this.knoten[length - 1], 'black', 2));
                }
                // Adds new node to children of root
                this.root.addChildren(this.knoten[length - 1]);
                // Calculates and adjusts width of node depending on label length
                this.calcNodeWidth(this.knoten[length - 1], this.knoten[length - 1].label);
                // Sets root as parent of new node
                this.knoten[length - 1].parent = this.root;
            }
        }
        else {
            var selectedParent = this.root.children[parentID];
            if (selectedParent.x < this.root.x) {
                // tslint:disable-next-line:max-line-length 0.15
                length = this.knoten.push(new knoten_1.Knoten(selectedParent.x - (window.innerWidth * 0.15), selectedParent.y, 25, nodeColor, borderColor, 3, label, labelColor));
            }
            else {
                // tslint:disable-next-line:max-line-length
                length = this.knoten.push(new knoten_1.Knoten(selectedParent.x + (window.innerWidth * 0.15), selectedParent.y, 25, nodeColor, borderColor, 3, label, labelColor));
            }
            this.kanten.push(new kante_1.Kante(selectedParent, this.knoten[length - 1], 'black', 2));
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
    };
    DiagramService.prototype.calcNodeWidth = function (node, label) {
        var length = label.length;
        if (length < 9) {
            node.adjustWidth(35);
        }
        else {
            // length >= 8
            length = length - 7;
            node.adjustWidth(35 + (5 * length));
        }
    };
    DiagramService.prototype.inspectNode = function (node) {
        console.log(node.label);
        if (node.parent !== null) {
            console.log('parent: ' + node.parent.label);
        }
        else {
            console.log('parent: null');
        }
        console.log('children: ');
        node.children.forEach(function (elem) { return console.log(elem.label); });
        console.log('isLeaf: ' + node.isLeaf);
    };
    DiagramService.prototype.deleteKnoten = function (node, pos) {
        console.log('deleting ' + node.label);
        // node is not a leaf
        if (!node.isLeaf) {
            var children = node.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.deleteKnoten(children[i], -1);
            }
        }
        // remove selected node from knoten
        if (pos !== -1) {
            this.knoten.splice(pos, 1);
        }
        else {
            for (var i = 0; i < this.knoten.length; i++) {
                if (this.knoten[i] === node) {
                    this.knoten.splice(i, 1);
                    break;
                }
            }
        }
        // remove selected node from children of parent
        var parent = node.parent;
        if (parent !== null) {
            for (var i = 0; i < node.parent.children.length; i++) {
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
        }
        else {
            // Adjusts the positions of root children
            this.adjustRootChildrenPosition();
        }
        this.highlightedID = -1;
        this.highlightedLabel = '';
    };
    DiagramService.prototype.removeKanten = function (knoten) {
        var k = [];
        for (var _i = 0, _a = this.kanten; _i < _a.length; _i++) {
            var kante = _a[_i];
            if (kante.knotenB !== knoten && kante.knotenA !== knoten) {
                k.push(kante);
            }
        }
        this.kanten = k;
    };
    DiagramService.prototype.adjustRootChildrenPosition = function () {
        for (var i = 0; i < this.root.children.length; i++) {
            var currentChild = this.root.children[i];
            if (i % 2 !== 0) {
                currentChild.x = this.root.x - (window.innerWidth * 0.15);
                currentChild.y = this.height * 0.2 + (170 * ((i / 2) - 0.5));
            }
            else {
                currentChild.x = this.root.x + (window.innerWidth * 0.15);
                currentChild.y = this.height * 0.2 + (170 * (i / 2));
            }
            if (currentChild.hasChildren()) {
                for (var _i = 0, _a = currentChild.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (currentChild.x < this.root.x) {
                        child.x = currentChild.x - (window.innerWidth * 0.15);
                    }
                    else {
                        child.x = currentChild.x + (window.innerWidth * 0.15);
                    }
                }
                this.adjustChildrenPosition(currentChild);
            }
        }
    };
    DiagramService.prototype.adjustChildrenPosition = function (parent) {
        var childrenCount = parent.children.length;
        if (childrenCount % 2 !== 0) {
            var center = (childrenCount / 2) - 0.5;
            console.log(center);
            for (var i = 0; i < childrenCount; i++) {
                if (i < center) {
                    parent.children[i].y = parent.y - (2.2 * parent.children[i].ry);
                }
                else if (i > center) {
                    parent.children[i].y = parent.y + (2.2 * parent.children[i].ry);
                }
                else {
                    parent.children[i].y = parent.y;
                }
            }
        }
        else {
            if (childrenCount === 2) {
                parent.children[0].y = parent.y - (1.5 * parent.children[0].ry);
                parent.children[1].y = parent.y + (1.5 * parent.children[1].ry);
            }
        }
    };
    DiagramService.prototype.highlightKnoten = function (id) {
        this.highlightedID = id;
        this.highlightedLabel = this.knoten[id].label;
        this.highlightedLabelColor = this.knoten[id].labelColor;
        this.highlightedNodeColor = this.knoten[id].color;
        this.highlightedBorderColor = this.knoten[id].border;
    };
    DiagramService.prototype.resetHighlight = function () {
        this.highlightedID = -1;
        this.highlightedLabel = '';
    };
    DiagramService.prototype.adjustColor = function (nodeColor, borderColor, labelColor) {
        this.knoten[this.highlightedID].color = nodeColor;
        this.knoten[this.highlightedID].border = borderColor;
        this.knoten[this.highlightedID].labelColor = labelColor;
    };
    DiagramService.prototype.setLabel = function (label) {
        this.knoten[this.highlightedID].label = label;
        this.calcNodeWidth(this.knoten[this.highlightedID], label);
        this.highlightedID = -1;
        this.highlightedLabel = '';
    };
    DiagramService.prototype.serizalizeNewMindmap = function (label) {
        return { label: label, color: '#ffffff', border: '#000000', borderWidth: 3, labelColor: '#000000', children: [] };
    };
    DiagramService.prototype.serializeMindmap = function () {
        var mindmap;
        var children = [];
        var grandchildren = [];
        for (var _i = 0, _a = this.root.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (!child.isLeaf) {
                grandchildren = [];
                for (var _b = 0, _c = child.children; _b < _c.length; _b++) {
                    var grandchild = _c[_b];
                    grandchildren.push({ label: grandchild.label, color: grandchild.color, border: grandchild.border, borderWidth: grandchild.borderWidth, labelColor: grandchild.labelColor, children: [] });
                }
            }
            children.push({ label: child.label, color: child.color, border: child.border, borderWidth: child.borderWidth, labelColor: child.labelColor, children: grandchildren });
        }
        mindmap = { label: this.root.label, color: this.root.color, border: this.root.border, borderWidth: this.root.borderWidth, labelColor: this.root.labelColor, children: children };
        console.log(mindmap);
        return mindmap;
    };
    DiagramService.prototype.resetMindmap = function () {
        // diagramm
        this.knoten = [];
        this.kanten = [];
        this.root = null;
    };
    DiagramService.prototype.deserializeMindmap = function (data, mindmapID) {
        this.resetMindmap();
        this.addKnoten(false, data.label, -1, data.color, data.labelColor, data.border);
        var index = 0;
        for (var _i = 0, _a = data.children; _i < _a.length; _i++) {
            var row = _a[_i];
            this.addKnoten(false, row.label, -1, row.color, row.labelColor, row.border);
        }
        for (var _b = 0, _c = data.children; _b < _c.length; _b++) {
            var row = _c[_b];
            if (row.children.length > 0) {
                for (var _d = 0, _e = row.children; _d < _e.length; _d++) {
                    var gc = _e[_d];
                    this.addKnoten(true, gc.label, index, gc.color, gc.labelColor, gc.border);
                }
            }
            index = index + 1;
        }
        this.mindmapID = mindmapID;
    };
    DiagramService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], DiagramService);
    return DiagramService;
}());
exports.DiagramService = DiagramService;
