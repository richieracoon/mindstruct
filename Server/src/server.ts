import express = require ('Express');
import session = require ('express-session');
import {Request, Response} from 'express';
import {Configuration} from '../config/config';
import {
    Db,
    DeleteWriteOpResultObject,
    InsertOneWriteOpResult,
    MongoClient,
    UpdateWriteOpResult,
    ObjectId,
    FindOneOptions
} from 'mongodb';
import * as fs from 'fs';
import * as https from 'https';
import * as path from "path";
import * as passport from 'passport';
import {Profile} from 'passport';
import * as pGoogle from 'passport-google-oauth20';
import {Rights} from '../model/rights';
import {User} from '../model/user';
import {authConfig} from '../config/authConfig';
import {ObjectID} from 'mongodb';
import {Invitation} from "../model/invitation";
import {Participants} from "../../Client/src/model/participants";
import {Project} from "../../Client/src/model/project";
import {constants} from "os";
import {Mindmap} from "../model/mindmap";
import socket = require('socket.io');
import {MindmapUser} from "../model/mindmapUser";

// Worked on Mindmaps
const currentUsers: MindmapUser[] = [];

// Define App and db connection
const app = express();
let client: MongoClient;
let db: Db;

// Configure Web-App
app.use(express.json());
app.use(session(Configuration.sessionOptions));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// used to serialize user
passport.serializeUser(function (profile: Profile, done) {
    done(null, profile);
});

// used to deserialize user
passport.deserializeUser(function (profile: Profile, done) {
    done(null, profile);
});


// SSL-Certificate and Key
let privateKey = fs.readFileSync(path.join(__dirname, '../ssl/cert/localhost.key'), 'utf-8');
let certificate = fs.readFileSync(path.join(__dirname, '../ssl/cert/localhost.crt'), 'utf-8');
let credentials = {key: privateKey, cert: certificate};

// Google Strategy settings
let GoogleStrategy = pGoogle.Strategy;
passport.use(new GoogleStrategy({
    clientID: authConfig.googleAuth.clientID,
    clientSecret: authConfig.googleAuth.clientSecret,
    callbackURL: authConfig.googleAuth.callbackURL,
    passReqToCallback: true
}, function (accessToken, refreshToken, params, profile, done) {
    (async () => {
        try {
            const query: Object = {username: profile.displayName};
            let user = await db.collection("User").findOne(query);
            // New User
            if (user == null) {
                let user: Object = {
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    password: '1234',
                    isGoogle: true,
                    rights: Rights.User
                };
                let result: InsertOneWriteOpResult<any> = await db.collection<Object>('User').insertOne(user);
                // Successfull insertion
                if (result.insertedCount != 0) {
                    console.log("Successfully added " + result.insertedCount + " User: " + result.insertedId);
                }
            }
        } catch (err) {
            console.log("Database Request failed: " + err);
        }
    })();
    done(null, profile);
}));

// Start Server and connect to Database
const server = https.createServer(credentials, app).listen(8843, ()=>{
    console.log('Server startet: https://localhost:8843');
    (async () => {
        try {
            client = await MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true});
            db = client.db("MindStruct");
            console.log('Connected to MongoDB...');
        } catch (err) {
            console.error('Error connecting to MongoDB: ' + err);
        }
    })();
});

// Socket
let io = socket.listen(server);
io.on('connection', (socket)=>{
    console.log("Socket-Connection with: " + socket.id);
    socket.on("register", function(data) {
        socket.join(data);
    });
    socket.on('update', function(data) {
        io.to(data).emit('updated');
    });
    socket.on('disconnect', function() {
        console.log("User with Socket-ID "+socket.id+" disconnected!");
    });
    socket.on('select', function(data){
        io.to(data.mindmapID).emit('lock', {id: data.id});
    });
    socket.on('deselect', function(data){
        io.to(data.mindmapID).emit('unlock', {id: data.id});
    });
});
// Middleware routes for session management
function isLoggedIn() {
    return (req: Request, res: Response, next) => {
        if (req.user || req.session.user) {
            next();
        } else {
            res.status(401).send({
                message: 'Session expired. Please log in again!',
            });
        }
    }
}

function isPrivileged(rights: Rights) {
    return (req: Request, res: Response, next) => {
        if (rights > Number(req.session.user.rights)) {
            res.status(403).send({
                message: 'You are not allowed to do that',
            });
        } else {
            next();
        }
    };
}

// Google Route for Authentication
app.get("/auth/google", passport.authenticate('google', {scope: ['profile', 'email']}));

// Callback after Google Authentication
app.get("/auth/google/callback", passport.authenticate('google', {
    successRedirect: "/loggedin",
    failureRedirect: "/"
}));

// Is logged in
app.get('/login', isLoggedIn(), (req: Request, res: Response) => {
   if(!req.session.user && req.user){
       (async ()=>{
           try{
               // @ts-ignore
               let query:Object = {username: req.user.displayName};
               let data = await db.collection("User").findOne(query);
               if(data != null){
                   req.session.user = data;
                   res.status(200).send({
                       message: 'Successfully accessed User',
                       user: data,
                   });
               }else {
                   res.status(404).send({
                       message: 'User not found',
                   });
               }
           }catch(err){
               res.status(500).send({
                   message: 'Database request failed: '+err,
               })
           }
       })();
   }else {
       res.status(200).send({
           message: 'User still logged in',
           user: req.session.user,
       })
   }
});

// Login-Request
app.post('/login', (req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    (async () => {
        try {
            const query: Object = {username: username, password: password};
            let user = await db.collection('User').findOne(query);
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
                    user,
                });
            } else {
                res.status(401).send({
                    message: 'Username or Password is incorrect',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

//Logout
app.post('/logout', isLoggedIn(), (req: Request, res: Response) => {
    if (req.user) {
        req.logOut();
    }
    delete req.session.user;
    res.status(200).send({
        message: "Successfully logged out",
    });
});

//Register
app.post('/registration', (req: Request, res: Response) => {
    const username: string = req.body.username;
    const email: string = req.body.email;
    const password: string = req.body.password;

    (async () => {
        try {
            const query: Object = {$or: [{username: username}, {email: email}]};
            let user = await db.collection('User').findOne(query);
            // Username & E-Mail not already used
            if (user == null) {
                let user: Object = {
                    username: username,
                    email: email,
                    password: password,
                    isGoogle: false,
                    rights: Rights.User
                };
                let result: InsertOneWriteOpResult<any> = await db.collection<Object>('User').insertOne(user);
                // Successful insertion
                if (result.insertedCount != 0) {
                    console.log("Registered new User: " + username);
                    res.status(201).send({
                        message: 'Successfully registered new Account',
                    })
                }
            } else {
                res.status(406).send({
                    message: 'Username or E-Mail are already in use',
                })
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

//Edit User
app.put('/user/:userId', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const userID: string = String(req.params.userId);
    const username: string = req.body.username;
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (userID === req.session.user._id.toString()) {
        (async () => {
            try {
                let query: Object = {username: username};
                let user = null;
                // Was Username changed & does the new Username already exist?
                if (req.session.user.username !== username) {
                    user = await db.collection("User").findOne(query);
                }
                // No user with new email or new username found
                if (user == null) {
                    query = {_id: new ObjectID(userID)};
                    const data = {username: username, email: email, password: password};
                    let result: UpdateWriteOpResult = await db.collection("User").updateOne(query, {$set: data});
                    if (result.modifiedCount != 0) {
                        res.status(200).send({
                            message: 'Successfully updated User',
                        });
                    } else {
                        res.status(401).send({
                            message: 'User could not be found',
                        });
                    }
                } else {
                    res.status(409).send({
                        message: 'Username already exists',
                    });
                }
            } catch (err) {
                res.status(500).send({
                    message: 'Database request failed: ' + err,
                })
            }
        })();
    }
});

//Edit User as Admin
app.put('/edit/:userId', isLoggedIn(), isPrivileged(Rights.Admin), (req: Request, res: Response) => {
    const userID: string = String(req.params.userId);
    const username: string = req.body.username;
    const email: string = req.body.email;
    const password: string = req.body.password;

    (async () => {
        try {
            let query: Object = {_id: new ObjectID(userID)};
            let user = await db.collection("User").findOne(query);
            // Was Username changed & does the new Username not exist?
            if (user.username == username) {
                const data = {username: username, email: email, password: password};
                let result: UpdateWriteOpResult = await db.collection("User").updateOne(query, {$set: data});
                if (result.modifiedCount != 0) {
                    res.status(200).send({
                        message: 'Successfully updated User',
                    });
                } else {
                    res.status(401).send({
                        message: 'User could not be found',
                    });
                }
            } else {
                res.status(409).send({
                    message: 'Username already exists',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

//Delete User as Admin
app.delete('/delete/:userId', isLoggedIn(), isPrivileged(Rights.Admin), (req: Request, res: Response) => {
    const userID: string = String(req.params.userId);
    (async () => {
        try {
            let query: Object = {_id: new ObjectID(userID)};
            let result: DeleteWriteOpResultObject = await db.collection("User").deleteOne(query);
            if (result.deletedCount > 0) {
                res.status(200).send({
                    message: 'Successfully deleted User',
                });
            } else {
                res.status(404).send({
                    message: 'User not found',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});


// Get all Users as Admin
app.get('/getUsers', isLoggedIn(), isPrivileged(Rights.Admin), (req: Request, res: Response) => {
    (async () => {
        try {
            let query: Object = {};
            let data = await db.collection("User").find(query).toArray();
            const users: User[] = [];
            if (data.length > 0) {
                for (const row of data) {
                    users.push(new User(row._id.toString(), row.username, row.email, row.password, row.rights, row.isGoogle));
                }
                res.status(200).send({
                    message: 'Successfully accessed Users',
                    users,
                });
            } else {
                res.status(404).send({
                    message: 'No Users found',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

// Get a User as Admin
app.get('/getUser/:userId', isLoggedIn(), isPrivileged(Rights.Admin), (req: Request, res: Response) => {
    const userID: string = String(req.params.userId);
    (async () => {
        try {
            let query: Object = {_id: new ObjectID(userID)};
            let data = await db.collection("User").findOne(query);
            const user: User = new User(data._id.toString(), data.username, data.email, data.password, data.rights, data.isGoogle);
            if (user != null) {
                res.status(200).send({
                    message: 'Successfully accessed User',
                    user,
                });
            } else {
                res.status(404).send({
                    message: 'User not found',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

// Get a User as Admin
app.get('/getUsername/:username', isLoggedIn(), isPrivileged(Rights.Admin), (req: Request, res: Response) => {
    console.log("hi");
    const username: string = String(req.params.username);
    console.log("username");
    (async () => {
        try {
            let query: Object = {username: (username)};
            console.log(query);
            let data = await db.collection("User").findOne(query);
            const user: User = new User(data._id.toString(), data.username, data.email, data.password, data.rights, data.isGoogle);
            if (user != null) {
                res.status(200).send({
                    message: 'Successfully accessed User',
                    user,
                });
            } else {
                res.status(404).send({
                    message: 'User not found',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});


//Add project as User
app.post('/addProject', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const pname: string = req.body.pname.trim();
    const userID: string = req.session.user._id.toString();

    (async () => {
        try {
            if (pname !== null) {
                let project: Object = {
                    pname: pname,
                    creationDate: new Date()
                };
                let result: InsertOneWriteOpResult<any> = await db.collection<Object>('Projects').insertOne(project);
                // Successful insertion
                let projectID = result.insertedId.toString();
                if (result.insertedCount != 0) {
                    let participation: Object = {
                        userID: userID,
                        projectID: projectID,
                        pRights: 0,
                        entryDate: new Date()
                    };
                    console.log(participation);
                    let result: InsertOneWriteOpResult<any> = await db.collection<Object>('Participants').insertOne(participation);
                    console.log("Registered new Project: " + pname);
                    res.status(201).send({
                        message: 'Successfully registered new Project' + pname,
                    })
                }
            } else {
                res.status(500).send({
                    message: 'Projectname is invalid',
                })
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});


// Get all Projects as User
app.get('/getProjects', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    console.log("getprojects geht");
    (async () => {
        try {
            const userID: string = req.session.user._id;
            let query: Object = {userID: userID.toString()};
            let options: FindOneOptions = {projection: {projectID: 1, _id: 0}};
            let participations: Participants[] = await db.collection("Participants").find(query, options).toArray();
            console.log(participations);
            const projectList: Object[] = [];
            let query2: Object;
            let project;
            if (participations.length > 0) {
                for (let participation of participations) {
                    let pid = new ObjectID(participation.projectID);
                    query2 = {_id: pid};
                    console.log(query2);
                    project = await db.collection("Projects").findOne(query2);
                    projectList.push(new Project(project._id.toString(), project.pname, project.creationDate));
                    console.log(projectList);
                }

                res.status(200).send({
                    message: 'Successfully retrieved userprojects',
                    projectList,
                });
            } else {
                res.status(404).send({
                    message: 'User does not participate in projects',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

// Get all Projects as Admin
app.post('/getUserProjects', isLoggedIn(), isPrivileged(Rights.Admin), (req: Request, res: Response) => {
    let user: User = req.body.user;
    (async () => {
        try {
            const userID: string = user.id;
            let query: Object = {userID: userID.toString()};
            let options: FindOneOptions = {projection: {projectID: 1, _id: 0}};
            let participations = await db.collection("Participants").find(query, options).toArray();
            const projectList: Object[] = [];
            let query2: Object;
            let project;
            if (participations.length > 0) {
                for (let participation of participations) {
                    let pid = new ObjectId(participation.projectID);
                    query2 = {_id: pid};
                    project = await db.collection("Projects").findOne(query2);
                    projectList.push(new Project(project._id.toString(), project.pname, project.creationDate));
                    console.log(projectList);
                }
                res.status(200).send({
                    message: 'Successfully retrieved userprojects',
                    pList: projectList,
                });
            } else {
                res.status(404).send({
                    message: 'User does not participate in projects',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});


//Edit Project
app.put('/editProject/:projectID', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const projectID: string = String(req.params.projectID);
    const pname: string = req.body.pname.trim();
    console.log(projectID);
    console.log(pname);

    (async () => {
        try {
            if (pname !== "") {
                const query: Object = {_id: new ObjectId(projectID)};
                const data = {pname: pname};
                let result: UpdateWriteOpResult = await db.collection("Projects").updateOne(query, {$set: data});
                if (result.modifiedCount != 0) {
                    console.log('Successfully change Project to name' + pname);
                    res.status(200).send({
                        message: 'Successfully change Project to name' + pname,
                    });
                } else {
                    res.status(401).send({
                        message: 'Project could not be found',
                    });
                }
            } else {
                res.status(500).send({
                    message: 'Projectname is invalid',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

//Delete User as Admin
app.delete('/deleteProject/:projectID', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const projectID: string = String(req.params.projectID);

    (async () => {
        try {
            let query: Object = {_id: new ObjectID(projectID)};
            let result: DeleteWriteOpResultObject = await db.collection("Projects").deleteOne(query);
            if (result.deletedCount > 0) {
                let query = {projectID: projectID};
                let result: DeleteWriteOpResultObject = await db.collection("Participants").deleteMany(query);
                console.log('Successfully deleted Project' + projectID);
                res.status(200).send({
                    message: 'Successfully deleted Project',
                });
            } else {
                res.status(404).send({
                    message: 'Project not found',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});


// Creates an invitation to a project
app.post('/invite', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const username: string = req.body.username;
    const senderID: string = req.body.senderID;
    const projectID: string = req.body.projectID;

    (async () => {
        try {
            const query: Object = {username: username};
            let data = await db.collection('User').findOne(query);
            // Does User with username exist
            if (data != null) {
                const userID = data._id.toString();
                let invitation: Object = {
                    projectID: projectID,
                    senderID: senderID,
                    receiverID: userID
                };
                data = await db.collection('Invitation').findOne(invitation);
                //Invitation of user already exists
                if (data != null) {
                    res.status(404).send({
                        message: 'User was already invited to Project',
                    });
                } else {
                    let result: InsertOneWriteOpResult<any> = await db.collection<Object>('Invitation').insertOne(invitation);
                    // Successful insertion
                    if (result.insertedCount != 0) {
                        res.status(201).send({
                            message: 'Successfully created new Invitation',
                        })
                    }
                }
            } else {
                res.status(404).send({
                    message: 'User not found with Username ' + username,
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

// Gets all invitations of a User
app.get('/getInvites/:userId', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const userID: string = String(req.params.userId);
    (async () => {
        try {
            let query: Object = {receiverID: userID};
            const data = await db.collection("Invitation").find(query).toArray();
            console.log(data);
            const invites: Invitation[] = [];
            for (const row of data) {
                query = {_id: new ObjectID(row.senderID)};
                const sender = await db.collection("User").findOne(query);
                // TODO: Get Projectname to display with invitation
                let temp_name = "temp";
                invites.push(new Invitation(row._id.toString(), row.projectID, temp_name, sender.username));
            }
            res.status(200).send({
                message: 'Successfully accessed Invitations of User',
                invites,
            });
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

// Reacts to an invitation
app.delete('/answerInvite/:invitationId', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const inviteID: string = String(req.params.invitationId);
    (async () => {
        try {
            let query: Object = {_id: new ObjectID(inviteID)};
            let result: DeleteWriteOpResultObject = await db.collection("Invitation").deleteOne(query);
            if (result.deletedCount > 0) {
                res.status(200).send({
                    message: 'Successfully answered Invitation and deleted pending Invitation',
                });
            } else {
                res.status(404).send({
                    message: 'Invitation not found',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

// Gets all invited UserIds of a Project
app.get('/getProjectInvites/:projectId', isLoggedIn(), isPrivileged(Rights.Admin), (req: Request, res: Response) => {
    const projectID: string = String(req.params.projectId);
    (async () => {
        try {
            let query: Object = {projectID: projectID};
            const data = await db.collection("Invitation").find(query).toArray();
            const invites: String[] = [];
            for (const row of data) {
                invites.push(row.receiverID);
            }
            res.status(200).send({
                message: 'Successfully accessed all invited User of Project',
                invites,
            });
        } catch (err) {
            res.send(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

// Creates new Mindmap
app.post('/createMindmap', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const rootname: string = req.body.rootname;
    const projectID: string = req.body.projectID;
    const data: string = req.body.data;
    (async ()=> {
        try {
            if(rootname.length > 0){
                const mindmap: Object = {
                    rootname: rootname,
                    projectID: projectID,
                    data:  data,
                };
                let result: InsertOneWriteOpResult<any> = await db.collection<Object>('Mindmap').insertOne(mindmap);
                // Successful insertion
                if (result.insertedCount != 0) {
                    console.log("Created new Mindmap " + rootname);
                    res.status(201).send({
                        message: 'Successfully created new Mindmap',
                    });
                }
            }else{
                res.status(400).send({
                    message: 'Rootname was not supplied',
                });
            }
         } catch(err){
            res.status(500).send({
                message: 'Database request failed: '+err,
            });
        }
    })();
});

//Get all Mindmaps of a Project
app.get('/getMindmaps/:projectId', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const projectID: string = String(req.params.projectId);
    (async () => {
        try{
            let query:Object = {projectID: projectID};
            const data = await db.collection("Mindmap").find(query).toArray();
            const mindmaps: Mindmap[] = [];
            for(const row of data){
                mindmaps.push(new Mindmap(row._id.toString(), row.rootname, row.data));
            }
            res.status(200).send({
                message: 'Successfully accessed all mindmaps of Project',
                mindmaps,
            });
        }catch(err){
            res.send(500).send({
                message: 'Database request failed: '+err,
            })
        }
    })();
});

//Edit rootname of Mindmap
app.put('/editMindmap/:mindmapId', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res:Response) => {
    const mindmapID: string = String(req.params.mindmapId);
    const rootname: string = req.body.rootname;

    (async ()=>{
        try{
            let query: Object = {_id: new ObjectID(mindmapID)};
            const data = {rootname: rootname};
            let result: UpdateWriteOpResult = await db.collection("Mindmap").updateOne(query, {$set: data});
            if(result.modifiedCount != 0){
                res.status(200).send({
                    message: 'Successfully updated Mindmap',
                });
            }else{
                res.status(401).send({
                    message: 'Mindmap could not be found',
                });
            }
        }catch(err){
            res.status(500).send({
                message: 'Database request failed: '+err,
            })
        }
    })();
});

// Delete mindmap
app.delete('/deleteMindmap/:mindmapId', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res:Response) => {
    const mindmapID: string = String(req.params.mindmapId);
    (async ()=>{
        try{
            let query: Object = {_id: new ObjectID(mindmapID)};
            let result: DeleteWriteOpResultObject = await db.collection("Mindmap").deleteOne(query);
            if(result.deletedCount>0){
                res.status(200).send({
                    message: 'Successfully deleted Mindmap',
                });
            }else{
                res.status(404).send({
                    message: 'Mindmap not found',
                });
            }
        }catch(err){
            res.status(500).send({
                message: 'Database request failed: '+err,
            })
        }
    })();
});

// Updates data of Mindmap
app.put('/updateMindmap/:mindmapId', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res:Response) => {
    const mindmapID: string = String(req.params.mindmapId);
    const dat = req.body.data;

    (async ()=>{
        try{
            let query: Object = {_id: new ObjectID(mindmapID)};
            const data = {data: dat};
            let result: UpdateWriteOpResult = await db.collection("Mindmap").updateOne(query, {$set: data});
            if(result.modifiedCount != 0){
                res.status(200).send({
                    message: 'Successfully updated Mindmap-Data',
                });
            }else{
                res.status(401).send({
                    message: 'Mindmap could not be found',
                });
            }
        }catch(err){
            res.status(500).send({
                message: 'Database request failed: '+err,
            })
        }
    })();
});

// Get Mindmap Data
app.get('/syncMindmap/:mindmapId', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const mindmapID: string = String(req.params.mindmapId);
    (async () => {
        try{
            let query:Object = {_id: new ObjectID(mindmapID)};
            const data = await db.collection("Mindmap").findOne(query);
            res.status(200).send({
                message: 'Successfully accessed data of Mindmap',
                data: data.data,
            });
        }catch(err){
            res.send(500).send({
                message: 'Database request failed: '+err,
            })
        }
    })();
});


// Deletes Project Participation
app.delete('/deleteParticipant/:participant', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const participant: string = String(req.params.participant);
    console.log(participant);
    (async () => {
        try {
            let query: Object = {username: participant};
            let options: FindOneOptions = {projection: {_id: 1}};
            const userID = await db.collection("User").findOne(query, options);
            console.log(userID);
            let query2: Object = {userID: userID._id.toString()};
            console.log(query2);
            let result: DeleteWriteOpResultObject = await db.collection("Participants").deleteOne(query2);
            if (result.deletedCount > 0) {
                console.log('Successfully deleted Project Participation' + participant);
                res.status(200).send({
                    message: 'Successfully deleted Project',
                });
            } else {
                res.status(404).send({
                    message: 'Project not found',
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});

// Gets Rights of User
app.get('/getRights/:participant', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const participant: string = String(req.params.participant);
    console.log(participant);
    (async () => {
        try {
            let query: Object = {username: participant};
            console.log(query);
            let options: FindOneOptions = {projection: {_id: 1}};
            const data = await db.collection("User").findOne(query, options);
            console.log(data);
            let query2: Object = {userID: data._id.toString()};
            console.log(query2);
            let options2: FindOneOptions = {projection: {pRights: 1, _id: 0}};
            const rights = await db.collection("Participants").findOne(query2, options2);
            console.log(rights);
            if (rights !== null) {
                console.log('Successfully accessed rights of user ' + participant);
                res.status(200).send({
                    message: 'Successfully accessed rights of user' + participant,
                    rights,
                });
            } else {
                res.status(404).send({
                    message: "User was not found",
                });
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            });
        }
    })();
});


//Add Change Rights of User
app.post('/changeRights/:participant', isLoggedIn(), isPrivileged(Rights.User), (req: Request, res: Response) => {
    const participant: string = String(req.params.participant);
    const rights: string = req.body.rights;

    (async () => {
        try {
            let query: Object = {username: participant};
            console.log(query);
            let options: FindOneOptions = {projection: {_id: 1}};
            const data = await db.collection("User").findOne(query, options);
            console.log(data);
            let query2: Object = {_id: new ObjectId(data)};
            let updateData: Object = {pRights: rights};
            console.log(updateData);
            let result: UpdateWriteOpResult = await db.collection<Object>('Participants').updateOne(query, {$set: updateData});
            if (result.modifiedCount != 0) {
                console.log("Registered" + participant + " as " + rights);
                res.status(201).send({
                    message: 'Changed right of ' + participant,
                })
            } else {
                res.status(500).send({
                    message: 'Participants can not be changed',
                })
            }
        } catch (err) {
            res.status(500).send({
                message: 'Database request failed: ' + err,
            })
        }
    })();
});


// Static Routes
app.use("/", express.static(__dirname + "/../../Client/dist/Client"));
// Routes innerhalb der Angular-Anwendung zurückleiten
app.use("/*", express.static(__dirname + "/../../Client/dist/Client"));
