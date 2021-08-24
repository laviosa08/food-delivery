const restaurantDbClient = require('../config/database')
const restaurantModel = {};

restaurantModel.getOpenRestaurants = async (dayOfWeek,hourMin)=>{
    let queryString = 'SELECT opening_hours.restaurant_id, restaurants.name FROM opening_hours JOIN restaurants ON opening_hours.restaurant_id = restaurants.restaurant_id WHERE opening_hours."'+dayOfWeek+'"[1] > '+hourMin +' AND opening_hours."'+dayOfWeek+'"[2] < '+hourMin +' limit 10' ;
    return await restaurantModel.executeQuery(queryString);
    
}

restaurantModel.searchRestaurants = async (searchString)=>{
    // let queryString = 'SELECT restaurants.restaurant_id, restaurants.name FROM restaurants WHERE to_tsvector(restaurants.name) @@ to_tsquery(\''+searchString+'\')'  ;
    let queryString = 'SELECT "restaurant_id" "restaurantId", "name" "restaurantName" FROM restaurants WHERE "name" ILIKE \'%'+searchString+'%\' ORDER  BY name ILIKE \'%'+searchString+'%\' OR NULL'  ;
    return await restaurantModel.executeQuery(queryString);  
}

restaurantModel.searchDishes = async (searchString)=>{
    let queryString = 'SELECT restaurants."restaurant_id" "restaurantId", menu_items."dish_name" "dishName", restaurants."name" "restaurantName" FROM restaurants JOIN menu_items ON  menu_items."restaurant_id" = restaurants."restaurant_id" WHERE menu_items."dish_name" ILIKE \'%'+searchString+'%\''  ;
    return await restaurantModel.executeQuery(queryString);
}

restaurantModel.getrestaurantsByDishesInPriceRange = async ({
    numberOfRestaurants,
    numberOfDishes,
    startPrice,
    endPrice,
    moreOrLess
    })=>{
    let queryString = "";
    if(moreOrLess == "more"){
        queryString = 'SELECT dishCounts."restaurant_id" as "restaurantId" , restaurants."name" as "restaurantName" FROM restaurants JOIN (SELECT COUNT(*), restaurant_id FROM menu_items WHERE menu_items.price > '+startPrice+' AND menu_items.price < '+endPrice+' GROUP BY restaurant_id) as dishCounts ON dishCounts."restaurant_id" = restaurants."restaurant_id" WHERE dishCounts."count" > '+numberOfDishes+' LIMIT '+numberOfRestaurants;
    }else{
        queryString = 'SELECT dishCounts."restaurant_id" as "restaurantId" , restaurants."name" as "restaurantName" FROM restaurants JOIN (SELECT COUNT(*), restaurant_id FROM menu_items WHERE menu_items.price > '+startPrice+' AND menu_items.price < '+endPrice+' GROUP BY restaurant_id) as dishCounts ON dishCounts."restaurant_id" = restaurants."restaurant_id" WHERE dishCounts."count" < '+numberOfDishes+' LIMIT '+numberOfRestaurants;
    }
    
    return await restaurantModel.executeQuery(queryString);
}

restaurantModel.getRestaurantName = async(restaurantId)=>{
    let queryString = 'SELECT name as "restaurantName" FROM restaurants WHERE restaurant_id = \''+restaurantId+'\'';
    return await restaurantModel.executeQuery(queryString);
}

restaurantModel.executeQuery = async (queryString)=>{
    let data = await restaurantDbClient
        .query(queryString)
        .then(result => {
            return result.rows
        })
        .catch(error => console.error(error.stack))
    return data;

}


module.exports = restaurantModel;