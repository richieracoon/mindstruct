"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("Express");
var session = require("express-session");
var config_1 = require("../config/config");
var mongodb_1 = require("mongodb");
var fs = require("fs");
var https = require("https");
var path = require("path");
var passport = require("passport");
var pGoogle = require("passport-google-oauth20");
var rights_1 = require("../model/rights");
var user_1 = require("../model/user");
var authConfig_1 = require("../config/authConfig");
var mongodb_2 = require("mongodb");
var invitation_1 = require("../model/invitation");
var project_1 = require("../../Client/src/model/project");
var mindmap_1 = require("../model/mindmap");
var socket = require("socket.io");
// Worked on Mindmaps
var currentUsers = [];
// Define App and db connection
var app = express();
var client;
var db;
// Configure Web-App
app.use(express.json());
app.use(session(config_1.Configuration.sessionOptions));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
// used to serialize user
passport.serializeUser(function (profile, done) {
    done(null, profile);
});
// used to deserialize user
passport.deserializeUser(function (profile, done) {
    done(null, profile);
});
// SSL-Certificate and Key
var privateKey = fs.readFileSync(path.join(__dirname, '../ssl/cert/localhost.key'), 'utf-8');
var certificate = fs.readFileSync(path.join(__dirname, '../ssl/cert/localhost.crt'), 'utf-8');
var credentials = { key: privateKey, cert: certificate };
// Google Strategy settings
var GoogleStrategy = pGoogle.Strategy;
passport.use(new GoogleStrategy({
    clientID: authConfig_1.authConfig.googleAuth.clientID,
    clientSecret: authConfig_1.authConfig.googleAuth.clientSecret,
    callbackURL: authConfig_1.authConfig.googleAuth.callbackURL,
    passReqToCallback: true
}, function (accessToken, refreshToken, params, profile, done) {
    var _this = this;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, user, user_2, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    query = { username: profile.displayName };
                    return [4 /*yield*/, db.collection("User").findOne(query)];
                case 1:
                    user = _a.sent();
                    if (!(user == null)) return [3 /*break*/, 3];
                    user_2 = {
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        password: '1234',
                        isGoogle: true,
                        rights: rights_1.Rights.User
                    };
                    return [4 /*yield*/, db.collection('User').insertOne(user_2)];
                case 2:
                    result = _a.sent();
                    // Successfull insertion
                    if (result.insertedCount != 0) {
                        console.log("Successfully added " + result.insertedCount + " User: " + result.insertedId);
                    }
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log("Database Request failed: " + err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); })();
    done(null, profile);
}));
// Start Server and connect to Database
var server = https.createServer(credentials, app).listen(8843, function () {
    console.log('Server startet: https://localhost:8843');
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mongodb_1.MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true })];
                case 1:
                    client = _a.sent();
                    db = client.db("MindStruct");
                    console.log('Connected to MongoDB...');
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.error('Error connecting to MongoDB: ' + err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Socket
var io = socket.listen(server);
io.on('connection', function (socket) {
    console.log("Socket-Connection with: " + socket.id);
    socket.on("register", function (data) {
        socket.join(data);
    });
    socket.on('update', function (data) {
        io.to(data).emit('updated');
    });
    socket.on('disconnect', function () {
        console.log("User with Socket-ID " + socket.id + " disconnected!");
    });
    socket.on('select', function (data) {
        io.to(data.mindmapID).emit('lock', { id: data.id });
    });
    socket.on('deselect', function (data) {
        io.to(data.mindmapID).emit('unlock', { id: data.id });
    });
});
// Middleware routes for session management
function isLoggedIn() {
    return function (req, res, next) {
        if (req.user || req.session.user) {
            next();
        }
        else {
            res.status(401).send({
                message: 'Session expired. Please log in again!',
            });
        }
    };
}
function isPrivileged(rights) {
    return function (req, res, next) {
        if (rights > Number(req.session.user.rights)) {
            res.status(403).send({
                message: 'You are not allowed to do that',
            });
        }
        else {
            next();
        }
    };
}
// Google Route for Authentication
app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
// Callback after Google Authentication
app.get("/auth/google/callback", passport.authenticate('google', {
    successRedirect: "/loggedin",
    failureRedirect: "/"
}));
// Is logged in
app.get('/login', isLoggedIn(), function (req, res) {
    if (!req.session.user && req.user) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var query, data, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = { username: req.user.displayName };
                        return [4 /*yield*/, db.collection("User").findOne(query)];
                    case 1:
                        data = _a.sent();
                        if (data != null) {
                            req.session.user = data;
                            res.status(200).send({
                                message: 'Successfully accessed User',
                                user: data,
                            });
                        }
                        else {
                            res.status(404).send({
                                message: 'User not found',
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        res.status(500).send({
                            message: 'Database request failed: ' + err_3,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    }
    else {
        res.status(200).send({
            message: 'User still logged in',
            user: req.session.user,
        });
    }
});
// Login-Request
app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, user, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { username: username, password: password };
                    return [4 /*yield*/, db.collection('User').findOne(query)];
                case 1:
                    user = _a.sent();
                    // Successfull login
                    if (user != null) {
                        if (user.isGoogle) {
                            res.status(401).send({
                                message: 'Please login with Google',
                            });
                        }
                        req.session.user = user;
                        res.status(200).send({
                            message: 'Successfully logged in',
                            user: user,
                        });
                    }
                    else {
                        res.status(401).send({
                            message: 'Username or Password is incorrect',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_4,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
//Logout
app.post('/logout', isLoggedIn(), function (req, res) {
    if (req.user) {
        req.logOut();
    }
    delete req.session.user;
    res.status(200).send({
        message: "Successfully logged out",
    });
});
//Register
app.post('/registration', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, user, user_3, result, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    query = { $or: [{ username: username }, { email: email }] };
                    return [4 /*yield*/, db.collection('User').findOne(query)];
                case 1:
                    user = _a.sent();
                    if (!(user == null)) return [3 /*break*/, 3];
                    user_3 = {
                        username: username,
                        email: email,
                        password: password,
                        isGoogle: false,
                        rights: rights_1.Rights.User
                    };
                    return [4 /*yield*/, db.collection('User').insertOne(user_3)];
                case 2:
                    result = _a.sent();
                    // Successful insertion
                    if (result.insertedCount != 0) {
                        console.log("Registered new User: " + username);
                        res.status(201).send({
                            message: 'Successfully registered new Account',
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    res.status(406).send({
                        message: 'Username or E-Mail are already in use',
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_5 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_5,
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); })();
});
//Edit User
app.put('/user/:userId', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var userID = String(req.params.userId);
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    if (userID === req.session.user._id.toString()) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var query, user, data, result, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        query = { username: username };
                        user = null;
                        if (!(req.session.user.username !== username)) return [3 /*break*/, 2];
                        return [4 /*yield*/, db.collection("User").findOne(query)];
                    case 1:
                        user = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(user == null)) return [3 /*break*/, 4];
                        query = { _id: new mongodb_2.ObjectID(userID) };
                        data = { username: username, email: email, password: password };
                        return [4 /*yield*/, db.collection("User").updateOne(query, { $set: data })];
                    case 3:
                        result = _a.sent();
                        if (result.modifiedCount != 0) {
                            res.status(200).send({
                                message: 'Successfully updated User',
                            });
                        }
                        else {
                            res.status(401).send({
                                message: 'User could not be found',
                            });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        res.status(409).send({
                            message: 'Username already exists',
                        });
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_6 = _a.sent();
                        res.status(500).send({
                            message: 'Database request failed: ' + err_6,
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); })();
    }
});
//Edit User as Admin
app.put('/edit/:userId', isLoggedIn(), isPrivileged(rights_1.Rights.Admin), function (req, res) {
    var userID = String(req.params.userId);
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, user, data, result, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    query = { _id: new mongodb_2.ObjectID(userID) };
                    return [4 /*yield*/, db.collection("User").findOne(query)];
                case 1:
                    user = _a.sent();
                    if (!(user.username == username)) return [3 /*break*/, 3];
                    data = { username: username, email: email, password: password };
                    return [4 /*yield*/, db.collection("User").updateOne(query, { $set: data })];
                case 2:
                    result = _a.sent();
                    if (result.modifiedCount != 0) {
                        res.status(200).send({
                            message: 'Successfully updated User',
                        });
                    }
                    else {
                        res.status(401).send({
                            message: 'User could not be found',
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    res.status(409).send({
                        message: 'Username already exists',
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_7 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_7,
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); })();
});
//Delete User as Admin
app.delete('/delete/:userId', isLoggedIn(), isPrivileged(rights_1.Rights.Admin), function (req, res) {
    var userID = String(req.params.userId);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, result, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_2.ObjectID(userID) };
                    return [4 /*yield*/, db.collection("User").deleteOne(query)];
                case 1:
                    result = _a.sent();
                    if (result.deletedCount > 0) {
                        res.status(200).send({
                            message: 'Successfully deleted User',
                        });
                    }
                    else {
                        res.status(404).send({
                            message: 'User not found',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_8 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_8,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Get all Users as Admin
app.get('/getUsers', isLoggedIn(), isPrivileged(rights_1.Rights.Admin), function (req, res) {
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, users, _i, data_1, row, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = {};
                    return [4 /*yield*/, db.collection("User").find(query).toArray()];
                case 1:
                    data = _a.sent();
                    users = [];
                    if (data.length > 0) {
                        for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                            row = data_1[_i];
                            users.push(new user_1.User(row._id.toString(), row.username, row.email, row.password, row.rights, row.isGoogle));
                        }
                        res.status(200).send({
                            message: 'Successfully accessed Users',
                            users: users,
                        });
                    }
                    else {
                        res.status(404).send({
                            message: 'No Users found',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_9 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_9,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Get a User as Admin
app.get('/getUser/:userId', isLoggedIn(), isPrivileged(rights_1.Rights.Admin), function (req, res) {
    var userID = String(req.params.userId);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, user, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_2.ObjectID(userID) };
                    return [4 /*yield*/, db.collection("User").findOne(query)];
                case 1:
                    data = _a.sent();
                    user = new user_1.User(data._id.toString(), data.username, data.email, data.password, data.rights, data.isGoogle);
                    if (user != null) {
                        res.status(200).send({
                            message: 'Successfully accessed User',
                            user: user,
                        });
                    }
                    else {
                        res.status(404).send({
                            message: 'User not found',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_10 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_10,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Get a User as Admin
app.get('/getUsername/:username', isLoggedIn(), isPrivileged(rights_1.Rights.Admin), function (req, res) {
    console.log("hi");
    var username = String(req.params.username);
    console.log("username");
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, user, err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { username: (username) };
                    console.log(query);
                    return [4 /*yield*/, db.collection("User").findOne(query)];
                case 1:
                    data = _a.sent();
                    user = new user_1.User(data._id.toString(), data.username, data.email, data.password, data.rights, data.isGoogle);
                    if (user != null) {
                        res.status(200).send({
                            message: 'Successfully accessed User',
                            user: user,
                        });
                    }
                    else {
                        res.status(404).send({
                            message: 'User not found',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_11 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_11,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
//Add project as User
app.post('/addProject', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var pname = req.body.pname.trim();
    var userID = req.session.user._id.toString();
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var project, result, projectID, participation, result_1, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    if (!(pname !== null)) return [3 /*break*/, 4];
                    project = {
                        pname: pname,
                        creationDate: new Date()
                    };
                    return [4 /*yield*/, db.collection('Projects').insertOne(project)];
                case 1:
                    result = _a.sent();
                    projectID = result.insertedId.toString();
                    if (!(result.insertedCount != 0)) return [3 /*break*/, 3];
                    participation = {
                        userID: userID,
                        projectID: projectID,
                        pRights: 0,
                        entryDate: new Date()
                    };
                    console.log(participation);
                    return [4 /*yield*/, db.collection('Participants').insertOne(participation)];
                case 2:
                    result_1 = _a.sent();
                    console.log("Registered new Project: " + pname);
                    res.status(201).send({
                        message: 'Successfully registered new Project' + pname,
                    });
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    res.status(500).send({
                        message: 'Projectname is invalid',
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_12 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_12,
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); })();
});
// Get all Projects as User
app.get('/getProjects', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    console.log("getprojects geht");
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var userID, query, options, participations, projectList, query2, project, _i, participations_1, participation, pid, err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    userID = req.session.user._id;
                    query = { userID: userID.toString() };
                    options = { projection: { projectID: 1, _id: 0 } };
                    return [4 /*yield*/, db.collection("Participants").find(query, options).toArray()];
                case 1:
                    participations = _a.sent();
                    console.log(participations);
                    projectList = [];
                    query2 = void 0;
                    project = void 0;
                    if (!(participations.length > 0)) return [3 /*break*/, 6];
                    _i = 0, participations_1 = participations;
                    _a.label = 2;
                case 2:
                    if (!(_i < participations_1.length)) return [3 /*break*/, 5];
                    participation = participations_1[_i];
                    pid = new mongodb_2.ObjectID(participation.projectID);
                    query2 = { _id: pid };
                    console.log(query2);
                    return [4 /*yield*/, db.collection("Projects").findOne(query2)];
                case 3:
                    project = _a.sent();
                    projectList.push(new project_1.Project(project._id.toString(), project.pname, project.creationDate));
                    console.log(projectList);
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    res.status(200).send({
                        message: 'Successfully retrieved userprojects',
                        projectList: projectList,
                    });
                    return [3 /*break*/, 7];
                case 6:
                    res.status(404).send({
                        message: 'User does not participate in projects',
                    });
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_13 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_13,
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); })();
});
// Get all Projects as Admin
app.post('/getUserProjects', isLoggedIn(), isPrivileged(rights_1.Rights.Admin), function (req, res) {
    var user = req.body.user;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var userID, query, options, participations, projectList, query2, project, _i, participations_2, participation, pid, err_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    userID = user.id;
                    query = { userID: userID.toString() };
                    options = { projection: { projectID: 1, _id: 0 } };
                    return [4 /*yield*/, db.collection("Participants").find(query, options).toArray()];
                case 1:
                    participations = _a.sent();
                    projectList = [];
                    query2 = void 0;
                    project = void 0;
                    if (!(participations.length > 0)) return [3 /*break*/, 6];
                    _i = 0, participations_2 = participations;
                    _a.label = 2;
                case 2:
                    if (!(_i < participations_2.length)) return [3 /*break*/, 5];
                    participation = participations_2[_i];
                    pid = new mongodb_1.ObjectId(participation.projectID);
                    query2 = { _id: pid };
                    return [4 /*yield*/, db.collection("Projects").findOne(query2)];
                case 3:
                    project = _a.sent();
                    projectList.push(new project_1.Project(project._id.toString(), project.pname, project.creationDate));
                    console.log(projectList);
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    res.status(200).send({
                        message: 'Successfully retrieved userprojects',
                        pList: projectList,
                    });
                    return [3 /*break*/, 7];
                case 6:
                    res.status(404).send({
                        message: 'User does not participate in projects',
                    });
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_14 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_14,
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); })();
});
//Edit Project
app.put('/editProject/:projectID', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var projectID = String(req.params.projectID);
    var pname = req.body.pname.trim();
    console.log(projectID);
    console.log(pname);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, result, err_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!(pname !== "")) return [3 /*break*/, 2];
                    query = { _id: new mongodb_1.ObjectId(projectID) };
                    data = { pname: pname };
                    return [4 /*yield*/, db.collection("Projects").updateOne(query, { $set: data })];
                case 1:
                    result = _a.sent();
                    if (result.modifiedCount != 0) {
                        console.log('Successfully change Project to name' + pname);
                        res.status(200).send({
                            message: 'Successfully change Project to name' + pname,
                        });
                    }
                    else {
                        res.status(401).send({
                            message: 'Project could not be found',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    res.status(500).send({
                        message: 'Projectname is invalid',
                    });
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_15 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_15,
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); })();
});
//Delete User as Admin
app.delete('/deleteProject/:projectID', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var projectID = String(req.params.projectID);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, result, query_1, result_2, err_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    query = { _id: new mongodb_2.ObjectID(projectID) };
                    return [4 /*yield*/, db.collection("Projects").deleteOne(query)];
                case 1:
                    result = _a.sent();
                    if (!(result.deletedCount > 0)) return [3 /*break*/, 3];
                    query_1 = { projectID: projectID };
                    return [4 /*yield*/, db.collection("Participants").deleteMany(query_1)];
                case 2:
                    result_2 = _a.sent();
                    console.log('Successfully deleted Project' + projectID);
                    res.status(200).send({
                        message: 'Successfully deleted Project',
                    });
                    return [3 /*break*/, 4];
                case 3:
                    res.status(404).send({
                        message: 'Project not found',
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_16 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_16,
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); })();
});
// Creates an invitation to a project
app.post('/invite', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var username = req.body.username;
    var senderID = req.body.senderID;
    var projectID = req.body.projectID;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, userID, invitation, result, err_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    query = { username: username };
                    return [4 /*yield*/, db.collection('User').findOne(query)];
                case 1:
                    data = _a.sent();
                    if (!(data != null)) return [3 /*break*/, 6];
                    userID = data._id.toString();
                    invitation = {
                        projectID: projectID,
                        senderID: senderID,
                        receiverID: userID
                    };
                    return [4 /*yield*/, db.collection('Invitation').findOne(invitation)];
                case 2:
                    data = _a.sent();
                    if (!(data != null)) return [3 /*break*/, 3];
                    res.status(404).send({
                        message: 'User was already invited to Project',
                    });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, db.collection('Invitation').insertOne(invitation)];
                case 4:
                    result = _a.sent();
                    // Successful insertion
                    if (result.insertedCount != 0) {
                        res.status(201).send({
                            message: 'Successfully created new Invitation',
                        });
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    res.status(404).send({
                        message: 'User not found with Username ' + username,
                    });
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_17 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_17,
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); })();
});
// Gets all invitations of a User
app.get('/getInvites/:userId', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var userID = String(req.params.userId);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, invites, _i, data_2, row, sender, temp_name, err_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    query = { receiverID: userID };
                    return [4 /*yield*/, db.collection("Invitation").find(query).toArray()];
                case 1:
                    data = _a.sent();
                    console.log(data);
                    invites = [];
                    _i = 0, data_2 = data;
                    _a.label = 2;
                case 2:
                    if (!(_i < data_2.length)) return [3 /*break*/, 5];
                    row = data_2[_i];
                    query = { _id: new mongodb_2.ObjectID(row.senderID) };
                    return [4 /*yield*/, db.collection("User").findOne(query)];
                case 3:
                    sender = _a.sent();
                    temp_name = "temp";
                    invites.push(new invitation_1.Invitation(row._id.toString(), row.projectID, temp_name, sender.username));
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    res.status(200).send({
                        message: 'Successfully accessed Invitations of User',
                        invites: invites,
                    });
                    return [3 /*break*/, 7];
                case 6:
                    err_18 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_18,
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); })();
});
// Reacts to an invitation
app.delete('/answerInvite/:invitationId', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var inviteID = String(req.params.invitationId);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, result, err_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_2.ObjectID(inviteID) };
                    return [4 /*yield*/, db.collection("Invitation").deleteOne(query)];
                case 1:
                    result = _a.sent();
                    if (result.deletedCount > 0) {
                        res.status(200).send({
                            message: 'Successfully answered Invitation and deleted pending Invitation',
                        });
                    }
                    else {
                        res.status(404).send({
                            message: 'Invitation not found',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_19 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_19,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Gets all invited UserIds of a Project
app.get('/getProjectInvites/:projectId', isLoggedIn(), isPrivileged(rights_1.Rights.Admin), function (req, res) {
    var projectID = String(req.params.projectId);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, invites, _i, data_3, row, err_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { projectID: projectID };
                    return [4 /*yield*/, db.collection("Invitation").find(query).toArray()];
                case 1:
                    data = _a.sent();
                    invites = [];
                    for (_i = 0, data_3 = data; _i < data_3.length; _i++) {
                        row = data_3[_i];
                        invites.push(row.receiverID);
                    }
                    res.status(200).send({
                        message: 'Successfully accessed all invited User of Project',
                        invites: invites,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_20 = _a.sent();
                    res.send(500).send({
                        message: 'Database request failed: ' + err_20,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Creates new Mindmap
app.post('/createMindmap', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var rootname = req.body.rootname;
    var projectID = req.body.projectID;
    var data = req.body.data;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var mindmap, result, err_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!(rootname.length > 0)) return [3 /*break*/, 2];
                    mindmap = {
                        rootname: rootname,
                        projectID: projectID,
                        data: data,
                    };
                    return [4 /*yield*/, db.collection('Mindmap').insertOne(mindmap)];
                case 1:
                    result = _a.sent();
                    // Successful insertion
                    if (result.insertedCount != 0) {
                        console.log("Created new Mindmap " + rootname);
                        res.status(201).send({
                            message: 'Successfully created new Mindmap',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    res.status(400).send({
                        message: 'Rootname was not supplied',
                    });
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_21 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_21,
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); })();
});
//Get all Mindmaps of a Project
app.get('/getMindmaps/:projectId', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var projectID = String(req.params.projectId);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, mindmaps, _i, data_4, row, err_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { projectID: projectID };
                    return [4 /*yield*/, db.collection("Mindmap").find(query).toArray()];
                case 1:
                    data = _a.sent();
                    mindmaps = [];
                    for (_i = 0, data_4 = data; _i < data_4.length; _i++) {
                        row = data_4[_i];
                        mindmaps.push(new mindmap_1.Mindmap(row._id.toString(), row.rootname, row.data));
                    }
                    res.status(200).send({
                        message: 'Successfully accessed all mindmaps of Project',
                        mindmaps: mindmaps,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_22 = _a.sent();
                    res.send(500).send({
                        message: 'Database request failed: ' + err_22,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
//Edit rootname of Mindmap
app.put('/editMindmap/:mindmapId', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var mindmapID = String(req.params.mindmapId);
    var rootname = req.body.rootname;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, result, err_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_2.ObjectID(mindmapID) };
                    data = { rootname: rootname };
                    return [4 /*yield*/, db.collection("Mindmap").updateOne(query, { $set: data })];
                case 1:
                    result = _a.sent();
                    if (result.modifiedCount != 0) {
                        res.status(200).send({
                            message: 'Successfully updated Mindmap',
                        });
                    }
                    else {
                        res.status(401).send({
                            message: 'Mindmap could not be found',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_23 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_23,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Delete mindmap
app.delete('/deleteMindmap/:mindmapId', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var mindmapID = String(req.params.mindmapId);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, result, err_24;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_2.ObjectID(mindmapID) };
                    return [4 /*yield*/, db.collection("Mindmap").deleteOne(query)];
                case 1:
                    result = _a.sent();
                    if (result.deletedCount > 0) {
                        res.status(200).send({
                            message: 'Successfully deleted Mindmap',
                        });
                    }
                    else {
                        res.status(404).send({
                            message: 'Mindmap not found',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_24 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_24,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Updates data of Mindmap
app.put('/updateMindmap/:mindmapId', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var mindmapID = String(req.params.mindmapId);
    var dat = req.body.data;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, result, err_25;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_2.ObjectID(mindmapID) };
                    data = { data: dat };
                    return [4 /*yield*/, db.collection("Mindmap").updateOne(query, { $set: data })];
                case 1:
                    result = _a.sent();
                    if (result.modifiedCount != 0) {
                        res.status(200).send({
                            message: 'Successfully updated Mindmap-Data',
                        });
                    }
                    else {
                        res.status(401).send({
                            message: 'Mindmap could not be found',
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_25 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_25,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Get Mindmap Data
app.get('/syncMindmap/:mindmapId', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var mindmapID = String(req.params.mindmapId);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, data, err_26;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_2.ObjectID(mindmapID) };
                    return [4 /*yield*/, db.collection("Mindmap").findOne(query)];
                case 1:
                    data = _a.sent();
                    res.status(200).send({
                        message: 'Successfully accessed data of Mindmap',
                        data: data.data,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_26 = _a.sent();
                    res.send(500).send({
                        message: 'Database request failed: ' + err_26,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
// Deletes Project Participation
app.delete('/deleteParticipant/:participant', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var participant = String(req.params.participant);
    console.log(participant);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, options, userID, query2, result, err_27;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    query = { username: participant };
                    options = { projection: { _id: 1 } };
                    return [4 /*yield*/, db.collection("User").findOne(query, options)];
                case 1:
                    userID = _a.sent();
                    console.log(userID);
                    query2 = { userID: userID._id.toString() };
                    console.log(query2);
                    return [4 /*yield*/, db.collection("Participants").deleteOne(query2)];
                case 2:
                    result = _a.sent();
                    if (result.deletedCount > 0) {
                        console.log('Successfully deleted Project Participation' + participant);
                        res.status(200).send({
                            message: 'Successfully deleted Project',
                        });
                    }
                    else {
                        res.status(404).send({
                            message: 'Project not found',
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_27 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_27,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); })();
});
// Gets Rights of User
app.get('/getRights/:participant', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var participant = String(req.params.participant);
    console.log(participant);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, options, data, query2, options2, rights, err_28;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    query = { username: participant };
                    console.log(query);
                    options = { projection: { _id: 1 } };
                    return [4 /*yield*/, db.collection("User").findOne(query, options)];
                case 1:
                    data = _a.sent();
                    console.log(data);
                    query2 = { userID: data._id.toString() };
                    console.log(query2);
                    options2 = { projection: { pRights: 1, _id: 0 } };
                    return [4 /*yield*/, db.collection("Participants").findOne(query2, options2)];
                case 2:
                    rights = _a.sent();
                    console.log(rights);
                    if (rights !== null) {
                        console.log('Successfully accessed rights of user ' + participant);
                        res.status(200).send({
                            message: 'Successfully accessed rights of user' + participant,
                            rights: rights,
                        });
                    }
                    else {
                        res.status(404).send({
                            message: "User was not found",
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_28 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_28,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); })();
});
//Add Change Rights of User
app.post('/changeRights/:participant', isLoggedIn(), isPrivileged(rights_1.Rights.User), function (req, res) {
    var participant = String(req.params.participant);
    var rights = req.body.rights;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var query, options, data, query2, updateData, result, err_29;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    query = { username: participant };
                    console.log(query);
                    options = { projection: { _id: 1 } };
                    return [4 /*yield*/, db.collection("User").findOne(query, options)];
                case 1:
                    data = _a.sent();
                    console.log(data);
                    query2 = { _id: new mongodb_1.ObjectId(data) };
                    updateData = { pRights: rights };
                    console.log(updateData);
                    return [4 /*yield*/, db.collection('Participants').updateOne(query, { $set: updateData })];
                case 2:
                    result = _a.sent();
                    if (result.modifiedCount != 0) {
                        console.log("Registered" + participant + " as " + rights);
                        res.status(201).send({
                            message: 'Changed right of ' + participant,
                        });
                    }
                    else {
                        res.status(500).send({
                            message: 'Participants can not be changed',
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_29 = _a.sent();
                    res.status(500).send({
                        message: 'Database request failed: ' + err_29,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); })();
});
// Static Routes
app.use("/", express.static(__dirname + "/../../Client/dist/Client"));
// Routes innerhalb der Angular-Anwendung zurückleiten
app.use("/*", express.static(__dirname + "/../../Client/dist/Client"));
//# sourceMappingURL=server.js.map