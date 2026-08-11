require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('./db');

const app = express();

// View Engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Management
app.use(session({
    store: new pgSession({ pool: pool }),
    secret: process.env.SESSION_SECRET || 'autovault-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

// Route Imports
const indexRoutes = require('./routes/index');
const inventoryRoutes = require('./routes/inventory');

app.use('/', indexRoutes);
app.use('/inventory', inventoryRoutes);

const PORT = process.env.PORT || 5911;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});