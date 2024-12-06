const express = require('express');
const cors = require('cors');
const app = express();

// Database structure for users
const users = {
    // Example user:
    // "username": {
    //     password: "hashedpassword",
    //     daysRemaining: 30,
    //     lastLogin: Date
    // }
};

app.use(cors({
    origin: ['http://localhost:3000', 'https://1001010010s1.github.io', 'https://thesolarsoftware.com'],
    credentials: true
}));

app.use(express.json());

// Check subscription middleware
const checkSubscription = (req, res, next) => {
    const username = req.body.username;
    if (!users[username] || users[username].daysRemaining <= 0) {
        return res.status(403).json({
            success: false,
            message: 'No active subscription. Please purchase more days.'
        });
    }
    next();
};

// Login route
app.post('/auth/login', checkSubscription, (req, res) => {
    const { username, password } = req.body;
    
    if (users[username] && users[username].password === password) {
        // Update last login and reduce days
        users[username].lastLogin = new Date();
        users[username].daysRemaining--;
        
        res.json({
            success: true,
            message: 'Login successful',
            daysRemaining: users[username].daysRemaining,
            token: 'SOLAR_' + Math.random().toString(36).substr(2)
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Add days route (for when they purchase more time)
app.post('/auth/add-days', (req, res) => {
    const { username, days, purchaseToken } = req.body;
    
    // Verify purchase token here
    if (users[username]) {
        users[username].daysRemaining += parseInt(days);
        res.json({
            success: true,
            message: `Added ${days} days to account`,
            daysRemaining: users[username].daysRemaining
        });
    }
});

// Add this new route
app.get('/auth/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    // Verify token and find user
    // This is a simplified example
    const user = Object.values(users).find(u => u.token === token);
    
    if (user && user.daysRemaining > 0) {
        res.json({
            success: true,
            daysRemaining: user.daysRemaining
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});