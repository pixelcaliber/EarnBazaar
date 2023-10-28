import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { useUser } from '../../context/UserContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React from 'react';

export default function Login() {
  const { userData, setUserData, logIn } = useUser();

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  useEffect(() => {
    console.log('userData updated:', userData);
  }, [userData]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        'http://localhost:5000/login',
        { data: formData },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { userId, username } = response.data;
      console.log(response.data);
      if (userId && username) {
        logIn({ userId: userId, username: username });
        navigate('/home');
      } else {
        setError('Invalid response');
      }
    } catch (error) {
      setError('Error logging in');
      console.error('Error logging in:', error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="login">
        <span className="loginTitle">Login</span>
        <form className="loginForm">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="loginInput input-group-text"
            placeholder="Enter your email..."
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="loginInput input-group-text"
            placeholder="Enter your password..."
          />
          <button className="loginButton" type="submit" onClick={handleSubmit}>
            Login
          </button>
        </form>
        <button className="loginRegisterButton btn btn-outline-secondary btn-lg">
          <Link className="rm-txt-dec" to="/register">
            Register
          </Link>
        </button>
        <div className="loginForm">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
        {error && (
          <span style={{ color: 'red', marginTop: '10px' }}>
            Something went wrong!
          </span>
        )}
      </div>
    </>
  );
}
