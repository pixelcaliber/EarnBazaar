import Event from '../event/Event';
import './events.css';

export default function Events({ events }) {
  return (
    <div className="events">
      {events.map((event) => (
        <Event event={event} />
      ))}
    </div>
  );
}
