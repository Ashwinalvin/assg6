// need the router from the express
const express = require('express');
const router = express.Router();


// import the controllers

const restaurantController = require('../Controller/rest_controller');



// declare the routes

router.get('/getAllRestaurants', restaurantController.getAllRestaurants);
router.get('/getRestaurantsByLocation/:cityName', restaurantController.getRestaurantsByLocation);
router.get('/getRestaurantsById/:restaurantId', restaurantController.getRestaurantsById);
router.post('/filterRestaurants', restaurantController.filterRestaurants)




// export the router
module.exports = router;