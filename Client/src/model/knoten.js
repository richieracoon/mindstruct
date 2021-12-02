"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Knoten = /** @class */ (function () {
    function Knoten(x, y, r, color, border, borderWidth, label, labelColor) {
        this.isLeaf = false;
        this.parent = null;
        this.children = [];
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
    Knoten.prototype.addParent = function (parent) {
        this.parent = parent;
    };
    Knoten.prototype.addChildren = function (child) {
        this.children.push(child);
    };
    Knoten.prototype.hasChildren = function () {
        return this.children.length > 0;
    };
    Knoten.prototype.markAsLeaf = function () {
        this.isLeaf = true;
    };
    Knoten.prototype.adjustWidth = function (width) {
        this.rx = width;
    };
    return Knoten;
}());
exports.Knoten = Knoten;
