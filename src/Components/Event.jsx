import React, { useEffect, useState } from 'react';
import firebase from '../Config/Firebase'; // Import Firebase configuration
import './CSS/Event.css'; // Import CSS file for styling

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null); // State to hold current user ID

    useEffect(() => {
        // Simulate getting the current user from local storage or authentication context
        const userId = localStorage.getItem('UserID'); // or use an auth context
        setCurrentUser(userId);
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsRef = firebase.database().ref('events');
                eventsRef.on('value', (snapshot) => {
                    const data = snapshot.val();
                    const eventList = [];
                    for (let id in data) {
                        eventList.push({ id, ...data[id] });
                    }
                    setEvents(eventList);
                });
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const fetchJoinedEvents = async () => {
                try {
                    const userEventsRef = firebase.database().ref('userEvents').child(currentUser);
                    userEventsRef.on('value', (snapshot) => {
                        const data = snapshot.val();
                        const joinedList = data ? Object.keys(data) : [];
                        setJoinedEvents(joinedList);
                    });
                } catch (error) {
                    console.error('Error fetching user events:', error);
                }
            };

            fetchJoinedEvents();
        }
    }, [currentUser]);

    const handleJoin = async (eventId) => {
        if (!currentUser) {
            alert('User not logged in');
            return;
        }

        try {
            const joinRef = firebase.database().ref('userEvents').child(currentUser).child(eventId);
            await joinRef.set({
                eventId,
                timestamp: new Date().toISOString()
            });
            setJoinedEvents(prev => [...prev, eventId]); // Update joined events state
            alert('Successfully joined the event!');
        } catch (error) {
            console.error('Error joining event:', error);
            alert('Error joining event');
        }
    };

    const isJoined = (eventId) => joinedEvents.includes(eventId);

    return (
        <div className="event-list">
            {events.map((event) => (
                <div key={event.id} className="event-card">
                    <h3>{event.title}</h3>
                    <p className="event-date">Date: {event.date}</p>
                    <p className="event-location">Location: {event.location}</p>
                    <p className="event-description">Description: {event.description}</p>
                    <button
                        onClick={() => handleJoin(event.id)}
                        disabled={isJoined(event.id)}
                        className={`join-btn ${isJoined(event.id) ? 'joined' : ''}`}
                    >
                        {isJoined(event.id) ? 'Joined' : 'Join'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default EventList;
