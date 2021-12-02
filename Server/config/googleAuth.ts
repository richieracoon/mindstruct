interface iAuth {
    callbackURL: string;
}

export interface iGoogleAuth extends iAuth {
    clientID: string,
    clientSecret: string;
}
