const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://bisvqxddydbnez:3dc255ef9b5c5bccef8ee859a71f9966c1c2c0c85b26536ff2dba56ddf331273@ec2-44-195-247-84.compute-1.amazonaws.com:5432/d3modlhmu1g23s',
  ssl: {
  rejectUnauthorized: false
  }
 });

 client.connect();


module.exports = client;


