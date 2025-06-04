const pool = require('./database');

const getAllCurrencies = async (req, res) => {
    try {
        const user_id = req.user.id;
        const [rows] = await pool.execute('SELECT code, name, rate FROM currencies WHERE user_id = ?', [user_id]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching currencies:', error);
        res.status(500).json({ error: 'Failed to fetch currencies' });
    }
};

const getCurrency = async (req, res) => {
    const { code } = req.params;
    try {
        const user_id = req.user.id;
        const [rows] = await pool.execute('SELECT code, name, rate FROM currencies WHERE code = ? AND user_id = ?', [code, user_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Currency not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching currency:', error);
        res.status(500).json({ error: 'Failed to fetch currency' });
    }
};

const createCurrency = async (req, res) => {
    const { code, name, rate } = req.body;
    const user_id = req.user.id;
    if (!code || !name || rate === undefined) {
        return res.status(400).json({ error: 'Code, name, and rate are required' });
    }
    try {
        const [existingCurrency] = await pool.execute('SELECT code FROM currencies WHERE code = ? AND user_id = ?', [code, user_id]);
        if (existingCurrency.length > 0) {
            return res.status(400).json({ error: 'Currency code already exists' });
        }
        await pool.execute('INSERT INTO currencies (code, name, rate, user_id) VALUES (?, ?, ?, ?)', [code, name, rate, user_id]);
        res.status(201).json({ code, name, rate });
    } catch (error) {
        console.error('Error creating currency:', error);
        res.status(500).json({ error: 'Failed to create currency' });
    }
};

const updateCurrency = async (req, res) => {
    const { code } = req.params;
    const { name, rate } = req.body;
    try {
        const user_id = req.user.id;
        const [existingCurrency] = await pool.execute('SELECT code FROM currencies WHERE code = ? AND user_id = ?', [code, user_id]);
        if (existingCurrency.length === 0) {
            return res.status(404).json({ error: 'Currency not found' });
        }
        await pool.execute('UPDATE currencies SET name = ?, rate = ? WHERE code = ? AND user_id = ?', [name, rate, code, user_id]);
        const [updatedCurrency] = await pool.execute('SELECT code, name, rate FROM currencies WHERE code = ? AND user_id = ?', [code, user_id]);
        res.json(updatedCurrency[0]);
    } catch (error) {
        console.error('Error updating currency:', error);
        res.status(500).json({ error: 'Failed to update currency' });
    }
};

const deleteCurrency = async (req, res) => {
    const { code } = req.params;
    try {
        const user_id = req.user.id;
        const [existingCurrency] = await pool.execute('SELECT code FROM currencies WHERE code = ? AND user_id = ?', [code, user_id]);
        if (existingCurrency.length === 0) {
            return res.status(404).json({ error: 'Currency not found' });
        }
        await pool.execute('DELETE FROM currencies WHERE code = ? AND user_id = ?', [code, user_id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting currency:', error);
        res.status(500).json({ error: 'Failed to delete currency' });
    }
};

const convertCurrency = async (req, res) => {
    const { from, to, amount } = req.params;
    try {
        const user_id = req.user.id;
        const [fromCurrencies] = await pool.execute('SELECT rate FROM currencies WHERE code = ? AND user_id = ?', [from, user_id]);
        const [toCurrencies] = await pool.execute('SELECT rate FROM currencies WHERE code = ? AND user_id = ?', [to, user_id]);

        if (fromCurrencies.length === 0 || toCurrencies.length === 0) {
            return res.status(400).json({ error: 'Invalid currency code(s)' });
        }

        const fromRate = fromCurrencies[0].rate;
        const toRate = toCurrencies[0].rate;
        const convertedAmount = (parseFloat(amount) * toRate) / fromRate;
        res.json({
            from,
            to,
            amount: parseFloat(amount),
            convertedAmount: convertedAmount.toFixed(2)
        });
    } catch (error) {
        console.error('Error converting currency:', error);
        res.status(500).json({ error: 'Failed to convert currency' });
    }
};

module.exports = {
    getAllCurrencies,
    getCurrency,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    convertCurrency
};