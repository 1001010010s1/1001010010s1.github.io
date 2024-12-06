const express = require('express');
const router = express.Router();

// API key stored securely on the server
const SOLAR_API_KEY = 'SOLAR_8f4a15df61e4b882c6f479fa6223e29ayq72123o30aArh';

// Proxy route for login
router.post('/auth/login', async (req, res) => {
    try {
        const response = await fetch('https://thesolarsoftware.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'API-Key': SOLAR_API_KEY  // API key is hidden from client
            },
            body: JSON.stringify({
                username: req.body.username,
                password: req.body.password
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router; 