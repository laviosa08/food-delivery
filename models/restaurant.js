require('../config/database.js');
const restaurantDbClient = require('../config/database')
const restaurantModel = {};

restaurantModel.getRestaurantId = async (restaurantName)=>{
    let queryString = 'SELECT id FROM restaurants where restaurant_name ='+restaurantName;
    restaurantDbClient.query(queryString, (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
          console.log(JSON.stringify(row));
        }
        restaurantDbClient.end();
      })
      
}

module.exports = restaurantModel;