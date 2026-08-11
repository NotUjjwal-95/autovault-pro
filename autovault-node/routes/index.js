const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const totalQuery = await db.query('SELECT COUNT(*) FROM cars');
        const valuationQuery = await db.query('SELECT SUM(price) FROM cars');
        const carsQuery = await db.query('SELECT * FROM cars ORDER BY created_at DESC LIMIT 5');

        res.render('dashboard', {
            title: 'Dashboard',
            total: parseInt(totalQuery.rows[0].count) || 0,
            valuation: parseFloat(valuationQuery.rows[0].sum) || 0,
            recentCars: carsQuery.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

module.exports = router;