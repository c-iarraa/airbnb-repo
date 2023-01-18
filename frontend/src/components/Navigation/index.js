// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <div className='nav-bar'>
         {/* <div className='top-left'>
              <img className='airbnb-logo' src='https://seeklogo.com/images/A/airbnb-logo-1D03C48906-seeklogo.com.png' />
        </div> */}
        <NavLink className='home-button' style={{fontFamily: 'Geneva, Verdana, sans-serif'}} exact to="/"><b><stronger>ToonBnb</stronger></b></NavLink>
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
    </ul>
  );
}

export default Navigation;
