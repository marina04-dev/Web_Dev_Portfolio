import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, /*useNavigate*/ } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend URL

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Send a POST request to the login endpoint with username and password
            const response = await axios.post(`${API_BASE_URL}/users/login`, { username, password });
            // Extract the token from the successful login response
            const { token } = response.data;
            // Call the onLogin function passed from App.js to store the token and update login status
            onLogin(token);
            // Redirect to the home page or a protected route
            //navigate('/');
            window.location.href = '/';
        } catch (err) {
            // If login fails, display the error message from the backend or a generic message
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                    <hr />
                    <p>Don't have an account? <Link to="/signup">Signup here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;