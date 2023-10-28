import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import axios from 'axios';

export default function Register() {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    userType: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const response = await axios.post(
        'http://localhost:5000/register',
        {
          data: formData,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response.data);
      response.data && navigate('/login');
    } catch (error) {
      setError(true);
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm">
        <label>Username</label>
        <input
          type="text"
          className="registerInput input-group-text"
          placeholder="Enter your username..."
          onChange={handleInputChange}
          name="username"
          value={formData.username}
        />
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          className="registerInput input-group-text"
          placeholder="Enter your email..."
          onChange={handleInputChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          className="registerInput input-group-text"
          placeholder="Enter your password..."
          onChange={handleInputChange}
        />
        <label>Requirements </label>
        <select
          className="registerInput form-select"
          name="userType"
          value={formData.userType}
          onChange={handleInputChange}
        >
          <option value=""> Select One </option>
          <option value="Organiser"> Looking for Sponsors </option>
          <option value="Sponsor"> Looking for Promotion </option>
        </select>
        <button className="registerButton" type="submit" onClick={handleSubmit}>
          Register
        </button>
      </form>
      <button className="registerLoginButton btn-lg btn btn-outline-secondary">
        <Link className="link rm-txt-dec" to="/login">
          Login
        </Link>
      </button>
      {error && (
        <span style={{ color: 'red', marginTop: '10px' }}>
          Something went wrong!
        </span>
      )}
    </div>
  );
}
