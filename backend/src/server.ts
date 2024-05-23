const express = require('express');
const session = require('express-session');
const expressRouter = express.Router();
const app = express();
const {Server} = require('socket.io');
const server = require('http').createServer(app);
const port = 3001;
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const user = require('./model/userModel');

// Initiations
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const db:any = {
    users: [],
    messages: []
}

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(session({
    secret: 'yearschat',
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        expires: 1000 * 60 * 60 * 24 * 7,
    },
  })
);



// Routes
// Logout route
expressRouter.route('/logout').get((req:any, res:any) => {
    req.session.destroy((err:any) => {
        if (err) {
            return res.status(500
            ).json({ message: 'Error logging out' });
        }
        res.clearCookie('sid');
        return res.status(200).json({ loggedIn: false, username: null, userId: null });
    });
});


// Login route
expressRouter
    .route('/login')
    .get(async (req:any, res:any) => {
        if (req.session.user) {
            res.status(200).json({
                loggedIn: true,
                username: req.session.user.username,
                userId: req.session.user.userId,
                messages: db.messages
            });
        } else {
            res.status(200).json({ loggedIn: false, username: null, userId: null });
        }
    })
    .post(async (req:any, res:any) => {
    const { username } = req.body;
    user.validate({ username })
    .then((valid:any) => {
        const user = db.users.find((user:any) => user.username === username);
        if (valid && !user) {
            db.users.push({ id: uuidv4(), username });
            req.session.user = {
                userId: db.users[db.users.length - 1].id,
                username: username
            }
            res.status(200).json({
                loggedIn: true,
                username: username,
                userId: db.users[db.users.length - 1].id,
                messages: db.messages
            });
        } else if (valid && user) {
            req.session.user = {
                userId: user.id,
                username: username
            }
            res.status(200).json({
                loggedIn: true,
                username: username,
                userId: user.id,
                messages: db.messages
            });
        }
    })
    .catch((err:any) => {
        res.status(400).json({ errorMessage: err.errors[0] });
    })
});


// Message routes
expressRouter
.route('/message')
.put((req:any, res:any) => {
    const { id, message, edited, time } = req.body;
    db.messages.forEach((m:any) => {
        if (m.id === id) {
            m.message = message;
            m.edited = edited;
            m.time = time;
        }
    })
    res.status(200).json({ messages: db.messages });
})
.delete((req:any, res:any) => {
    const { id, time,edited } = req.body;
    db.messages.forEach((m:any) => {
        if (m.id === id) {
            m.message = 'This message has been deleted';
            m.time = time;
            m.edited = edited;
        }
    })
    res.status(200).json({ messages: db.messages });
})

app.use(expressRouter);

// Socket.io
io.on('connection', (socket:any) => {
    socket.on('join_room', () => {
        socket.join('yearschat');
    })

    socket.on('send_message', (data:any) => {
        const messageData = {
            id: data.id,
            message: data.message,
            edited: data.edited,
            userId: data.userId,
            username: data.username,
            time: data.time
        }
        db.messages.push(messageData);
        socket.to('yearschat').emit('receive_message', messageData);
    })

    socket.on('delete_message', (data:any) => {
        const { id, time, edited,message } = data;
        db.messages.forEach((m:any) => {
            if (m.id === id) {
                m.message = message;
                m.time = time;
                m.edited = edited;
            }
        });
        socket.to('yearschat').emit('delete_message', data);
    })

    socket.on('edit_message', (data:any) => {
        const { id, message, edited, time } = data;
        db.messages.forEach((m:any) => {
            if (m.id === id) {
                m.message = message;
                m.edited = edited;
                m.time = time;
            }
        });
        socket.to('yearschat').emit('edit_message', data);
    })
});


// Server
server.listen(port, () => {
    console.log(`listening on: ${port}`);
});