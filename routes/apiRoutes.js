const express = require('express');

const router = express.Router();
const userCtr = require('../services/user');
const restaurantCtr = require('../services/restaurant');


// API routes for user
router.post('/user/purchase', userCtr.purchase);


//API routes for resturant
router.get('/restaurant/open',restaurantCtr.listOpenResturants);
router.get('/restaurant/sortByPrice',restaurantCtr.listResturantsByPriceRange);
router.get('/restaurant/search',restaurantCtr.search);


module.exports = router;