import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSpot } from '../../store/spots'


const DeleteSpot  = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spotSelector = useSelector(state => state.spots);



  


      return (
        <nav>
            <h1>hello</h1>
        </nav>
      )
}

    export default DeleteSpot;
