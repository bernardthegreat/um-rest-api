require('dotenv/config')

const { Client } = require('pg');
const pgConfig = new Client({
	connectionString: 'postgres://uhuxvcowhsuiyb:cb33d48d232eca3acaf98c60137b38a9f153e4524630547e671b216f9baece8f@ec2-54-236-137-173.compute-1.amazonaws.com:5432/d5mue47ps55ckg',
	ssl: {
		rejectUnauthorized: false
	}
});

module.exports = pgConfig