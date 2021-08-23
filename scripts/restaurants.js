const fs = require('fs');
const StreamArray = require( 'stream-json/streamers/StreamArray');

const json2CsvCtrl = require('../services/json2Csv');

const fields = ['cash_balance', 'name'];
const opts = { fields };
const jsonStream = StreamArray.withParser();
let restaurantsJson = [];
//internal Node readable stream option, pipe to stream-json to convert it
fs.createReadStream('../restaurant_with_menu.json').pipe(jsonStream.input);

jsonStream
  .on('data', ({key, value}) => {    
    let restaurant = {}
    restaurant.name = value.restaurantName;
    restaurant.cash_balance = value.cashBalance;
    restaurantsJson.push(restaurant);
  })
  .on('end', () => {
    console.log(restaurantsJson);
    let fileName = "restaurant.csv"
    json2CsvCtrl.jsonToCSV(restaurantsJson,opts,fileName);
  });