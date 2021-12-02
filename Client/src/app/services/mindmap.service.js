"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var mindmap_1 = require("../../model/mindmap");
var httpOptions = {
    headers: new http_1.HttpHeaders({ 'Content-Type': 'application/json' }),
    crossDomain: true,
    xhrFields: { withCredentials: true }
};
var MindmapService = /** @class */ (function () {
    function MindmapService(httpClient, diagramService, router) {
        this.httpClient = httpClient;
        this.diagramService = diagramService;
        this.router = router;
        this.mindmaps = [];
    }
    MindmapService.prototype.createMindmap = function (rootname, projectID) {
        var data = this.diagramService.serizalizeNewMindmap(rootname);
        return this.httpClient.post('https://localhost:8843/createMindmap', { rootname: rootname, projectID: projectID, data: data }, httpOptions)
            .toPromise()
            .then(function (res) {
            console.log('Successful created Mindmap!');
        }).catch(function (err) {
            // Registration not successful
        });
    };
    MindmapService.prototype.getMindmaps = function (projectId) {
        var _this = this;
        this.mindmaps = [];
        return this.httpClient.get("https://localhost:8843/getMindmaps/" + projectId, httpOptions)
            .toPromise()
            .then(function (res) {
            for (var _i = 0, _a = res.mindmaps; _i < _a.length; _i++) {
                var row = _a[_i];
                _this.mindmaps.push(new mindmap_1.Mindmap(row.id, row.name, row.data));
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    MindmapService.prototype.editMindmap = function (mindmapId, rootname) {
        return this.httpClient.put("https://localhost:8843/editMindmap/" + mindmapId, { rootname: rootname }, httpOptions)
            .toPromise()
            .then(function (res) {
            console.log('Successful edit!');
        }).catch(function (err) {
            console.log('Edit not successful: ' + err);
        });
    };
    MindmapService.prototype.deleteMindmap = function (mindmapId) {
        return this.httpClient.delete("https://localhost:8843/deleteMindmap/" + mindmapId, httpOptions)
            .toPromise()
            .then(function (res) {
            console.log('Successfully deleted mindmap!');
        }).catch(function (err) {
            console.log(err);
        });
    };
    MindmapService.prototype.loadMindmap = function (data, mindmapId) {
        this.diagramService.deserializeMindmap(data, mindmapId);
        this.router.navigate(['/mindmap']);
    };
    MindmapService.prototype.updateMindmap = function (data, mindmapId) {
        return this.httpClient.put("https://localhost:8843/updateMindmap/" + mindmapId, { data: data }, httpOptions)
            .toPromise()
            .then(function (res) {
            console.log('Successful update mindmap data!');
        }).catch(function (err) {
            console.log('Update not successful: ' + err);
        });
    };
    MindmapService.prototype.syncMindmap = function (mindmapId) {
        var _this = this;
        return this.httpClient.get("https://localhost:8843/syncMindmap/" + mindmapId, httpOptions)
            .toPromise()
            .then(function (res) {
            _this.diagramService.deserializeMindmap(res.data, mindmapId);
        }).catch(function (err) {
            console.log(err);
        });
    };
    MindmapService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], MindmapService);
    return MindmapService;
}());
exports.MindmapService = MindmapService;
