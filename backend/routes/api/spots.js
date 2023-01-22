const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking} = require('../../db/models');


const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationerrorsObj } = require('../../utils/validation');
const { notifyAboutExistingFile } = require('sequelize-cli/lib/helpers/view-helper');
const { json } = require('sequelize');
// ...

// DELETE A SPOT IMAGE
router.delete('/:spotId', requireAuth, async (req, res) => {
        const spotId = req.params.spotId;
        const specficSpot = await Spot.findOne({
            where: {
                id: spotId
            }
        });

        // if (specficSpot.ownerId !== req.user.id) {
        //     const err = new Error('You are not the owner of this spot')
        //     err.status = 403
        //     throw err
        // }

        if (!specficSpot) {
            res.status(404).json({
                "message": "Spot Image couldn't be found",
                "statusCode": 404
              })
        }

        await specficSpot.destroy()
        res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    })

// --------------------------------------------------------------------------------------------------

// GET ALL BOOKINGS FOR A SPOT BY ID

router.get('/:spotId/bookings', requireAuth, async(req, res)=> {
    const spotId = req.params.spotId;
    const spotBookings = await Booking.findAll({
      where: {
        spotId
      },
      include: {
          model: User
        }
    });

    if (!spotBookings.length){
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    }

    const bookingsList = []
    spotBookings.forEach(booking => {
      bookingsList.push(booking.toJSON())
    });

    bookingsList.forEach(booking => {
      delete booking.User.username;
    });

    const obj = {}
    obj.Bookings = bookingsList
    res.json(obj)

  });




// --------------------------------------------------------------------------------------------------

// CREATE A BOOKING BASED ON SPOT ID

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = +req.params.spotId;
    const userId = req.user.id;
    const { startDate, endDate } = req.body;
    const dataArray = [startDate, endDate];
    dataArray.forEach(el => {
        if (!el) {
            res.status(403).json({
                "message": 'start and end date need to be filled',
                "statusCode": 403
            });
        };
    });

    const specificSpot = await Spot.findByPk(spotId);

    if (!specificSpot) {
        res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            });
    };

    if (endDate <= startDate) {
        res.status(400);
        return res.status(400).json({
            "message": "Validation error",
            "statusCode": 400,
            "errorsObj": [
                "endDate cannot be on or before startDate"
            ]
        });
    };

    const specificSpotBookings = await Booking.findAll({
        where: {
            spotId
        }
    });

    for (let booking of specificSpotBookings) {
        booking = JSON.parse(JSON.stringify(booking))

        if (startDate == booking.startDate || endDate == booking.endDate) {
            res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errorsObj": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            });
        };


        if (startDate < booking.endDate && startDate > booking.startDate) {
            res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errorsObj": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            });
        };


        if (endDate < booking.endDate && endDate > booking.startDate) {
            res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errorsObj": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            });
        };
    };

    const createNewBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
    });

    res.json(createNewBooking);

});



// --------------------------------------------------------------------------------------------------


//GET REVIEWS BY SPOT ID
router.get('/:spotId/reviews', async(req, res)=> {
    const spotId = req.params.spotId;
    const selectedReview = await Review.findAll({
      where: {
        spotId
      },
      include: [
        {
          model: User
        },
        {
          model: ReviewImage
        }
      ]
    });

    // if(!selectedReview.length){
    //   res.status(404).json({
    //     "message": "Spot couldn't be found",
    //     "statusCode": 404
    //   });
    // }


    let reviewsList = []
    selectedReview.forEach(review => {
        reviewsList.push(review.toJSON())
    });

    reviewsList.forEach(review => {
      delete review.User.username

      review.ReviewImages.forEach(img => {
        delete img.reviewId
        delete img.createdAt
        delete img.updatedAt
      });
    });



    const obj = {}
    obj.Reviews = reviewsList
    res.json(obj)
  });

// --------------------------------------------------------------------------------------------------


//CREATE A REVIEW FOR A SPOT
router.post('/:spotId/reviews', requireAuth, async(req,res) => {
        const currentUser = req.user.id
        const currentSpot = req.params.spotId
        const {review, stars} = req.body
        const currentSpotWhere = await Review.findAll({
            where: {
                spotId: currentSpot
            }

        })
        const spot = await Spot.findAll({
            where: {
                id: currentSpot
            }
        })
        if(!spot.length){
            res.status(404).json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }

        for(let review of currentSpotWhere){
            if(review.userId === currentUser){
                return res.status(403).json({
                    "message": "User already has a review for this spot",
                    "statusCode": 403
                })
            }
        }

    if (!stars || !review) {
        res.status(400).json({
            "message": "Validation error",
            "statusCode": 400,
            errorsObj: {
                "review": "Review text is required",
                "stars": "Stars must be an integer from 1 to 5"
            }
        })
    }

    const createReview = await Review.create({userId: req.user.id, spotId: currentSpot, review, stars})

    res.json(createReview);


});


// --------------------------------------------------------------------------------------------------

//ADD AN IMAGE TO A SPOT BASED ON THE SPOT'S ID
router.post('/:spotId/images', requireAuth, async(req, res) => {
    const spotId = req.params.spotId;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId)
        if(!spot){
            res.status(404).json(
            {
                message: "Spot couldn't be found",
                statusCode: 404
            }
        )
    }

    const image = await SpotImage.create({
        spotId,
        url,
        preview
      });

        const finalImage = {
            id: image.id,
            url: image.url,
            preview: image.preview
        }

        res.json(finalImage);
});


// --------------------------------------------------------------------------------------------------

// EDIT A SPOT
router.put('/:spotId', requireAuth, async (req, res)=> {
    const spotId = req.params.spotId
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const spotDetails = [address, city, state, country, lat, lng, name, description, price];
    const specificSpot = await Spot.findByPk(spotId)

    spotDetails.forEach(el => {
        if (!el) {
            res.status(400).json({
                message: "Validation Error",
                statusCode: 400,
                errorsObj: {
                address: "Street address is required",
                city: "City is required",
                state: "State is required",
                country: "Country is required",
                lat: "Latitude is not valid",
                lng: "Longitude is not valid",
                name: "Name must be less than 50 characters",
                description: "Description is required",
                price: "Price per day is required"
                }
            });
        }
    });

    if(!specificSpot){
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    // if ( !== specificSpot.ownerId){
    //     const err = new Error('You are not authorized to edit this spot');
    //     err.status = 403
    //     throw err;
    // }



    specificSpot.set({address, city, state, country, lat, lng, name, description, price})
    specificSpot.save();
    res.json(specificSpot);
})

// --------------------------------------------------------------------------------------------------

// CREATE A SPOT
router.post('/', requireAuth, async(req, res)=> {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const spotDetails = [address, city, state, country, lat, lng, name, description, price]

    spotDetails.forEach(details => {
      if(!details){
        res.status(400).json({
          message: "Validation Error",
          statusCode: 400,
          errorsObj: {
            address: "Street address is required",
            city: "City is required",
            state: "State is required",
            country: "Country is required",
            lat: "Latitude is not valid",
            lng: "Longitude is not valid",
            name: "Name must be less than 50 characters",
            description: "Description is required",
            price: "Price per day is required"
          }
        });
      }
    });
    const newSpot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    res.json(newSpot);
  })

// --------------------------------------------------------------------------------------------------

//GET ALL SPOTS OWNED BY THE CURRENT USER
router.get('/current', requireAuth, async(req,res) => {
    const currentUserId = req.user.id
    const currentUserSpot = await Spot.findAll({
        where: {
            ownerId: currentUserId
        }, include:[
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })
    const spotsList = []
    currentUserSpot.forEach(element =>
        spotsList.push(element.toJSON())
    )


    //current user avg rating
    spotsList.forEach(spots => {
        let starsReview = []
        spots.Reviews.forEach(element => {
            if(element.stars){
                starsReview.push(element.stars)
            }  delete spots.Reviews

            totalStars = starsReview.reduce((a,b) => a + b)
            spots.avgRating = totalStars/starsReview.length
            if(!spots.avgRating){
                spots.avgRating = 'There are no ratings for this location at this time'
              }
        })
    })

    // preview image code
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url
            };
        });

        if (!spot.previewImage) {
            spot.previewImage = "no preview image found"
        }
        delete spot.SpotImages
    });
    res.json(spotsList);

});


// --------------------------------------------------------------------------------------------------

//GET DETAILS OF A SPOT FROM AN ID
router.get("/:spotId", async(req, res) => {
    const selectedSpot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: User
            },
            {
                model: SpotImage
            },
            {
                model: Review
            }
        ]
    });

    if(!selectedSpot){
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }

    const jsonSelectedSpot = selectedSpot.toJSON()

    jsonSelectedSpot.SpotImages.forEach(el => {
        delete el.spotId;
        delete el.createdAt;
        delete el.updatedAt;
    });

    jsonSelectedSpot.Owner = {
        id: jsonSelectedSpot.User.id,
        firstName: jsonSelectedSpot.User.firstName,
        lastName: jsonSelectedSpot.User.lastName
    }

    const stars = [];
    let total = 0
    jsonSelectedSpot.Reviews.forEach(el => {
        if (el.stars) {
            stars.push(el.stars)
            total += el.stars
        }
    })

    jsonSelectedSpot.avgStarRating = total/stars.length;

    jsonSelectedSpot.numReviews = stars.length;

    delete jsonSelectedSpot.User;
    delete jsonSelectedSpot.Reviews;



    res.json(jsonSelectedSpot)

});

// --------------------------------------------------------------------------------------------------

// GET ALL SPOTS
router.get("/",  async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    let errorsObj = {}
    let errorMarker = false

    if (page && page < 1){
        errorsObj.page = "Page must be greater than or equal to 1"
        errorMarker = true
    }

    if (page && !Number.isInteger(parseInt(page))){
        errorsObj.page = "Page must be greater than or equal to 1"
        errorMarker = true
    }

    if (size && size < 1){
        errorsObj.size = "Size must be greater than or equal to 1"
        errorMarker = true
    }

    if (size && !Number.isInteger(parseInt(size))){
        errorsObj.size = "Size must be greater than or equal to 1"
        errorMarker = true
    }

    if (maxLat && maxLat.indexOf('.') === -1){
        errorsObj.maxLat = "Maximum latitude is invalid"
        errorMarker = true
    }

    if (maxLat && !Number.isInteger(parseInt(maxLat))){
        errorsObj.minLat = "Maximum latitude is invalid"
        errorMarker = true
    }

    if (minLat && !Number.isInteger(parseInt(minLat))){
        errorsObj.minLat = "Minimum latitude is invalid"
        errorMarker = true
    }

    if (minLat && minLat.indexOf('.') === -1){
        errorsObj.minLat = "Minimum latitude is invalid"
        errorMarker = true
    }

    if (minLng && minLng.indexOf('.') === -1){
        errorsObj.minLng = "Minimum longitude is invalid"
        errorMarker = true
    }

    if (minLng && !Number.isInteger(parseInt(minLng))){
        errorsObj.minLng = "Minimum longitude is invalid"
        errorMarker = true
    }

    if (maxLng && maxLng.indexOf('.') === -1){
        errorsObj.maxLng = "Maximum longitude is invalid"
        errorMarker = true
    }

    if (maxLng && !Number.isInteger(parseInt(maxLng))){
        errorsObj.maxLng = "Maximum longitude is invalid"
        errorMarker = true
    }

    if (minPrice && parseInt(minPrice) <= 0){
        errorsObj.minPrice = "Minimum price must be greater than or equal to 0"
        errorMarker = true
    }

    if (minPrice && !Number.isInteger(parseInt(minPrice))){
        errorsObj.minPrice = "Minimum price must be greater than or equal to 0"
        errorMarker = true
    }

    if (maxPrice && parseInt(maxPrice) <= 0){
        errorsObj.maxPrice = "Maximum price must be greater than or equal to 0"
        errorMarker = true
    }

    if (maxPrice && !Number.isInteger(parseInt(maxPrice))){
        errorsObj.maxPrice = "Maximum price must be greater than or equal to 0"
        errorMarker = true
    }

    if (errorMarker === true){
        return res.status(400).json({
            message: "Validation Error",
            "statusCode": 400,
            errorsObj
          });
    };

    if (!page){
        page = 1
    };

    if (page >= 10){
        page = 10
    };

    if (!size || size >= 20){
        size = 20
    };

    let paginationObj = {};

    page = parseInt(page)
    size = parseInt(size)

    if (page >= 1 && size >= 1){
        paginationObj.limit = size,
        paginationObj.offset = size*(page-1)
    }

    let where = {}

    if (maxLat && minLat){
        where.lat = {
            [Op.between]: [minLat, maxLat]
        }
    }

    if (maxLat && !minLat){
        where.lat = {
            [Op.lte]: maxLat
        }
    }

    if (minLat && !maxLat){
        where.lat = {
            [Op.gte]: minLat
        }
    }

    if (maxLng && minLng){
        where.lng = {
            [Op.between]: [minLng, maxLng]
        }
    }

    if (maxLng && !minLng){
        where.lng = {
            [Op.lte]: maxLng
        }
    }

    if (minLng && ! maxLat){
        where.lng = {
            [Op.gte]: minLng
        }
    }

    if (maxPrice && minPrice){
        where.price = {
            [Op.between]: [minPrice, maxPrice]
        }
    }

    if (maxPrice && !minPrice){
        where.price = {
            [Op.lte]: maxPrice
        }
    }

    if (minPrice && !maxPrice){
        where.price = {
            [Op.gte]: minPrice
        }
    }

    console.log(where)
  let spots = await Spot.findAll({
    include: [
        {
        model: Review
        },
        {
        model: SpotImage
    }
],
    ...paginationObj
  });

    // spots.toJSON()
    // console.log(spots)
  let spotsList = []
  spots.forEach(spot => {
    spotsList.push(spot.toJSON())
  })

  spotsList.forEach(spot => {
      let totalStars = 0
    spot.Reviews.forEach(review => {
        totalStars += review.stars
    })
    spot.avgRating = totalStars/spot.Reviews.length
    delete spot.Reviews
  })

  spotsList.forEach(spot => {
    spot.SpotImages.forEach(image => {
        if (image.preview === true){
            spot.previewImage = image.url
        }
    })
    if (!spot.previewImage){
        spot.previewImage = 'No preview image found'
    }
    delete spot.SpotImages
  })

  return res.json({
    Spots: spotsList,
    page,
    size
  });
});


router.get("/", async(req, res) => {



    const spots = await Spot.findAll({
        include: [
            {
                model: SpotImage
            },
            {
                model: Review
            }
        ]
    });

    // spots.toJSON()
    // console.log(spots)
    let spotsList = [];
    spots.forEach(spot => {
        spotsList.push(spot.toJSON()); // basically converts to javascript so we can edit/make changes to code
    });

    spotsList.forEach(spot => {
        const stars = [];
        if(!spot.Reviews.length) {
            spots.ratings = "No ratings at the moment"
            // delete spots.Reviews
        }

        spot.Reviews.forEach(el => {
            // console.log(el.stars)
            // const avgRating = [];
            if (el.stars) {
                stars.push(el.stars)
            } else {
                spots.avgRating = 'No Ratings Yet'
            }
            // console.log(stars)
            let total = stars.reduce((previous, current) => previous + current );
            // console.log(total/stars.length)
            spot.avgRating = total/stars.length
            if(!spots.avgRating){
                spots.avgRating = 'There are no ratings for this location at this time'
              }
        })
        delete spot.Reviews
    });

    // preview image code
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            // console.log(image.preview)
            if (image.preview === true) {
                // console.log(image)
                spot.previewImage = image.url
            };
        });

        if (!spot.previewImage) {
            spot.previewImage = "no preview image found"
        }
        delete spot.SpotImages
    });
    res.json(spotsList);

});






module.exports = router;
