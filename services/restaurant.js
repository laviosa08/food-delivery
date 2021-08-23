const restaurantModel  = require('../models/restaurant');

const restaurantCtr = {};

restaurantCtr.listOpenResturants = (req,res) => {
	
}

restaurantCtr.search = (req,res) => {
	
}

restaurantCtr.listResturantsByPriceRange = (req,res) => {
	
}

restaurantCtr.getRestaurantId = async (restaurantName)=> {
    const restaurant_id = await restaurantModel.getRestaurantId(restaurantName);
    return restaurant_id;
}

module.exports = restaurantCtr;