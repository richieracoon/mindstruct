import {Rights} from './rights';

export class User {
    public id: string;
    public username: string;
    public email: string;
    public rights: Rights;
    public password: string;
    public isGoogle: boolean;

    constructor(id: string, username: string, email: string, password: string, rights: Rights, isGoogle: boolean) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.rights = rights;
        this.isGoogle = isGoogle;
    }
}
