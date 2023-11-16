import "./register.css";
import * as constants from "../../utils/constants";
import {postRequestHandler} from "../../utils/utils";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    userType: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const registerEndpoint = constants.FLASK_APP_BASEURL + "/register";
      const response = await postRequestHandler(
        registerEndpoint,
        userCredentials
      );
      response === "Registration Successfull"
        ? navigate("/login")
        : setError(response);
    } catch (error) {
      setError(error);
      console.error("Error fetching data:", error);
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
          value={userCredentials.username}
        />
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={userCredentials.email}
          className="registerInput input-group-text"
          placeholder="Enter your email..."
          onChange={handleInputChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={userCredentials.password}
          className="registerInput input-group-text"
          placeholder="Enter your password..."
          onChange={handleInputChange}
        />
        <label>Requirements </label>
        <select
          className="registerInput form-select"
          name="userType"
          value={userCredentials.userType}
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
        <span style={{ color: "red", marginTop: "10px" }}>{error}</span>
      )}
    </div>
  );
}
