const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// This automatically serves your index.html, style.css, and script.js to the browser!
app.use(express.static(path.join(__dirname)));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Your MySQL username
    password: 'Faaz@3109', // ⚠️ Replace with your actual MySQL Workbench password!
    database: 'expense_tracker'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL expense_tracker database! 🚀');
});

// 1. API Endpoint: Get all expenses (with JOINs)
app.get('/api/expenses', (req, res) => {
    const query = `
        SELECT 
            e.id, 
            u.name AS user_name, 
            c.name AS category_name, 
            e.amount, 
            e.date, 
            e.description
        FROM expenses e
        JOIN users u ON e.user_id = u.id
        JOIN categories c ON e.category_id = c.id
        ORDER BY e.date DESC;
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching expenses:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// 2. API Endpoint: Add a new expense
app.post('/api/expenses', (req, res) => {
    const { category_id, amount, date, description } = req.body;
    const user_id = 1; // Defaulting to Alex Smith (id 1) for now

    const query = 'INSERT INTO expenses (user_id, category_id, amount, date, description) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [user_id, category_id, amount, date, description], (err, result) => {
        if (err) {
            console.error('Error inserting expense:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Expense added successfully!', id: result.insertId });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running live at http://localhost:${PORT}`);
});