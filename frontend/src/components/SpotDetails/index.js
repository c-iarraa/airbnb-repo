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
    const review = useSelector(state => state.reviews.reviewList);
    const [validationErrors, setValidationErrors] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();
    }


    useEffect(() => {
        dispatch(getSpot(spotId))
   }, [spotId, dispatch]);

    useEffect(() => {
        dispatch(getReviews(spotId))
    }, [spotId, dispatch]);



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
    //     return dispatch(deleteReview(usersReview.id))
    //     // history.push('/')
    //     // return dispatch(deleteReview(review.id))

    // }




      return review &&(
        <nav>
            <div className='detailsDiv'>
            <ul className="review-errors">
                {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                ))}
            </ul>
            <div className='above-img'>
                <h1 className='description' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>{spotSelector.description}</h1>
                <h4 className='description2' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><i class="fa-sharp fa-solid fa-star"></i> {spotSelector.avgStarRating} · {spotSelector.numReviews} reviews · Superhost · {spotSelector.city}, {spotSelector.state}, {spotSelector.country}</h4>
                </div>
                <div className='image-container'>
                    {spotSelector.SpotImages.map((image) => (
                        <img className="specific-spot-img" key={image.id} src={image.url}/>
                    ))}
                </div>
                <div className='house-description'>
                    <div className='below-img'>
                        <h3 className='hosts-description' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}> Entire house hosted by Blaze and Ryder </h3>
                        <h4 className='house-deets'style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><small> 8 guests · 4 bedrooms · 7 beds · 2.5 baths </small></h4>
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
                        <h1 className='star-rating' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><i class="fa-sharp fa-solid fa-star"></i> {spotSelector.avgStarRating}</h1>
                        <h1 className='price' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>${spotSelector.price} a night</h1>
                            <div className='review-features-div'>
                                {(spotSelector.ownerId !== sessionId) &&
                                <div>
                                    <div className='review-button'>
                                        <NavLink className='review-text' to={`/spots/${spotId}/review`} style={{color: 'black', fontFamily: 'Geneva, Verdana, sans-serif'}}>Create A Review</NavLink>
                                    </div>
                                </div>
                                }
                            </div>
                            <div className='update-delete-div'>
                                {(spotSelector.ownerId === sessionId) &&
                                <div>
                                    <div className='update-button2'>
                                        <NavLink className='update-text' style={{color: 'black', fontFamily: 'Geneva, Verdana, sans-serif'}} to={`/spots/${spotSelector.id}/update`}>Update Spot</NavLink>
                                    </div>
                                    <div className='delete-button2'>
                                        <button onClick={deleteSpecificSpot} style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>Delete Spot</button>
                                    </div>
                                </div>
                                }
                            </div>
                            <div className='fee-info'>
                                <div className='stay-price'>
                                    <h1 className='stay-price1' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>${spotSelector.price} x 5 nights</h1>
                                    {/* <h1 className='stay-price2'>${spotSelector.price ** 5}/h1> */}
                                </div>
                                <div className='cleaning-fee'>
                                    <h1 className='cleaning-fee1' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>Cleaning fee</h1>
                                    <h1 className='cleaning-fee2' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>$60</h1>
                                </div>
                                <div className='service-fee'>
                                    <h1 className='service-fee1' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>Service fee</h1>
                                    <h1 className='service-fee2' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>$120</h1>
                                </div>
                            </div>
                    </div>
                    </div>
                    <div className='aircover'>
                        <h2 className='aircover-img'>
                            <img className="aircover1" src="https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg" alt="AirCover"/>
                        </h2>
                        <h4 className='aircover-text' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><small>Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.</small></h4>
                        <h4 className='aircover-text2' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>Learn more</h4>
                    </div>
                </div>
                <div className='review-stuff'>
                <div>
                    <h2 className='reviews-tag' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>Reviews</h2>
                </div>
                <ul className="spot-reviews">
                    {review.length ? review?.map(review => (

                            <div className = 'review-values' key={review.id}>
                                <div className='review-spot'>
                                <div className='user-review'>
                                    <h3 className='review-user' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><i class="fa-solid fa-user"></i> {review.User.firstName} {review.User.lastName}</h3>
                                </div>
                                <h4 className='review-stars' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><i class="fa-sharp fa-solid fa-star"></i> {review.stars}</h4>
                                <h3 className='review-text' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>{review.review}</h3>
                                <div className = 'delete-review-button'>
                                    {(review?.userId === sessionId) &&
                                            <div>
                                                <button onClick={
                                                    async (e) => {
                                                    e.preventDefault();


                                                    return dispatch(deleteReview(review.id))
                                                    .then (() => history.push(`/`))
                                                }
                                            }
                                                >Delete Review</button>
                                            </div>
                                    }
                                </div>
                                </div>
                            </div>
                        ))
                        : <div style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>Be the first to create a review!</div>
                    }
                </ul>
            </div>
            </div>
        </nav>
        )
        }

        export default SpotDetails;
