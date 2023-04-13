import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import DemoUserModal from '../DemoUserModal';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from "react-router-dom";


function ProfileButton({ user }) {
 const dispatch = useDispatch();
 const [showMenu, setShowMenu] = useState(false);
 const ulRef = useRef();
 const history = useHistory()


 const openMenu = () => {
   if (showMenu) return;
   setShowMenu(true);
 };


 useEffect(() => {
   if (!showMenu) return;


   const closeMenu = (e) => {
     if (!ulRef.current.contains(e.target)) {
       setShowMenu(false);
     }
   };


   document.addEventListener('click', closeMenu);


   return () => document.removeEventListener("click", closeMenu);
 }, [showMenu]);


 const closeMenu = () => setShowMenu(false);


 const logout = (e) => {
   e.preventDefault();
   dispatch(sessionActions.logout());
   closeMenu();
 };


 const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


 return (
   <>
     <button onClick={openMenu} className='profile-button'>
       <div className="profile-button-combined">
         <i className="fa-solid fa-bars" id="solid-bars" />
         <i className="fas fa-user-circle" />
       </div>
     </button>
     <ul className={ulClassName} ref={ulRef}>
       {user ? (
         <>
           <p>{user.username}</p>
           <p>{user.firstName} {user.lastName}</p>
           <p className='user-email'>{user.email}</p>


           <p>
             <button className='logout-button' onClick={() => history.push('/bookings').then({closeMenu})}>Bookings</button>
           </p>


           <p>
             <button className='logout-button' onClick={logout}>Log Out</button>
           </p>
         </>
       ) : (
         <>
           <OpenModalMenuItem
             itemText="Log In"
             onItemClick={closeMenu}
             modalComponent={<LoginFormModal />}
           />
           <OpenModalMenuItem
             itemText="Sign Up"
             onItemClick={closeMenu}
             modalComponent={<SignupFormModal />}
           />
           <OpenModalMenuItem
             itemText="Demo User"
             onItemClick={closeMenu}
             modalComponent={<DemoUserModal />}
           />
         </>
       )}
     </ul>
   </>
 );
}


export default ProfileButton;



