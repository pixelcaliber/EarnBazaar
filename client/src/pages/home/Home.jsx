import { useEffect, useState } from 'react';
import './home.css';
import React from 'react';

import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import Events from '../../components/events/Events';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Home() {
  const [error, setError] = useState(null);
  const [events, setEvents] = useState(null);
  const { userData } = useUser();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.userId}`,
    },
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/events', config);
      console.log(response.data);
      setEvents(response.data);
    } catch (error) {
      setError('Error getting events');
      console.error('Error fetching data:', error);
    }
  };
  return (
    <>
      <Container direction="horizontal">
        <Row>
          <Col xs md={3} className="border-right border-dark mt-4">
            <br />
            <div>
              <Link to="/donate" className="mt-2">
                <Button variant="success">Donate Us</Button>
              </Link>
            </div>
            <br />
            <br />
            <br />
            <div>
              <Link to="/advertisments">
                <Button variant="secondary">Events </Button>
              </Link>
            </div>
            <br />
            <div>
              <Link to="/write">
                <Button variant="warning">Advertise Your Event</Button>
              </Link>
            </div>
            <br />
          </Col>
          <Col>
            <div className="home">{events && <Events events={events} />}</div>
          </Col>
        </Row>
      </Container>
      {/* <div className="home">
        {events &&
          events.map((event) => (
            <div className="event">
              <h3>{event.username}</h3>
              <h3>{event.event_id}</h3>
              <h3>{event.user_id}</h3>
              <h3>{event.date_created}</h3>
              <ul>
                {event.tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
              <ul>
                {event.event_details.map((detail, index) => (
                  <div key={index}>
                    <p>Date: {detail.date}</p>
                    <p>Place: {detail.place}</p>
                  </div>
                ))}
              </ul>
            </div>
          ))}
      </div> */}
    </>
  );
}
