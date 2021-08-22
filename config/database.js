const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});


