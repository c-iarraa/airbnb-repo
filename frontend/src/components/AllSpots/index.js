import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getSpots } from '../../store/spots'
import { NavLink } from 'react-router-dom'
import './AllSpots.css'

// Create all spots component that will render all spots after mounting (useEffect & dispatch)
function AllSpots(){
    // imported dispatch
    const dispatch = useDispatch();
    // Find data with useSelector in your component
    const sessionSpot = useSelector(state => {
        return state.spots.allSpots
    });


    const spotArr = Object.values(sessionSpot)


    useEffect(() => {
        dispatch(getSpots())
      }, [dispatch])


    return (
        <nav className='container'>
            {spotArr.map(el => (
            <ul>
                <div id='spotCard' key={el.id}>
                 <NavLink to={`api/spots/${el.id}`}>
                    <img src={el.previewImage} className='spotImg'></img>
                    <h4>{el.city}, {el.state}</h4>
                    <h4>{el.avgRating}</h4>
                    <h4>${el.price} night</h4>
                </NavLink>
                </div>
            </ul>
            ))}
        </nav>
    );
  }

  export default AllSpots;




// - [ DONE ] Import this component to your App.js


// - [ ] Manipulate data to render the components onto your app
