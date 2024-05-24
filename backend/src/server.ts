const express = require("express");
const session = require("express-session");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const user = require("./model/userModel");

const app = express();
const expressRouter = express.Router();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

const CORS_ORIGIN = "http://localhost:3000";
const SESSION_SECRET = "supersecretchat";
const COOKIE_NAME = "sid";
const ROOM_NAME = "supersecretchatroom";

// Initiations
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const db: {
  users: Array<{ id: string; username: string }>;
  messages: Array<any>;
} = {
  users: [],
  messages: [],
};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: SESSION_SECRET,
    name: COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Routes
expressRouter.route("/logout").get((req: any, res: any) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie(COOKIE_NAME);
    return res
      .status(200)
      .json({ loggedIn: false, username: null, userId: null });
  });
});

expressRouter
  .route("/login")
  .get(async (req: any, res: any) => {
    if (req.session.user) {
      res.status(200).json({
        loggedIn: true,
        username: req.session.user.username,
        userId: req.session.user.userId,
        messages: db.messages,
      });
    } else {
      res.status(200).json({ loggedIn: false, username: null, userId: null });
    }
  })
  .post(async (req: any, res: any) => {
    const { username } = req.body;
    user
      .validate({ username })
      .then((valid: any) => {
        const existingUser = db.users.find((u: any) => u.username === username);
        if (valid && !existingUser) {
          const newUser = { id: uuidv4(), username };
          db.users.push(newUser);
          req.session.user = {
            userId: newUser.id,
            username: username,
          };
          res.status(200).json({
            loggedIn: true,
            username: username,
            userId: newUser.id,
            messages: db.messages,
          });
        } else if (valid && existingUser) {
          req.session.user = {
            userId: existingUser.id,
            username: username,
          };
          res.status(200).json({
            loggedIn: true,
            username: username,
            userId: existingUser.id,
            messages: db.messages,
          });
        }
      })
      .catch((err: any) => {
        res.status(400).json({ errorMessage: err.errors[0] });
      });
  });

expressRouter
  .route("/message")
  .put((req: any, res: any) => {
    const { id, message, edited, time } = req.body;
    db.messages.forEach((m: any) => {
      if (m.id === id) {
        m.message = message;
        m.edited = edited;
        m.time = time;
      }
    });
    res.status(200).json({ messages: db.messages });
  })
  .delete((req: any, res: any) => {
    const { id, time, edited } = req.body;
    db.messages.forEach((m: any) => {
      if (m.id === id) {
        m.message = "This message has been deleted";
        m.time = time;
        m.edited = edited;
      }
    });
    res.status(200).json({ messages: db.messages });
  });

app.use(expressRouter);

// Socket.io
io.on("connection", (socket: any) => {
  socket.on("join_room", () => {
    socket.join(ROOM_NAME);
  });

  socket.on("send_message", (data: any) => {
    const messageData = {
      id: data.id,
      message: data.message,
      edited: data.edited,
      userId: data.userId,
      username: data.username,
      time: data.time,
    };
    db.messages.push(messageData);
    socket.to(ROOM_NAME).emit("receive_message", messageData);
  });

  socket.on("delete_message", (data: any) => {
    const { id, time, edited, message } = data;
    db.messages.forEach((m: any) => {
      if (m.id === id) {
        m.message = message;
        m.time = time;
        m.edited = edited;
      }
    });
    socket.to(ROOM_NAME).emit("delete_message", data);
  });

  socket.on("edit_message", (data: any) => {
    const { id, message, edited, time } = data;
    db.messages.forEach((m: any) => {
      if (m.id === id) {
        m.message = message;
        m.edited = edited;
        m.time = time;
      }
    });
    socket.to(ROOM_NAME).emit("edit_message", data);
  });
});

// Graceful shutdown
const gracefulShutdown = () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Server
server.listen(port, () => {
  console.log(`listening on: ${port}`);
});
