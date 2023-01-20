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


    return sessionSpot && spotArr &&(
        <nav className='container'>
            {spotArr.map(el => (
            <ul>
                <div id='spotCard' key={el.id}>
                 <NavLink to={`api/spots/${el.id}`}>
                    <img className='spotImg' src={el.previewImage}></img>
                    <h4 className='spot-location' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>{el.city}, {el.state}</h4>
                    {/* <h4 className='avg-rating' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}><i class="fa-sharp fa-solid fa-star"></i>{el.avgRating}</h4> */}
                    <div className='avg-rating' style={{width:'60px',textAlign:'right'}}>
                        <i style={{ color: 'black', lineHeight: 0  }} className="fa-solid fa-star"></i>
                        {el.avgRating ? parseFloat(el.avgRating).toFixed(1) : 'New'}
                    </div>
                    <h4 className='nightly-price' style={{fontFamily: 'Geneva, Verdana, sans-serif'}}>${el.price} night</h4>
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
