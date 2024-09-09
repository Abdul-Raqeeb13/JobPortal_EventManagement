// // App.js
// import React, { useEffect, useState } from 'react';
// import firebase from '../Config/Firebase'; // Import Firebase configuration

// const App = () => {
//     const [userEvents, setUserEvents] = useState({});
//     const [events, setEvents] = useState({});
//     const [currentUser, setCurrentUser] = useState(null); // State to hold current user ID
//     const [userJoinedEvents, setUserJoinedEvents] = useState([]); // State to hold events joined by current user

//     useEffect(() => {
//         // Simulate getting the current user from local storage or authentication context
//         const userId = localStorage.getItem('userId'); // or use an auth context
//         setCurrentUser(userId);
//     }, []);

//     useEffect(() => {
//         if (currentUser) {
//             const fetchUserEvents = async () => {
//                 try {
//                     const userEventsRef = firebase.database().ref('userEvents').child(currentUser);
//                     userEventsRef.on('value', (snapshot) => {
//                         const data = snapshot.val();
//                         setUserEvents(data || {});
//                         setUserJoinedEvents(data ? Object.keys(data) : []);
//                     });
//                 } catch (error) {
//                     console.error('Error fetching user events:', error);
//                 }
//             };

//             fetchUserEvents();
//         }
//     }, [currentUser]);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const eventsRef = firebase.database().ref('events');
//                 eventsRef.on('value', (snapshot) => {
//                     const data = snapshot.val();
//                     setEvents(data || {});
//                 });
//             } catch (error) {
//                 console.error('Error fetching events:', error);
//             }
//         };

//         fetchEvents();
//     }, []);

//     const renderUserEvents = () => {
//         if (userJoinedEvents.length === 0) return <p>No events joined yet.</p>;

//         return (
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Event Title</th>
//                         <th>Joined At</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {userJoinedEvents.map((eventId) => (
//                         <tr key={eventId}>
//                             <td>{events[eventId]?.title || 'Unknown Event'}</td>
//                             <td>{userEvents[eventId]?.timestamp || 'N/A'}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         );
//     };

//     return (
//         <div className="App">
//             <h1>Your Joined Events</h1>
//             {currentUser ? (
//                 <div>
//                     <h2>User ID: {currentUser}</h2>
//                     {renderUserEvents()}
//                 </div>
//             ) : (
//                 <p>Loading user data...</p>
//             )}
//         </div>
//     );
// };

// export default App;
