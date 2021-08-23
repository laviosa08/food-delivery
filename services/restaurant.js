const restaurantModel  = require('../models/restaurant');

const restaurantCtrl = {};

restaurantCtrl.listOpenResturants = async (req,res) => {
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  //Input datetime as timestamp
  let dateTime = req.params.dateTime;
  
  
  //Fetch day and time from timestamp
  let date = new Date(parseInt(dateTime));
  let dayOfWeek = days[date.getDay()];
  let hours = date.getHours();
  let mins = date.getMinutes();
  
  //convert time to int format as per db col
  let hourMin = (hours*100)+mins;
  // fetch data
  restaurantModel.getOpenRestaurants(dayOfWeek,hourMin)
  .then((openRestaurants)=>{
    return res.status(200).json({ msg: "Success", openRestaurants: openRestaurants});
  })
  
}

restaurantCtrl.search = (req,res) => {
	
}

restaurantCtrl.listResturantsByPriceRange = (req,res) => {
	
}

module.exports = restaurantCtrl;