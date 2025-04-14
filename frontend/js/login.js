document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        };

        // Validate input
        if (!formData.email || !formData.password) {
            throw new Error('Please fill in all fields');
        }

        console.log('Attempting login...', { email: formData.email });

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Show success message
        alert('Login successful! Welcome ' + data.user.firstName);

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Log the user role for debugging
        console.log('User role:', data.user.userRole);
        
        // Redirect to team dashboard
        if (data.user.userRole === 'player') {
            window.location.href = 'players.html';
        } else {
            window.location.href = 'team-dashboard.html';
        }

    } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'An error occurred during login');
    } finally {
        submitButton.disabled = false;
    }
});

// Add this to verify login state
window.addEventListener('load', () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        console.log('User is logged in:', userData.email);
    }
});