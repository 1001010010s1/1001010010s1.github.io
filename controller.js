// Add this at the start of your controller code
async function checkAccess() {
    const token = localStorage.getItem('solar_token');
    if (!token) {
        window.location.href = '/login.html';
        return false;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!data.success || data.daysRemaining <= 0) {
            window.location.href = '/login.html';
            return false;
        }

        // Show days remaining
        document.getElementById('days-remaining').textContent = 
            `Days Remaining: ${data.daysRemaining}`;
        return true;
    } catch (error) {
        window.location.href = '/login.html';
        return false;
    }
} 