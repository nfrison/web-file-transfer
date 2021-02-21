import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
require("dotenv").config();

import routes from "./src/routes/index";

const app = express();

const port = 8080;

var corsOptions: cors.CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    console.log("origin: " + origin);

    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) {
        callback(null, false);
        return;
    }
    
    const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS ?? "[]");
    const regex = /http:\/\/(.+):8081/;
    const originIp = origin?.match(regex)?.[1] ?? undefined;

    console.log(allowedOrigins)
    console.log(originIp)

    if (!origin || !originIp || !allowedOrigins.includes(originIp)) {
      const msg = `You are not allowed to access this site. Only specific domains are allowed to access it.`;
      callback(new Error(msg), false);
    }

    callback(null, true);
  }
};

app.use(cors({origin: "*"}));
//app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});
routes(app, io);

io.on("connection", (socket: Socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// This overrides the default error handler, and must be called _last_ on the app
app.use(function customErrorHandler(err: Error, req: express.Request, res: express.Response, next: any) {
  res.status(400).send(err.message);
});

server.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
