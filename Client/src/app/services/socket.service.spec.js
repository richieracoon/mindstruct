"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var socket_service_1 = require("./socket.service");
describe('SocketService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(socket_service_1.SocketService);
        expect(service).toBeTruthy();
    });
});
