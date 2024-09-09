// AdminPanel.js
import React, { useEffect, useState } from 'react';
import firebase from '../../Config/Firebase'; // Import Firebase configuration
import '../AdminCSS/ViewEvent.css'

const AdminPanel = () => {
    const [events, setEvents] = useState([]);
    const [userEvents, setUserEvents] = useState({});

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
        const fetchUserEvents = async () => {
            try {
                const userEventsRef = firebase.database().ref('userEvents');
                userEventsRef.on('value', (snapshot) => {
                    const data = snapshot.val();
                    setUserEvents(data || {});
                });
            } catch (error) {
                console.error('Error fetching user events:', error);
            }
        };

        fetchUserEvents();
    }, []);

    const renderUserTable = (eventId) => {
        const usersForEvent = [];
        for (const userId in userEvents) {
            if (userEvents[userId][eventId]) {
                usersForEvent.push({ userId });
            }
        }

        return (
            <table className="user-table" key={eventId}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Joined At</th>
                    </tr>
                </thead>
                <tbody>
                    {usersForEvent.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{userEvents[user.userId][eventId]?.timestamp || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <div className="events-container">
                {events.map((event) => (
                    <div className="event-card" key={event.id}>
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        {renderUserTable(event.id)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;

