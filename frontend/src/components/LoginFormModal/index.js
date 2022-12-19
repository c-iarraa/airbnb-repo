import React, { useState } from "react";
import { createStore } from 'redux';
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal(request) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <>
      <h1 className = 'login-form-title'>Log In</h1>
      <form className='top-of-login-form' style={{height:'400px'}} onSubmit={handleSubmit}>
      <h2 style={{ fontFamily: 'Geneva, Verdana, sans-serif' }}>Welcome to LairBnb</h2>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          {/* Username or Email */}
          <input className = 'login-inputs'
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          {/* Password */}
          <input className = 'login-inputs'
            type="password"
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <p className='datarates-text'><small>We’ll call or text you to confirm your number. Standard message and data rates apply. Privacy Policy</small></p>
        <button className = 'login-button' type="submit">Continue</button>
      </form>
    </>
  );
}

export default LoginFormModal;
