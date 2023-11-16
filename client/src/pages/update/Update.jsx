import './update.css';
import DatePicker from 'react-date-picker';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import * as constants from '../../utils/constants'

export default function Update() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split('/')[3];
  const [error, setError] = useState(null);
  const { userData, setUserData, logIn } = useUser();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.userId}`,
    },
  };
  const [tagsInput, setTagsInput] = useState('');
  const [tagsList, setTagsList] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    title: '',
    eventRewards: '',
    guest: '',
    location: '',
    description: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleTagsChange = (e) => {
    setTagsInput(e.target.value);
  };
  const handleTagsSubmit = (e) => {
    e.preventDefault();
    if (tagsInput) {
      setTagsList([...tagsList, tagsInput]);
      setTagsInput('');
    }
  };
  useEffect(() => {
    const getEvent = async () => {
      console.log(path);
      const urlPath = constants.FLASK_APP_BASEURL + '/events/' + path;
      const response = await axios.get(urlPath, config);
      const { title, description, eventRewards, guest, location } =
        response.data.event_details;
      setEventDetails((prevEventDetails) => ({
        ...prevEventDetails,
        title: title,
        description: description,
        eventRewards: eventRewards,
        guest: guest,
        location: location,
      }));
      console.log(title);
      console.log(eventDetails);
    };
    getEvent();
  }, [path]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      event_details: eventDetails,
    };
    console.log(payload);
    try {
      const response = await axios.post(
        constants.FLASK_APP_BASEURL + '/events/update/' + path,
        {
          data: payload,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.userId}`,
          },
        },
      );
      console.log(response.data);
      navigate('/home');
    } catch (error) {
      setError('Error publishing event');
      console.error('Error fetching data:', error);
    }
  };
  return (
    <>
      <div className="write">
        <form className="writeForm">
          <div className="writeFormGroup">
            <input
              type="text"
              name="title"
              value={eventDetails.title}
              onChange={handleInputChange}
              placeholder="Event Title"
              className="writeInput"
              autoFocus={true}
            />
          </div>
          {/* <div className="writeFormGroup">
            <label htmlFor="fileInputPdf">
              <i className="writeIcon fas fa-plus"></i>
            </label>
            <input type="file" id="fileInputPdf" style={{ display: 'none' }} />
          </div> */}
          <div className="writeFormGroup">
            <input
              type="text"
              name="location"
              value={eventDetails.location}
              placeholder="Event Location Name"
              className="writeInput"
              autoFocus={true}
              onChange={handleInputChange}
            />
          </div>
          <div className="writeFormGroup">
            <Container>
              <Row>
                <Col sm={12}>
                  <Row>
                    <Col sm={3}>Start Date :</Col>
                    <Col sm={3}>End Date :</Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="writeFormGroup">
            <input
              type="text"
              name="eventRewards"
              value={eventDetails.eventRewards}
              onChange={handleInputChange}
              placeholder="Event Rewards"
              className="writeInput"
              autoFocus={true}
            />
          </div>
          {/* <div className="writeFormGroup">
            <label>Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="Enter a tag and press Enter"
            />
            <button onClick={handleTagsSubmit}>Add Tag</button>
            <ul>
              {tagsList.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div> */}
          <div className="writeFormGroup">
            <input
              type="text"
              name="guest"
              onChange={handleInputChange}
              value={eventDetails.guest}
              placeholder="Event Guest of Honour"
              className="writeInput"
              autoFocus={true}
            />
          </div>
          <div className="writeFormGroup">
            <textarea
              placeholder="Tell your story... Why one should sponser you??"
              type="text"
              name="description"
              onChange={handleInputChange}
              value={eventDetails.description}
              className="writeInput writeText"
            ></textarea>
          </div>
          <button className="writeSubmit" type="submit" onClick={handleSubmit}>
            Update
          </button>
        </form>
      </div>
    </>
  );
}
/*
    event name
    event place
    event start date - end date
    event type/cat
    event prizes
    event registrations
    event cheif guest if any
    event logo/poster/banner
    Why anyone should sponser the event/benefits 

    login
    register
    feed write

*/
