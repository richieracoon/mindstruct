export class MindmapUser{
    public mindmapID: string;
    public userIDs: string[];

    constructor(mindmapID: string) {
        this.mindmapID = mindmapID;
        this.userIDs = [];
    }
}
