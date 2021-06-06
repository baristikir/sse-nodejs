const useServerSentEventsMiddleware = (req, res, next) => {
	// SSE related headers
	const headers = {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
		'Access-Control-Allow-Origin': '*',
		'X-Accel-Buffering': 'no',
	};
	res.writeHead(200, headers);
	res.flushHeaders();

	// Callback for sending any data
	const sendEventStreamData = (data) => {
		console.log('Received Data: %o', data);
		const sseResponse = `data: ${JSON.stringify(data)}\n\n`;
		res.write(sseResponse);
	};

	// Apply to res => allows to use res.sendEventStreamDate(...) anywhere after subscription
	Object.assign(res, {
		sendEventStreamData,
	});

	next();
};

module.exports = useServerSentEventsMiddleware;
