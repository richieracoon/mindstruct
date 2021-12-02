"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Invitation = /** @class */ (function () {
    function Invitation(invitationID, projectID, projectName, senderName) {
        this.invitationID = invitationID;
        this.projectID = projectID;
        this.senderName = senderName;
        this.projectName = projectName;
    }
    return Invitation;
}());
exports.Invitation = Invitation;
