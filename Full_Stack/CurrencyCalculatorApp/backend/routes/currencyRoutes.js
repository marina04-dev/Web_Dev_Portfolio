const express = require('express');
const currencyController = require('../utils/currencyController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, currencyController.getAllCurrencies);
router.get('/:code', authenticate, currencyController.getCurrency);
router.post('/', authenticate, currencyController.createCurrency);
router.put('/:code', authenticate, currencyController.updateCurrency);
router.delete('/:code', authenticate, currencyController.deleteCurrency);
router.get('/convert/:from/:to/:amount', authenticate, currencyController.convertCurrency);

module.exports = router;