"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var mindmap_service_1 = require("./mindmap.service");
describe('MindmapService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(mindmap_service_1.MindmapService);
        expect(service).toBeTruthy();
    });
});
