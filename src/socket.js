const express = require("express");
const app = express();
const cors = require("cors");
const server = require("https");
const WebSocket = require("ws");
const logger = require("./logger");
const fs = require("fs");
const path = require("path");

// const events = require("./events");
const EventEmitter = require("events");
const emitter = new EventEmitter();

const config = {
  PORT: 12529,
};

const sslServer = server.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "../", "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../", "cert", "cert.pem")),
  },
  app
);

app.enable("trust proxy");
app.use(cors());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/socket.js", function (req, res) {
  res.sendFile("../" + __dirname + "/socket.js");
});

app.get("/status", (_req, res) => {
  res.status(200).end();
});

app.get("/sse", (req, res) => {
  console.log("Event Source Request");
  res.write("Hi from the server!");
  emitter.on("notify-update", () => {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
      "X-Accel-Buffering": "no",
    };
    res.writeHead(200, headers);
    res.flushHeaders();
    try {
      events.listen(res);
    } catch (error) {
      console.error(error);
      res.status(500).send("Oops");
    }

    req.socket.on(
      "close",
      () => {
        events.clear();
      },
      false
    );

    res.on("close", () => {
      console.log("Client droped me");
      res.end();
    });
  });
});

let i = 0;
function send(res) {
  res.write("data: " + `hello${i++}!\n\n`);
  setTimeout(() => send(res), 1000);
}

app.post("/trigger-sse", (req, res) => {
  console.log("Received: %o", req.body);
  try {
    events.trigger();
  } catch (e) {
    console.log(e);
  }
});

/**
 * * Websocket Stuff
 */
const wss = new WebSocket.Server({ server: sslServer });
wss.on("connection", function connection(ws) {
  console.log("A new client connected!");
  ws.send("Welcome, you're connected to Plato Node's Websocket Instance!");

  ws.on("message", function (message) {
    console.log(`received: %s`, message);
    ws.send("Got it.");
  });
});

app.use((err, req, res, next) => {
  return next(err);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
    },
  });
});

sslServer.listen(config.PORT, function () {
  logger.info(`
  ################################################
  🛡️  Server listening on port: ${config.PORT} 🛡️
  https://localhost:${config.PORT}
  ################################################
`);
});
