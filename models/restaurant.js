const restaurantDbClient = require('../config/database')
const restaurantModel = {};

restaurantModel.getOpenRestaurants = async (dayOfWeek,hourMin)=>{
    let queryString = 'SELECT opening_hours.restaurant_id, restaurants.name FROM opening_hours JOIN restaurants ON opening_hours.restaurant_id = restaurants.restaurant_id WHERE opening_hours."'+dayOfWeek+'"[1] > '+hourMin +' AND opening_hours."'+dayOfWeek+'"[2] < '+hourMin +' limit 10' ;
    return await restaurantModel.getQuery(queryString);
    
}

restaurantModel.searchRestaurants = async (searchString)=>{
    // let queryString = 'SELECT restaurants.restaurant_id, restaurants.name FROM restaurants WHERE to_tsvector(restaurants.name) @@ to_tsquery(\''+searchString+'\')'  ;
    let queryString = 'SELECT "restaurant_id" "restaurantId", "name" "restaurantName" FROM restaurants WHERE "name" ILIKE \'%'+searchString+'%\' ORDER  BY name ILIKE \'%'+searchString+'%\' OR NULL'  ;
    return await restaurantModel.getQuery(queryString);  
}

restaurantModel.searchDishes = async (searchString)=>{
    let queryString = 'SELECT restaurants."restaurant_id" "restaurantId", menu_items."dish_name" "dishName", restaurants."name" "restaurantName" FROM restaurants JOIN menu_items ON  menu_items."restaurant_id" = restaurants."restaurant_id" WHERE menu_items."dish_name" ILIKE \'%'+searchString+'%\''  ;
    return await restaurantModel.getQuery(queryString);
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
        queryString = 'select dishCounts."restaurant_id" as "restaurantId" , restaurants."name" as "restaurantName" from restaurants JOIN (select count(*), restaurant_id from menu_items where menu_items.price > '+startPrice+' AND menu_items.price < '+endPrice+' group by restaurant_id) as dishCounts ON dishCounts."restaurant_id" = restaurants."restaurant_id" where dishCounts."count" > '+numberOfDishes+' limit '+numberOfRestaurants;
    }else{
        queryString = 'select dishCounts."restaurant_id" as "restaurantId" , restaurants."name" as "restaurantName" from restaurants JOIN (select count(*), restaurant_id from menu_items where menu_items.price > '+startPrice+' AND menu_items.price < '+endPrice+' group by restaurant_id) as dishCounts ON dishCounts."restaurant_id" = restaurants."restaurant_id" where dishCounts."count" < '+numberOfDishes+' limit '+numberOfRestaurants;
    }
    
    return await restaurantModel.getQuery(queryString);
}


restaurantModel.getQuery = async (queryString)=>{
    let data = await restaurantDbClient
        .query(queryString)
        .then(result => {
            return result.rows
        })
        .catch(error => console.error(error.stack))
    return data;

}


module.exports = restaurantModel;