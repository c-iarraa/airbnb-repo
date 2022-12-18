import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from 'react';
import { getReviews } from '../../store/reviews';
import { NavLink, Route, useParams, useHistory } from 'react-router-dom';
import { getSpot } from '../../store/spots';
import './ReviewsForSpot.css';

const ReviewsForSpot = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const reviewSelector = useSelector(state => state.reviews.allReviews);
    const sessionUser = useSelector(state => state.session.user) //session user
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    const [numRating, setNumRating] = useState("");


    useEffect(() => {
        dispatch(getReviews(spotId))
    }, [spotId]);

    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [spotId]);


    if (!reviewSelector.SpotImages) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
          review,
          stars,
        //   numRatings
        };


    };


    return (
        <>
    </>
    )
  }

  export default ReviewsForSpot;




// - [ DONE ] Import this component to your App.js


// - [ ] Manipulate data to render the components onto your app
