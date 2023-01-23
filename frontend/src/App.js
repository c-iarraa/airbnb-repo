import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import SpotDetails from './components/SpotDetails';
import UpdateSpot from './components/UpdateSpot';
import CreateSpot from './components/CreateSpot';
import ReviewsForSpot from "./components/ReviewsForSpot";
import CreateAReview from './components/CreateAReview';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
         <Switch>
         <Route exact path='/spots/:spotId/review'>
           <CreateAReview />
         </Route>
         <Route exact path='/'>
           <AllSpots />
         </Route>
         <Route exact path='/spots/:spotId/update'>
           <UpdateSpot />
         </Route>
         <Route exact path='/spots/:spotId'>
           <SpotDetails />
         </Route>
         <Route exact path='/spots/new'>
           <CreateSpot />
         </Route>
         <Route exact path='/spots/:spotId/reviews'>
           <ReviewsForSpot />
         </Route>
       </Switch>
      )}
    </>
  );
}

export default App;
