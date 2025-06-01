import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Import Navigate component
import { UserContext } from '../App';

const Content = () => {
  // Could have something here to check for the time when the accesstoken expires
  // and then call the refresh_token endpoint to get a new accesstoken automatically
  const [user] = useContext(UserContext);
  if (!user.accesstoken) {
    // Redirect to login if no accesstoken
    return <Navigate to="/login" replace />; // Use Navigate component for redirection
  }
  return <div>This is the content.</div>;
}

export default Content;