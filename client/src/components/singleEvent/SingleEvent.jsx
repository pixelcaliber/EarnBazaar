import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../../context/UserContext';

import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/esm/Button';
import './singleEvent.css';

import { v4 as uuidV4 } from 'uuid';
import axios from 'axios';

export default function SingleEvent() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split('/')[2];
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const { userData, setUserData, logIn } = useUser();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.userId}`,
    },
  };

  useEffect(() => {
    const getEvent = async () => {
      console.log(path);
      const urlPath = 'http://localhost:5000' + '/events/' + path;
      const response = await axios.get(urlPath, config);
      setEvent(response.data);
      console.log(response.data);
    };
    getEvent();
  }, []);
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      navigate('/events/update/' + path);
    } catch (error) {
      setError('Error updating event');
      console.error('Error updating event:', error);
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const urlPath = 'http://localhost:5000' + '/events/delete/' + path;
      const response = await axios.get(urlPath, config);
      console.log(response.data);
      navigate('/home');
    } catch (error) {
      setError('Error updating event');
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="singlePost">
      <Container className="singlePostWrapper">
        <h1 className="singlePostTitle"></h1>
        <div className="singlePostInfo">
          <span className="singlePostAuthor">Author:</span>
          <span className="singlePostDate"></span>
        </div>
        <div className="singlePostInfo">
          <p>Tags</p>
        </div>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleDelete}>Delete</button>
      </Container>
    </div>
  );
}
