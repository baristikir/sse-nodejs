/**
 * * Custom Event Emitter
 */
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.setMaxListeners(100000);
// Listening on Event Emits => Emitting Middleware function
const listen = (res) => {
	emitter.on('update', () => {
		const data = {
			status: 'New Update available!',
		};
		res.sendEventStreamData(data);
	});
};
// Basic Trigger for only the update
const trigger = () => {
	emitter.emit('update');
};
// Basic Unsubscribe
const clear = (res) => {
	res.emit('close');
};

exports.listen = listen;
exports.trigger = trigger;
exports.clear = clear;
