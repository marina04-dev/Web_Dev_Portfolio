import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:5000/api/currencies';

const CurrencyConverter = ({ token }) => {
    const [currencies, setCurrencies] = useState([]);
    const [fromCurrency, setFromCurrency] = useState('');
    const [toCurrency, setToCurrency] = useState('');
    const [amount, setAmount] = useState('');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleConvert = async () => {
        if (!fromCurrency || !toCurrency || !amount) {
            setError('Please select currencies and enter an amount.');
            return;
        }

        setLoading(true);
        setError('');
        setConvertedAmount(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/convert/${fromCurrency}/${toCurrency}/${amount}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setConvertedAmount(response.data.convertedAmount);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to convert currency.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Currency Converter</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group className="mb-3">
                    <Form.Label>From Currency</Form.Label>
                    <Form.Control
                        as="select"
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                    >
                        <option value="">Select Currency</option>
                        {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>{currency.name} ({currency.code})</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>To Currency</Form.Label>
                    <Form.Control
                        as="select"
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                    >
                        <option value="">Select Currency</option>
                        {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>{currency.name} ({currency.code})</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleConvert} disabled={loading}>
                    {loading ? 'Converting...' : 'Convert'}
                </Button>

                {convertedAmount !== null && (
                    <div className="mt-3">
                        <Alert variant="info">
                            Converted Amount: {convertedAmount} {toCurrency}
                        </Alert>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default CurrencyConverter;