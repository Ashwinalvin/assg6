// import the restaurant model
const Restaurant = require('../models/rest');

// export the controller functionality

exports.getAllRestaurants = (req, res) => {
    Restaurant.find().then(result => {
        res.status(200).json({
            message: "Restaurants fetched",
            restaurants: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

exports.getRestaurantsByLocation = (req, res) => {
    const cityName = req.params.cityName;
    Restaurant.find({ city: cityName }).then(result => {
        res.status(200).json({
            message: `Restaurants fetched for city : ${cityName}`,
            restaurants: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

exports.getRestaurantsById = (req, res) => {
    const restaurantId = req.params.restaurantId;
    Restaurant.find({ _id: restaurantId }).then(result => {
        res.status(200).json({
            message: `Restaurant fetched for id : ${restaurantId}`,
            restaurant: result[0]
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

exports.filterRestaurants = (req, res) => {
    const {
        mealtype,
        location,
        cuisine,
        lcost,
        hcost,
        sort,
        page
    } = req.body;

    let filters = {};

    // add logic to apply filters

    if (mealtype) {
        filters.mealtype_id = mealtype;
    }

    if (location) {
        filters.location_id = location;
    }

    if (cuisine && cuisine.length > 0) {
        filters['cuisine.name'] = {
            $in: cuisine
        }
    }

    if (hcost && lcost) {
        if (lcost == 0) {
            filters.min_price = {
                $lt: hcost
            }
        } else {
            filters.min_price = {
                $gt: lcost,
                $lt: hcost
            }
        }
    }

    Restaurant.find(filters).sort({ min_price: sort }).then(result => {

        // result array can have any number of items (may be 20, 12, 5, 7, 200)
        // as per design we only show 2 items per page
        // e.g. if user passes page = 1, then we need to send index 0,1 of result array
        // if user passes page = 2, then we need to send the index 2,3 of the result array
        // if user passes page = 3, then we need to send the index 4,5 of the result array
        // Learner Assignment 5: to add the pagination logic
        //.sort({ min_price: sort })
        const pageSize = 4;
        let tempArray = [];

        function paginate(arr, page_size, page_no) {
            let paginatedResult = [];
        
            if(page_no==1){
               paginatedResult = arr.slice(0,4);
            }
            if(page_no==2){
                paginatedResult = arr.slice(4,8);
             }
             if(page_no==3){
                paginatedResult = arr.slice(8,12);
             }
             if(page_no==4){
                paginatedResult = arr.slice(12,16);
             }
             if(page_no==5){
                paginatedResult = arr.slice(16,20);
             }
           
             else{
                 paginatedResult = result;
             }
            return paginatedResult;
        }

        tempArray = paginate(result, pageSize, page);
        
        res.status(200).json({
            message: "sorted by price ,Totally 20 items are present in my restuarnt.Totally 5 pages are present each page has 4 items",
            restaurants: tempArray
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}