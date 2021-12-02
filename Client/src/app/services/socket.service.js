"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var SocketService = /** @class */ (function () {
    function SocketService(socket, diagramService) {
        this.socket = socket;
        this.diagramService = diagramService;
        // Connects Socket
        this.socket.connect();
        // Registers User for current Mindmap
        this.emit("register", diagramService.mindmapID);
    }
    SocketService.prototype.update = function (mindmapID) {
        // Send Update Event to Server
        this.socket.emit("update", mindmapID);
    };
    SocketService.prototype.listen = function (eventName) {
        var _this = this;
        return new rxjs_1.Observable(function (subscriber) {
            _this.socket.on(eventName, function (data) {
                subscriber.next(data);
            });
        });
    };
    SocketService.prototype.emit = function (eventName, data) {
        this.socket.emit(eventName, data);
    };
    SocketService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SocketService);
    return SocketService;
}());
exports.SocketService = SocketService;
