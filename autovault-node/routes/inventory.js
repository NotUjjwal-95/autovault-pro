const express = require('express');
const router = express.Router();
const db = require('../db');

// Read All
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM cars ORDER BY created_at DESC');
        res.render('inventory', { title: 'Inventory', cars: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

// Render Add Page
router.get('/add', (req, res) => {
    res.render('add-vehicle', { title: 'Add Vehicle' });
});

// Create Record
router.post('/add', async (req, res) => {
    const { make, model, year, price } = req.body;
    try {
        await db.query(
            'INSERT INTO cars (make, model, year, price) VALUES ($1, $2, $3, $4)',
            [make, model, parseInt(year), parseFloat(price)]
        );
        res.redirect('/inventory');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding record');
    }
});

// Delete Record
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM cars WHERE id = $1', [req.params.id]);
        res.redirect('/inventory');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting record');
    }
});

module.exports = router;