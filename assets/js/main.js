/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

// Add API URL constant
const API_URL = 'http://68.183.131.82:3000';

// Authentication Functions
const auth = {
    // Signup Function
    signup: async (username, email, password) => {
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: 'Connection error. Please try again.' };
        }
    },

    // Login Function
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('solar_token', data.token);
                localStorage.setItem('solar_days', data.daysRemaining);
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Connection error. Please try again.' };
        }
    },

    // Verify Email Function
    verify: async (token) => {
        try {
            const response = await fetch(`${API_URL}/verify?token=${token}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Verification error:', error);
            return { success: false, message: 'Verification failed. Please try again.' };
        }
    },

    // Check if user is logged in
    checkAuth: () => {
        const token = localStorage.getItem('solar_token');
        return !!token;
    },

    // Logout Function
    logout: () => {
        localStorage.removeItem('solar_token');
        localStorage.removeItem('solar_days');
        window.location.href = 'login.html';
    }
};

// Form Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const result = await auth.signup(username, email, password);
            if (result.success) {
                alert('Account created! Please check your email to verify.');
                window.location.href = 'login.html';
            } else {
                const errorMsg = document.getElementById('error-message');
                errorMsg.textContent = result.message;
                errorMsg.style.display = 'block';
            }
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const result = await auth.login(username, password);
            if (result.success) {
                alert(`Login successful! You have ${result.daysRemaining} days remaining.`);
                window.location.href = 'dashboard.html';
            } else {
                const errorMsg = document.getElementById('error-message');
                errorMsg.textContent = result.message;
                errorMsg.style.display = 'block';
            }
        });
    }

    // Verification Handler
    if (window.location.pathname.includes('verify.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            auth.verify(token).then(result => {
                const statusDiv = document.getElementById('verificationStatus');
                if (result.success) {
                    statusDiv.innerHTML = `
                        <h3>Account Verified Successfully!</h3>
                        <p>Your account has been verified. You can now proceed to login.</p>
                        <a href="login.html" class="button primary">Login Now</a>
                    `;
                } else {
                    statusDiv.innerHTML = `
                        <h3>Verification Failed</h3>
                        <p>${result.message}</p>
                        <a href="signup.html" class="button">Try Again</a>
                    `;
                }
            });
        }
    }

    // Dashboard Protection
    if (window.location.pathname.includes('dashboard.html')) {
        if (!auth.checkAuth()) {
            window.location.href = 'login.html';
        }
    }
});

(function($) {
    // Your existing code starts here
    var	$window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $nav = $('#nav'),
        $main = $('#main'),
        $navPanelToggle, $navPanel, $navPanelInner;

    // [Rest of your existing code...]
    
})(jQuery);
