const restaurantModel  = require('../models/restaurant');

const restaurantCtr = {};

restaurantCtr.listOpenResturants = async (req,res) => {
    //assuming default itemsPerPage is 10 if not provided by client
    let itemsPerPage = (typeof req.query.itemsPerPage !== "undefined")?req.query.itemsPerPage:10;
    
    //pagination
    const page = req.params.page;
    let limit = itemsPerPage;
    let offset = (page - 1) * itemsPerPage;

    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    //Input datetime as timestamp
    let dateTime = req.params.dateTime;
    
    //Fetch day and time from timestamp
    let date = new Date(parseInt(dateTime));
    let dayOfWeek = days[date.getDay()];
    let hours = date.getHours();
    let mins = date.getMinutes();
    
    //convert time to int format as per db column
    let hourMin = (hours*100)+mins;
    
    // fetch data and send response
    restaurantModel.getOpenRestaurants(dayOfWeek,hourMin, limit, offset)
    .then((openRestaurants)=>{
        return res.status(200).json({ msg: "Success", openRestaurants: openRestaurants});
    })
  
}

restaurantCtr.search = async (req,res) => {
    //assuming default itemsPerPage is 10 if not provided by client
    let itemsPerPage = (typeof req.query.itemsPerPage !== "undefined")?req.query.itemsPerPage:10;

    //get input string from user
    let searchString = req.query.searchString;
   
    //pagination
    const page = req.params.page;
    let limit = itemsPerPage;
    let offset = (page - 1) * itemsPerPage;
    
    //fetch restaurants matching search string
    let restaurants = await restaurantModel.searchRestaurants(searchString, limit, offset)
    .then((result)=>{
        return result;
    })

    //fetch dishes matching search string
    let dishes = await restaurantModel.searchDishes(searchString, limit, offset)
    .then((result)=>{
        return result;
    })

    return res.status(200).json({ msg: "Success", restaurants: restaurants, dishes: dishes});
}

restaurantCtr.listResturantsByDishPriceRange = async (req,res) => {
    const dataObject = req.body;

    //fetch restaurants id having dishes within given price range
    let restaurants = await restaurantModel.getrestaurantsByDishesInPriceRange(dataObject)
    .then((result)=>{
        return result;
    })
    return res.status(200).json({ msg: "Success", restaurants: restaurants});
}

module.exports = restaurantCtr;
