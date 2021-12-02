import {SessionOptions} from 'express-session';

export class Configuration {
    public static sessionOptions: SessionOptions = {
        cookie: {
            maxAge: 1000 * 60 * 5, // 1000ms * 60 (sec) * 5 (min)
        },
        name: 'mindStruct',
        resave: true,
        rolling: true,
        saveUninitialized: true,
        secret: 'Secret',
    };
}
