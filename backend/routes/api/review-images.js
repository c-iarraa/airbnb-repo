const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');


const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { notifyAboutExistingFile } = require('sequelize-cli/lib/helpers/view-helper');
// ...



// DELETE A REVIEW IMAGE

router.delete("/:imageId", requireAuth, async(req, res) => {
    const reviewImageId = req.params.imageId;
    const image = await ReviewImage.findOne({
        where: {
        id: reviewImageId
        },
    });

    if (!image) {
        res.status(404).json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
          });
    };

    //   const review = await Review.findOne({
    //     where: {
    //       userId: image.reviewId
    //     }
    //   })

    //   if(review.userId !== req.user.id){
    //     const err = new Error('You are not the owner of this spot')
    //     err.status = 403
    //     throw err
    //   }

    await image.destroy();
    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
      });

});


module.exports = router;
