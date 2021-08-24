const express = require('express');
const dbClient = require('../config/database')


const router = express.Router();
const userCtr = require('../services/user');
const restaurantCtr = require('../services/restaurant');

//connect with db
dbClient.connect();

// API routes for user
router.post('/user/purchase', userCtr.purchaseDish);


//API routes for resturant
router.get('/restaurant/open/:dateTime',restaurantCtr.listOpenResturants);
router.post('/restaurant/restaurantsByDishPrice',restaurantCtr.listResturantsByDishPriceRange);
router.get('/restaurant/search',restaurantCtr.search);


module.exports = router;