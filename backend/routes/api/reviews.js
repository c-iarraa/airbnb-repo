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
        res.json(
        {
            message: "Review couldn't be found",
            statusCode: 404
        }
        )
    }

    if (review.ReviewImage.length >= 10) {
        res.json({
            "message": "Maximum number of images for this resource was reached",
            statusCode: 403
        });
    }

    const image = await ReviewImage.create({
        reviewId,
        url
    });

    const finalReviewImage = {
        url: image.url
    }

    imageJson = finalReviewImage.toJSON();
    delete imageJson.reviewId;
    delete imageJson.createdAt;
    delete imageJson.updatedAt;

    res.json(imageJson);
});

// --------------------------------------------------------------------------------------------------

// GET REVIEWS OF CURRENT USER
router.get("/current", async(req, res) => {
    const currentUserId = req.user.id;
    const currentUserReviews = await Review.findAll({
        where: {
            currentUserId
        },
        include: [
            {
                model: Spot
            },
            {
                model: ReviewImage
            }
        ]
    });

})

// --------------------------------------------------------------------------------------------------

//GET REVIEWS BY SPOT ID

// --------------------------------------------------------------------------------------------------

// EDIT A REVIEW

// --------------------------------------------------------------------------------------------------




module.exports = router;
