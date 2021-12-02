"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var invitation_service_1 = require("./invitation.service");
describe('InvitationService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(invitation_service_1.InvitationService);
        expect(service).toBeTruthy();
    });
});
