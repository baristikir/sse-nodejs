const mongoose = require('mongoose');
const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter a full name'],
			index: true,
		},

		email: {
			type: String,
			lowercase: true,
			unique: true,
			index: true,
		},

		password: String,

		salt: String,

		role: {
			type: String,
			default: 'user',
		},
	},
	{ timestamps: true },
);

const User = mongoose.model('User', schema);
module.exports = User;
