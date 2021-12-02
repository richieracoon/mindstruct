import {iGoogleAuth} from './googleAuth';

export class authConfig{

    // skeleton template file for googleAuth.ts. Copy & save it as a TypeScript-file "authConfig.ts" & don't forget to compile it to Javascript.
    // Set 'clientSecret' and 'clientID' to the Google-Developer values after registering your app at: https://console.developers.google.com/
    // this comment can be deleted after copying & saving the file.
    static googleAuth: iGoogleAuth = {
        clientID: '849234261086-3t4p3p26hf3lcmv0n0gk7l7oqvnuqbuk.apps.googleusercontent.com',
        clientSecret: 'lM9-y5vMu4tbw3dBDjdMtA17',
        callbackURL: 'https://localhost:8843/auth/google/callback'
    };
};
