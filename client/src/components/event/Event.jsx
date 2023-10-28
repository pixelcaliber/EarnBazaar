import './event.css';
import { Link } from 'react-router-dom';
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardImage,
} from 'mdb-react-ui-kit';

export default function Event({ event }) {
  const link = '/events/' + event.event_id;
  return (
    <div className="post">
      <MDBCard>
        {/* {event.photo && (
          <MDBCardImage
            className="eventImg"
            src="https://pixabay.com/images/search/wallpaper/"
            alt="EB"
            position="top"
          />
        )} */}
        <MDBCardBody className="eventInfo">
          <MDBCardText className="eventCats">
            <Link to={link} className="mt-2">
              <h3>{event.event_id}</h3>
            </Link>
            <h3>{event.username}</h3>
            {event.tags.map((tag, index) => (
              <span className="eventCat">{tag} </span>
            ))}
            <hr />
            <ul>{event.event_details.title}</ul>
            <hr />
            <span className="eventDate">
              {new Date(event.date_created).toDateString()}
            </span>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
