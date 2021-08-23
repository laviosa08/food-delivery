const fs = require('fs');
const StreamArray = require( 'stream-json/streamers/StreamArray');

const json2CsvCtrl = require('../services/json2Csv');
const restaurantCtrl = require('../services/restaurant').default;

const fields = ['cash_balance', 'name'];
const opts = { fields };
const jsonStream = StreamArray.withParser();
let menuItemsJson = [];
//internal Node readable stream option, pipe to stream-json to convert it
fs.createReadStream('../restaurant_with_menu.json').pipe(jsonStream.input);

jsonStream
  .on('data', ({key, value}) => { 
    console.log(key,value)  
    let eachMenuItemJson = value.menu
    
    eachMenuItemJson.forEach(dish => {
      let menuItem = {}
      menuItem.restaurant_id = restaurantCtrl.getRestaurantId(value.restaurantName);
    //   menuItem.dish_name = dish.dishName;
    //   menuItem.restaurant_name = dish.price;
    //   menuItemsJson.push(menuItem)
    console.log("menuItem.restaurant_id",menuItem.restaurant_id)
    }); 
    // let restaurant = {}
    // restaurant.name = value.restaurantName;
    // restaurant.cash_balance = value.cashBalance;
    // restaurantsJson.push(restaurant);
  })
  .on('end', () => {
    console.log(restaurantsJson);
    // let fileName = "restaurant.csv"
    // json2CsvCtrl.jsonToCSV(restaurantsJson,opts,fileName);
  });


