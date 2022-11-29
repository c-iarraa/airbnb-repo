const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');


const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { notifyAboutExistingFile } = require('sequelize-cli/lib/helpers/view-helper');
// ...


// GET ALL CURRENT USERS BOOKINGS
router.get('/current', requireAuth, async(req, res)=> {
    const userId = req.user.id
    const currentUsersBookings = await Booking.findAll({
      where: {
        userId
      },
      include: {
        model: Spot,
        include: {
          model: SpotImage
        }
      }
    });

    const bookingsList = []
    currentUsersBookings.forEach(booking => {
      bookingsList.push(booking.toJSON())
    });

    bookingsList.forEach(booking=> {
      delete booking.Spot.description
      delete booking.Spot.createdAt
      delete booking.Spot.updatedAt
      if (booking.Spot.SpotImages.preview){
        booking.Spot.previewImage = booking.Spot.SpotImages.url
      } else{
        booking.Spot.previewImage = 'there is no prevewImage available at this time'
      }
      delete booking.Spot.SpotImages
    });

    const obj = {}
    obj.Bookings = bookingsList
    res.json(obj)
  });

// --------------------------------------------------------------------------------------------------

// EDIT A BOOKING

router.put('/:bookingId', requireAuth, async(req, res)=> {
    const bookingId = req.params.bookingId;
    const { startDate, endDate } = req.body;
    const specificBooking = await Booking.findByPk(bookingId);

    if (!startDate || !endDate) {
        res.status(400).json ({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
              "endDate": "endDate cannot come before startDate"
            }
          });
    };

    if (!specificBooking) {
      res.status(404).json({
        "message": "Booking couldn't be found",
        "statusCode": 404
      });
    };


    specificBooking.set({ startDate, endDate });
    specificBooking.save()
    res.json(specificBooking)
  });


// --------------------------------------------------------------------------------------------------

// DELETE A BOOKING

router.delete('/:bookingId', requireAuth, async(req, res)=> {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findOne({
      where: {
        id: bookingId
      }
    });

    if (!booking){
      return res.status(404).json({
        "message": "Review Image couldn't be found",
        "statusCode": 404
      });
    };

    if (booking.userId !== req.user.id){
      return res.status(403).json({
        "message": "You are not the owner of this spot",
        "statusCode": 403
      });
    };

      await booking.destroy()
      return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
      });

  });




module.exports = router;
