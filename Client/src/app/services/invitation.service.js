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
var invitation_1 = require("../../model/invitation");
var httpOptions = {
    headers: new http_1.HttpHeaders({ 'Content-Type': 'application/json' }),
    crossDomain: true,
    xhrFields: { withCredentials: true }
};
var InvitationService = /** @class */ (function () {
    function InvitationService(httpClient) {
        this.httpClient = httpClient;
        this.invitations = [];
    }
    InvitationService.prototype.createInvitation = function (projectID, senderID, username) {
        return this.httpClient.post('https://localhost:8843/invite', { username: username, senderID: senderID, projectID: projectID }, httpOptions)
            .toPromise()
            .then(function (res) {
            console.log('Created new Invitation!');
        }).catch(function (err) {
            // Login not successful
        });
    };
    InvitationService.prototype.retrieveInvitations = function (userId) {
        var _this = this;
        this.invitations = [];
        return this.httpClient.get("https://localhost:8843/getInvites/" + userId, httpOptions)
            .toPromise()
            .then(function (res) {
            for (var _i = 0, _a = res.invites; _i < _a.length; _i++) {
                var row = _a[_i];
                _this.invitations.push(new invitation_1.Invitation(row.invitationID, row.projectID, row.projectName, row.senderName));
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    InvitationService.prototype.answerInvitation = function (invitationId) {
        return this.httpClient.delete("https://localhost:8843/answerInvite/" + invitationId, httpOptions)
            .toPromise()
            .then(function (res) {
            console.log('Successful answered and deleted pending invitation!');
        }).catch(function (err) {
            console.log(err);
        });
    };
    InvitationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], InvitationService);
    return InvitationService;
}());
exports.InvitationService = InvitationService;
