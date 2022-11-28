const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review } = require('../../db/models');


const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { notifyAboutExistingFile } = require('sequelize-cli/lib/helpers/view-helper');
// ...

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
                res.status(403).json({
                    "message": "User already has a review for this spot",
                    "statusCode": 403
                })
            }
        }

    if (!stars || !review) {
        res.json({
            "message": "Validation error",
            "statusCode": 400,
            errors: {
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
            res.json(
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
    const specificSpot = await Spot.findByPk(spotId);

    spotDetails.forEach(el => {
        if (!el) {
            res.json({
                message: "Validation Error",
                statusCode: 400,
                errors: {
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
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

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
        res.json({
          message: "Validation Error",
          statusCode: 400,
          errors: {
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
router.get("/:spotId", requireAuth, async(req, res) => {
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
