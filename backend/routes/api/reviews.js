const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage} = require('../../db/models');


const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { notifyAboutExistingFile } = require('sequelize-cli/lib/helpers/view-helper');
// ...

//CREATE AN IMAGE FOR A REVIEW
router.post('/:reviewId/images', requireAuth, async(req, res) => {

    const reviewId = req.params.reviewId;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId,
        {
            include: {
                model: ReviewImage
            }
        })

    if(!review){
        res.status(404).json(
        {
            message: "Review couldn't be found",
            statusCode: 404
        }
        )
    }

    if (review.ReviewImages.length >= 10) {
        res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            statusCode: 403
        });
    }

    const image = await ReviewImage.create({
        reviewId,
        url
    });

    const imageJson = image.toJSON();
    delete imageJson.reviewId;
    delete imageJson.createdAt;
    delete imageJson.updatedAt;

    res.json(imageJson);
});

// --------------------------------------------------------------------------------------------------

// GET REVIEWS OF CURRENT USER
router.get('/current', requireAuth, async(req, res)=> {
    const currentUserId = req.user.id;
    const currentUserReviews = await Review.findAll({
      where: {
        userId: currentUserId
      },
      include: [
        {
          model: User
        },
        {
          model: Spot,
          include: {
            model: SpotImage
          }
        },
        {
          model: ReviewImage
        }
      ]
    });

    const reviewsList = [];
    currentUserReviews.forEach(el => {
        reviewsList.push(el.toJSON());
    });

    reviewsList.forEach(review => {
        delete review.User.username

        review.ReviewImages.forEach(reviewImg => {
            delete reviewImg.reviewId,
            delete reviewImg.createdAt,
            delete reviewImg.updatedAt
        });
    });

    reviewsList.forEach(review => {
        delete review.Spot.description;
        delete review.Spot.createdAt;
        delete review.Spot.updatedAt;


        review.Spot.SpotImages.forEach(image => {
          if(image.preview){
            review.Spot.previewImage = image.url
          } else {
            review.Spot.previewImage = "There are no images at this time"
          }
        });
        delete review.Spot.SpotImages
      });

    const obj = { Reviews: reviewsList }

    res.json(obj)
});

// --------------------------------------------------------------------------------------------------

// EDIT A REVIEW
router.put("/:reviewId", requireAuth, async(req, res) => {
    const reviewId = req.params.reviewId;
    const { review, stars } = req.body;
    const specificReview = await Review.findByPk(reviewId);

    if (!review || !stars) {
        res.status(400).json ({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
              "review": "Review text is required",
              "stars": "Stars must be an integer from 1 to 5",
            }
        });
    }

    if (!specificReview) {
        res.status(404).json ({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    await specificReview.set({ review, stars });
    specificReview.save();
    res.json(specificReview);
});

// --------------------------------------------------------------------------------------------------

// DELETE A REVIEW
router.delete('/:reviewId', requireAuth, async(req, res)=> {
    const reviewId = req.params.reviewId;

    const review = await Review.findOne({
      where: {
        id: reviewId
      }
    })

    if(!review){
      return res.status(404).json({
        "message": "Review couldn't be found",
        "statusCode": 404
      })
    }

    if(review.userId !== req.user.id){
      const err = new Error('You are not the owner of this spot')
      err.status = 403
      throw err
    }

      await review.destroy()
      return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
      })


  })


module.exports = router;
