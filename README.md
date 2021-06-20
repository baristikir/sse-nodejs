# SSE - Server Sent Events

Demo Repository for subscribing on events, without using Websocket Connections or any other polling mechanism. The clientside code works almost identically to websockets in part of handling icoming events.

> This is an one-way connection, so you can't send events from a client to a server!

### Emitting events on any Endpoint

You can use the custom event emitter to notify all subscribed clients that any updates were made. This is useful for `POST` endpoints and provides easy implementation inside any route / controller.
Example for emitting events:

```js
// Custom Event Emitter Object
const events = require("./events")
app.post("/any-route", async (req, res, next) => {
    ...
    // Trigger an event for a specific use case, so that all subscribed clients can get notified
    events.trigger();
    ...
})
```

### Receiving events from the server

The only server-sent event API is receiving client subscriptions. The `EventSource` interface built in web technologies is for opening a connection to the server and begin receiving events from it. So just create a new `EventSource` object with the URL of the endpoint `http://localhost:12529/sse`

Endpoint for receiving server-sent events:

```js
app.get('/sse', useServerSentEventsMiddleware, (req, res) => {
	// Subscribing to the Update Events
	try {
		events.listen(res);
	} catch (error) {
		res.end();
	}
});
```

The endpoint has it's own middleware to attach sse related http-headers and the publisher to the response instance.

**For Flutter Clients**
The `universal` package of flutter has the `EventSource` interface built in. Use the [sse.dart](https://github.com/baristikir/sse-flutter/blob/main/lib/utils/sse.dart) script inside the `/utils` directory

**For Javascript Clients**

```js
const event = new EventSource('https://localhost:12529/sse');
event.onmessage = function logEvents(event) {
	console.log(JSON.parse(event));
};
```

### Usage

Install dependencies

```bash
npm install
```

Start dev-server

```bash
npm start
```

### Author

Baris Tikir
