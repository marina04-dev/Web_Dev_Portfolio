import React from 'react';

const HomePage = ({ isLoggedIn }) => {
    return (
        <div>
            <h2>Welcome to the Currency Calculator</h2>
            {isLoggedIn ? (
                <p>You are logged in and can access the currency calculator features.</p>
            ) : (
                <p>Please log in to use the currency calculator.</p>
            )}
        </div>
    );
};

export default HomePage;