import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Table } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:5000/api/currencies';

const CurrencyForm = ({ token }) => {
    const [currencies, setCurrencies] = useState([]);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [rate, setRate] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingCode, setEditingCode] = useState(null);

    const fetchCurrencies = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCurrencies(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch currencies.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCurrencies();
        }
    }, [token]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            await axios.post(API_BASE_URL, { code, name, rate }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCode('');
            setName('');
            setRate('');
            setSuccessMessage('Currency created successfully!');
            fetchCurrencies();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create currency.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            await axios.put(`${API_BASE_URL}/${editingCode}`, { name, rate }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setEditingCode(null);
            setCode('');
            setName('');
            setRate('');
            setSuccessMessage('Currency updated successfully!');
            fetchCurrencies();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update currency.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (currencyCode) => {
        if (window.confirm('Are you sure you want to delete this currency?')) {
            setLoading(true);
            setError('');
            setSuccessMessage('');
            try {
                await axios.delete(`${API_BASE_URL}/${currencyCode}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setSuccessMessage('Currency deleted successfully!');
                fetchCurrencies();
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to delete currency.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (currency) => {
        setEditingCode(currency.code);
        setCode(currency.code);
        setName(currency.name);
        setRate(currency.rate);
    };

    const handleCancelEdit = () => {
        setEditingCode(null);
        setCode('');
        setName('');
        setRate('');
    };

    return (
        <div className="container mt-4">
            <h2>Manage Currencies</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <h3>{editingCode ? 'Edit Currency' : 'Add New Currency'}</h3>
            <Form onSubmit={editingCode ? handleUpdate : handleCreate}>
                <Form.Group className="mb-3">
                    <Form.Label>Code</Form.Label>
                    <Form.Control type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required readOnly={editingCode} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Rate</Form.Label>
                    <Form.Control type="number" step="0.0001" value={rate} onChange={(e) => setRate(e.target.value)} required />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (editingCode ? 'Updating...' : 'Adding...') : (editingCode ? 'Update Currency' : 'Add Currency')}
                </Button>
                {editingCode && (
                    <Button variant="secondary" onClick={handleCancelEdit} className="ml-2">Cancel Edit</Button>
                )}
            </Form>

            <h3 className="mt-4">Your Currencies</h3>
            {loading && <p>Loading currencies...</p>}
            {!loading && currencies.length === 0 && <p>No currencies added yet.</p>}
            {!loading && currencies.length > 0 && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Rate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currencies.map(currency => (
                            <tr key={currency.code}>
                                <td>{currency.code}</td>
                                <td>{currency.name}</td>
                                <td>{currency.rate}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleEdit(currency)}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(currency.code)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default CurrencyForm;