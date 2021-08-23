const restaurantDbClient = require('../config/database')
const restaurantModel = {};

restaurantModel.getOpenRestaurants = async (dayOfWeek,hourMin)=>{
    console.log(hourMin)
    let queryString = 'SELECT opening_hours.restaurant_id, restaurants.name FROM opening_hours JOIN restaurants ON opening_hours.restaurant_id = restaurants.restaurant_id WHERE opening_hours."Mon"[1] > '+hourMin +' AND opening_hours."Mon"[2] < '+hourMin +' limit 10' ;
    return await restaurantModel.getQuery(queryString);
    
}

restaurantModel.getQuery = async (queryString)=>{
    await restaurantDbClient.connect();
    const result = await restaurantDbClient.query(queryString);
    await restaurantDbClient.end();
    return result.rows;
}


module.exports = restaurantModel;