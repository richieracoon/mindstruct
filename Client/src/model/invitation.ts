export class Invitation{
    public invitationID: string;
    public projectID: string;
    public projectName: string;
    public senderName: string;

    constructor(invitationID: string, projectID: string, projectName: string, senderName: string) {
        this.invitationID = invitationID;
        this.projectID = projectID;
        this.senderName = senderName;
        this.projectName = projectName;
    }
}
