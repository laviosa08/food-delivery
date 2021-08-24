require('dotenv').config()

const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.set('port', process.env.SERVER_PORT);
app.use(bodyParser.urlencoded({extended: true})); //Parse URL-encoded bodies


const server = app.listen(
	process.env.SERVER_PORT, '0.0.0.0', () => {
	console.log(`Express server listening on port ${process.env.SERVER_PORT}`);
});


// CORS - Handelling
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Request-Headers', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
  } else {
    next();
  }
});


// Router
app.use('/', require('./routes/apiRoutes'));

module.exports = app; // for testing
