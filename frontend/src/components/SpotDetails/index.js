import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpot } from '../../store/spots'

const SpotDetails = () => {
    const { spotsId } = useParams();
    const dispatch = useDispatch()
    const spotSelector = useSelector(state => state.spots[spotsId]);

    useEffect(() => {
        dispatch(getSpot(spotsId))
      }, [dispatch, spotsId]);

    //   if (!spotSelector || !spotSelector.moves) {
    //     return null;
    //   }

      return (
        <h1></h1>
      )
}

    export default SpotDetails;
