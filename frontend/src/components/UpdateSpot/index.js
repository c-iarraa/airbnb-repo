import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateSpot } from '../../store/spots'
import './UpdateSpot.css';


const UpdateSpot  = ({ spot }) => {
    const history = useHistory();
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spotSelector = useSelector(state => state.spots.oneSpot);

    const [address, setAddress] = useState(spotSelector.address);
    const [city, setCity] = useState(spotSelector.city);
    const [state, setState] = useState(spotSelector.state);
    const [country, setCountry] = useState(spotSelector.country);
    const [lat, setLat] = useState(spotSelector.lat);
    const [lng, setLng] = useState(spotSelector.lng);
    const [name, setName] = useState(spotSelector.name);
    const [description, setDescription] = useState(spotSelector.description);
    const [price, setPrice] = useState(spotSelector.price);
    const [urlImage, setUrlImage] = useState(spotSelector.urlImage);

    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateLat = (e) => setLat(e.target.value);
    const updateLng = (e) => setLng(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updateUrlImage = (e) => setUrlImage(e.target.value);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatingSpot = {
            id: spotSelector.id,
            name,
            description,
            price,
            address,
            city,
            state,
            country,
            lat: 888,
            lng: 456,
            urlImage
        };

    const updatedSpot = await dispatch((updateSpot(updatingSpot)))
    .then (() => history.push(`/`))
    // if (updatedSpot) {
    //   history.push('/')
    // }
  };

  // const handleCancelClick = (e) => {
  //   e.preventDefault();
  // };


      return (
        <section className="update-form-holder centered middled">
      <form onSubmit={handleSubmit}>
      <div className='UpdateSpotContainer'>
        <div className='update-spot-header'>
          <h2 style={{ fontFamily: 'Geneva, Verdana, sans-serif' }}>Update a Spot</h2>
        </div>
        <input className ='update-inputs'
          type="text"
          placeholder="Address"
          min="1"
          required
          value={address}
          onChange={updateAddress} />
        <input className ='update-inputs'
          type="text"
          placeholder="City"
          required
          value={city}
          onChange={updateCity} />
        <input className ='update-inputs'
          type="text"
          placeholder="State"
          min="0"
          max="100"
          required
          value={state}
          onChange={updateState} />
        <input className ='update-inputs'
          type="text"
          placeholder="Country"
          value={country}
          onChange={updateCountry} />
        {/* <input className ='update-inputs'
          type="number"
          placeholder="Lat"
          value={lat}
          onChange={updateLat} />
        <input className ='update-inputs'
          type="number"
          placeholder="Lng"
          value={lng}
          onChange={updateLng} /> */}
        <input className ='update-inputs'
          type="text"
          placeholder="Name"
          value={name}
          onChange={updateName} />
        <input className ='update-inputs'
          type="text"
          placeholder="Description"
          value={description}
          onChange={updateDescription} />
        <input className ='update-inputs'
          type="number"
          placeholder="Price"
          value={price}
          onChange={updatePrice} />
          {/* <input className ='update-inputs'
          type="text"
          placeholder="Url Image"
          value={urlImage}
          onChange={updateUrlImage} /> */}
        <button className='update-button' type="submit">Update</button>
        {/* <button type="button" onClick={handleCancelClick}>Cancel</button> */}
        </div>
      </form>
    </section>
      )
}

    export default UpdateSpot;
