const mongoose = require('mongoose');
const events = require('../events');

const getCases = async (req, res, next) => {
	let cases = [];

	const client = await mongoose.connect('mongodb://localhost/sse-test', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});

	const elements = await client.connection.collection('cases').find().toArray();
	cases = elements;

	res.status(200).send(JSON.stringify(cases));
};

const updateCase = async (req, res, next) => {
	const body = req.body.case;

	const client = await mongoose.connect('mongodb://localhost/sse-test', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});

	const collection = await client.connection.collection('cases');

	console.log(body);

	const newCase = await collection.findOneAndUpdate(
		{
			_id: body._id,
		},
		{
			$set: body,
		},
		{ new: true, upsert: true, returnOriginal: false },
	);

	events.trigger();

	res.status(200).send({ ...newCase });
};

module.exports = { getCases, updateCase };
