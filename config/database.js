require('dotenv/config')

const { Client } = require('pg');
const pgConfig = new Client({
	connectionString: process.env.DB_CONNECTION_STRING,
	ssl: {
		rejectUnauthorized: false
	}
});

module.exports = pgConfig