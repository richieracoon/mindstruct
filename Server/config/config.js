"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration = /** @class */ (function () {
    function Configuration() {
    }
    Configuration.sessionOptions = {
        cookie: {
            maxAge: 1000 * 60 * 5,
        },
        name: 'mindStruct',
        resave: true,
        rolling: true,
        saveUninitialized: true,
        secret: 'Secret',
    };
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=config.js.map