import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSpot } from '../../store/spots';
import { useModal } from "../../context/Modal";




const CreateSpotModal = () => {
  // const spotSelector = useSelector(state => state.spots);
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

    setErrors([])
    const payload = {
        name,
        address,
        city,
        state,
        country,
        lat,
        lng,
        description,
        price: +price,
        imageUrl
      };
      console.log(payload)

    let createdSpot = dispatch(createSpot(payload))
    if (createdSpot) {
        history.push(`/`);
        // hideForm();
    };

    closeModal();
  }

    // const handleCancelClick = (e) => {
    //     e.preventDefault();
    //     // hideForm();
    //   };


      return (
        <nav>
           <h1>Create your spot</h1>
           <form onSubmit={handleSubmit}>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <label>
              Name
              <input
                type="text"
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Address
              <input
                type="text"
                placeholder='Address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>
            <label>
              City
              <input
                type="text"
                placeholder='City'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>
            <label>
              State
              <input
                type="text"
                placeholder='State'
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </label>
            <label>
              Country
              <input
                type="text"
                placeholder='Country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </label>
            <label>
              Lat
              <input
                type="number"
                placeholder='Lat'
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
              />
            </label>
            <label>
              Lng
              <input
                type="number"
                placeholder='Lng'
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
              />
            </label>
            <label>
              Description
              <input
                type="text"
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label>
              Price
              <input
                type="number"
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>
            <label>
              Image Url
              <input
                type="text"
                placeholder='Image Url'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </label>
            <button type="submit">Save</button>
          </form>
            </nav>
          )
}

    export default CreateSpotModal;
