/**
 * * Packages
 */
const express = require('express');
const cors = require('cors');
const server = require('https');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
/**
 * * Custom Event Emitter + Middleware
 */
const events = require('./events');
const useServerSentEventsMiddleware = require('./middlewares/useServerSentEvents');

const app = express();
// Defaul Port
const config = {
	PORT: 12529,
};
// SSL Self Signed Certificate Setup
const sslServer = server.createServer(
	{
		key: fs.readFileSync(path.join(__dirname, '../', 'cert', 'key.pem')),
		cert: fs.readFileSync(path.join(__dirname, '../', 'cert', 'cert.pem')),
	},
	app,
);
// Specifically for Nginx
app.enable('trust proxy');
// Basic Cors
app.use(cors());

/**
 * * Static Files
 */
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.get('/socket.js', function (req, res) {
	res.sendFile('../' + __dirname + '/socket.js');
});

app.get('/status', (_req, res) => {
	res.status(200).end();
});

app.get('/sse', useServerSentEventsMiddleware, (req, res) => {
	logger.info('Event Source Request');
	// Subscribing to the Update Events
	events.listen(res);

	res.on('close', () => {
		console.log('Client droped me');
		res.end();
	});
});

app.get('/trigger-sse', (req, res) => {
	console.log('Received Request');
	// Triggering an Update on the Event Emitter
	events.trigger();
	// Very important otherwise the server will crash!
	res.end();
});

app.post('/auth/logout', (req, res) => {
	// Basic unsubscribe
	events.clear(res);
	res
		.status(200)
		.send({
			status: 'Successfully logged out + Unsubscribed the Event Stream',
		})
		.end();
});

/**
 * * Websocket Stuff
 */
const wss = new WebSocket.Server({ server: sslServer });
wss.on('connection', function connection(ws) {
	console.log('A new client connected!');
	ws.send("Welcome, you're connected to Plato Node's Websocket Instance!");

	ws.on('message', function (message) {
		console.log(`received: %s`, message);
		ws.send('Got it.');
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
