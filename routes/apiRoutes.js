const express = require('express');

const router = express.Router();
const userCtr = require('../services/user')
const resturantCtr = require('../services/resturant')


// API routes for user
router.use('/user/purchase', userCtr.purchase);


//API routes for resturant
router.use('/resturant/open',resturantCtr.listOpenResturants);
router.use('/resturant/sortByPrice',resturantCtr.listResturantsByPriceRange);
router.use('/resturant/search',resturantCtr.search)


module.exports = router