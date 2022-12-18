import React, { useEffect, useState } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpot, deleteSpot } from '../../store/spots'
import { getReviews, createReview } from '../../store/reviews';


const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const spotSelector = useSelector(state => state.spots.oneSpot);
    const sessionId = useSelector(state => state.session.user.id) //session user id
    const [validationErrors, setValidationErrors] = useState([]);
    const spotReviews = useSelector(state => state.reviews.allReviews);
    const reviews = Object.values(spotReviews)

    const spotArr = Object.values(spotSelector)


    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [spotId]);

    useEffect(() => {
        dispatch(getReviews(spotId))
    }, [spotId]);


    if (!spotSelector.SpotImages) return null;

    const deleteSpecificSpot = async (e) => {
        e.preventDefault();
        await dispatch(deleteSpot(spotId))
        history.push('/')
    }

    const CreateReview = async (e) => {
        e.preventDefault();
        await dispatch(createReview(spotId))
        history.push('/${spotId}')
    }



      return (
        <nav>
            <div className='detailsDiv'>
            <ul className="review-errors">
                {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                ))}
            </ul>
                <h1 className='title'>{spotSelector.description}</h1>
                <h4><i class="fa-sharp fa-solid fa-star"></i> {spotSelector.avgStarRating} · {spotSelector.numReviews} reviews · Superhost · {spotSelector.city}, {spotSelector.state}, {spotSelector.country}</h4>
                <div className='image-container'>
                    {spotSelector.SpotImages.map((image) => (
                        <img className="specific-spot-img" key={image.id} src={image.url}/>
                    ))}
                </div>
                <h3 className='hosts-description'> Entire house hosted by Blaze and Ryder </h3>
                <div className='house-description'>
                    <h4> 8 guests · 4 bedrooms · 7 beds · 2.5 baths </h4>
                    <h4><i class="fa-regular fa-door-open"></i> Self check-in</h4>
                    <h4> Check yourself in with the lockbox.</h4>
                    <h4><i class="fa-thin fa-medal"></i> Blaze and Ryder are Superhosts</h4>
                    <h4> Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</h4>
                    <h4><i class="fa-light fa-calendar"></i> Free cancellation for 48 hours.</h4>
                </div>
                <div className='update&delete&-spot-div'>
                    {(spotSelector.ownerId === sessionId) &&
                    <div>
                        <div>
                            <NavLink to={`/spots/${spotSelector.id}/update`}>Update Spot</NavLink>
                        </div>
                        <div>
                            <button onClick={deleteSpecificSpot}>Delete Spot</button>
                        </div>
                    </div>
                    }
                </div>
                <div className='review-button'>
                    <NavLink to={`/spots/${spotId}/review`}>Create A Review</NavLink>
                </div>
                <ul className="spot-reviews">
                    {
                        reviews.map(review => (

                            <div className = 'review-values' key={review.id}>
                                <h3 className='review-text'>{review.review}</h3>
                                <h3 className='review-stars'>{review.stars}</h3>
                                {/* <h3 className='review-amount'>{review.}</h3> */}
                            </div>
                        ))
                    }
                    </ul>
            </div>
        </nav>
      )
}

    export default SpotDetails;
