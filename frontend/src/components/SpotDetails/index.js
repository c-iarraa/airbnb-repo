import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpot } from '../../store/spots'
import { NavLink } from 'react-router-dom';


const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spotSelector = useSelector(state => state.spots.oneSpot);
    const sessionId = useSelector(state => state.user) //session user id



    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [spotId]);



    if (!spotSelector.SpotImages) return null;

      return (
        <nav>
            <div id='detailsDiv'>
                <h1 id='title'>{spotSelector.description}</h1>
                <h4><i class="fa-sharp fa-solid fa-star"></i> {spotSelector.avgStarRating} · {spotSelector.numReviews} review · {spotSelector.city}, {spotSelector.state}, {spotSelector.country}</h4>
                <div id='spotContainer' >
                    {spotSelector.SpotImages.map(el => (<img src={el.url}/>))}
                    <NavLink to={`/spots/${spotSelector.id}/edit`}>Update Spot</NavLink>
                </div>

            </div>
        </nav>
      )
}

    export default SpotDetails;
