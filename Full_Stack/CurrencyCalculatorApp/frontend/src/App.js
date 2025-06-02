import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, /*useNavigate*/ } from 'react-router-dom';
import CurrencyConverter from './components/CurrencyConverter';
import CurrencyForm from './components/CurrencyForm';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import { Button, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    // const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (newToken) => {
        setToken(newToken);
        setIsLoggedIn(true);
        localStorage.setItem('authToken', newToken);
        // navigate('/'); // Programmatically navigate
        window.location.href = '/';
    };

    const handleLogout = () => {
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
        // navigate('/');
        window.location.href = '/';
    };

    const handleGoHome = () => {
        window.location.href = '/';
        // navigate('/');
    };

    return (
        <Router>
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/">Currency Calculator</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            {isLoggedIn ? (
                                <>
                                    <Nav.Link href="/form">Currency Form</Nav.Link>
                                    <Nav.Link href="/CurrencyConverter">Currency Converter</Nav.Link>
                                    <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                    <Nav.Link href="/signup">Signup</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/form" element={isLoggedIn ? <CurrencyForm token={token} /> : <div>Please log in to access this page.</div>} />
                        <Route path="/CurrencyConverter" element={isLoggedIn ? <CurrencyConverter token={token} /> : <div>Please log in to access this page.</div>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;