import React, { useEffect, useState } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpot, deleteSpot } from '../../store/spots'
import { getReviews, createReview, deleteReview } from '../../store/reviews';
import './SpotDetails.css';


const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const spotSelector = useSelector(state => state.spots.oneSpot);
    const sessionId = useSelector(state => state.session.user?.id) //session user id
    const reviewId = useSelector(state => state.reviews.allReviews);
    const [validationErrors, setValidationErrors] = useState([]);
    const reviews = Object.values(reviewId)
    // console.log(sessionId, 'hiiiiiii')

    const spotArr = Object.values(spotSelector)


    const handleSubmit = async (e) => {
        e.preventDefault();
    }



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

    // const deleteReview = (e) => {
    //     e.preventDefault()
    //     return dispatch(deleteReview(spotId))
    //     // history.push('/')
    // }




      return (
        <nav>
            <div className='detailsDiv'>
            <ul className="review-errors">
                {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                ))}
            </ul>
            <div className='above-img'>
                <h1 className='description' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>{spotSelector.description}</h1>
                <h4 className='description2' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><i class="fa-sharp fa-solid fa-star"></i>{spotSelector.avgStarRating} ?? {spotSelector.numReviews} reviews ?? Superhost ?? {spotSelector.city}, {spotSelector.state}, {spotSelector.country}</h4>
                </div>
                <div className='image-container'>
                    {spotSelector.SpotImages.map((image) => (
                        <img className="specific-spot-img" key={image.id} src={image.url}/>
                    ))}
                </div>
                <div className='house-description'>
                    <div className='below-img'>
                        <h3 className='hosts-description' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}> Entire house hosted by Blaze and Ryder </h3>
                        <h4 className='house-deets'style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><small> 8 guests ?? 4 bedrooms ?? 7 beds ?? 2.5 baths </small></h4>
                    </div>
                    <div className='basic-info'>
                    <div className='Check-in'>
                        <h4 className='self-checkin' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><i class="fa-solid fa-door-open fa-xl"></i> Self check-in</h4>
                        <h4 className='checkin-text' style={{color: 'rgb(120,120,120)', fontFamily: 'Geneva, Verdana, sans-serif'}}><small> Check yourself in with the lockbox.</small></h4>
                    </div>
                    <div className='superhost'>
                        <h4 className='owner-superhost'style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><i class="fa-solid fa-medal fa-xl"></i> Blaze and Ryder are Superhosts</h4>
                        <h4 className='superhost-text' style={{color: 'rgb(120,120,120)', fontFamily: 'Geneva, Verdana, sans-serif'}}><small> Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</small></h4>
                    </div>
                    <div className='cancellation'>
                        <h4 style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><i class="fa-regular fa-calendar fa-xl"></i> Free cancellation for 48 hours.</h4>
                    </div>
                    <div className='info-card'>
                        <h1 className='star-rating'><i class="fa-sharp fa-solid fa-star"></i>{spotSelector.avgStarRating}</h1>
                        <h1 className='price'>${spotSelector.price} a night</h1>
                    </div>
                    </div>
                </div>
                <div className='review-stuff'>
                <div>
                    <h2 className='reviews-tag' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>Reviews</h2>
                </div>
                <ul className="spot-reviews">
                    {reviews.map(review => (

                            <div className = 'review-values' key={review.id}>
                                <h3 className='review-text' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>{review.review}</h3>
                                <h3 className='review-stars' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>{review.stars}</h3>
                                <div className = 'delete-review-button'>
                                    {(review.userId === sessionId) &&
                                        <div>
                                            <div>
                                                <button onClick={ async (e) => {
                                                    e.preventDefault();
                                                    const deletedReview = await dispatch((deleteReview(review.id)))
                                                    // if (deletedReview) history.push(`/`)
                                                    .then (() => history.push('/'))
                                                }}>Delete Review</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))
                    }
                </ul>
                <div className='review-features-div'>
                    {(spotSelector.ownerId !== sessionId) &&
                    <div>
                        <div className='review-button'>
                            <NavLink to={`/spots/${spotId}/review`} style={{color: 'black', fontFamily: 'Geneva, Verdana, sans-serif'}}>Create A Review</NavLink>
                        </div>
                    </div>
                }
                </div>
            </div>
            </div>
                <div className='update-delete-div'>
                    {(spotSelector.ownerId === sessionId) &&
                    <div>
                        <div>
                            <NavLink style={{color: 'black', fontFamily: 'Geneva, Verdana, sans-serif'}} to={`/spots/${spotSelector.id}/update`}>Update Spot</NavLink>
                        </div>
                        <div>
                            <button onClick={deleteSpecificSpot}>Delete Spot</button>
                        </div>
                    </div>
                    }
                </div>
        </nav>
        )
        }

        export default SpotDetails;
