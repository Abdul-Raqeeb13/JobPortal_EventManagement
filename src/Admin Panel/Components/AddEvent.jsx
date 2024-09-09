import React, { useState } from 'react';
import firebase from '../../Config/Firebase';
import '../AdminCSS/AddEvent.css'; // Import the CSS file for styling

const EventForm = () => {
    const [event, setEvent] = useState({
        title: '',
        date: '',
        location: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent({
            ...event,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await firebase.database().ref('events').push(event);
            alert('Event added successfully!');
            setEvent({
                title: '',
                date: '',
                location: '',
                description: ''
            });
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Error adding event');
        }
    };

    return (
        <div className="event-form-container">
            <h1 className="form-title">Create a New Event</h1>
            <form onSubmit={handleSubmit} className="event-form">
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={event.title}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter event title"
                        required
                    />
                </label>
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={event.date}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={event.location}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter event location"
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={event.description}
                        onChange={handleChange}
                        className="textarea-field"
                        placeholder="Event description"
                    />
                </label>
                <button type="submit" className="submit-btn">Add Event</button>
            </form>
        </div>
    );
};

export default EventForm;
