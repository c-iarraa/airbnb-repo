// frontend/src/components/Navigation/index.js
import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    // <ul>
    <div className='nav-bar'>
      <div className='home-button-div'>
          <NavLink className='home-button' style={{fontFamily: 'Geneva, Verdana, sans-serif'}} exact to="/"><b><stronger>ToonBnb</stronger></b></NavLink>
      </div>
      {/* <NavLink className='home-button' style={{fontFamily: 'Geneva, Verdana, sans-serif'}} exact to="/"><b><stronger>ToonBnb</stronger></b></NavLink> */}
    <div className='top-right'>
      <ul>
        {sessionUser &&
          <NavLink className="create-spot-link" style={{fontFamily: 'Geneva, Verdana, sans-serif'}} exact to="/spots/new">ToonBnb your home</NavLink>
        }
      </ul>
      {isLoaded && (
        <ul>
          <ProfileButton className='profile-button' user={sessionUser} />
        </ul>
      )}
    </div>
    </div>
  // </ul>
  );
}

export default Navigation;
