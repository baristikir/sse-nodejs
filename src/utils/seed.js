// require the necessary libraries
const mongoose = require('mongoose');
const faker = require('faker');
const { Db } = require('mongodb');
const User = require('../models/case');
function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}
async function seedDB() {
	// Connection URL
	const uri = 'mongodb://localhost/sse-test';
	const client = await mongoose.connect(uri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
	try {
		console.log('Connected correctly to server');
		const collection = client.connection.db.collection('cases');
		// The drop() command destroys all data from a collection.
		// Make sure you run it against proper database and collection.
		collection.drop();
		// make a bunch of time series data
		let timeSeriesData = [];
		for (let i = 0; i < 40; i++) {
			const firstName = faker.name.firstName();
			const lastName = faker.name.lastName();
			let newDay = {
				timestamp_day: faker.date.past(),
				case: faker.random.word(),
				issuer: {
					email: faker.internet.email(firstName, lastName),
					firstName,
					lastName,
				},
				events: [],
			};
			for (let j = 0; j < randomIntFromInterval(1, 6); j++) {
				let newEvent = {
					timestamp_event: faker.date.past(),
					weight: randomIntFromInterval(14, 16),
				};
				newDay.events.push(newEvent);
			}
			timeSeriesData.push(newDay);
		}
		await collection.insertMany(timeSeriesData);
		console.log('Database seeded! :)');
		await client.connection.close();
	} catch (err) {
		console.log(err.stack);
	}
}
seedDB();
