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

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on user role
        if (data.user.userRole === 'team_manager') {
            window.location.href = '/UI/team-dashboard.html';
        } else {
            window.location.href = '/UI/team-dashboard.html';
        }

    } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'An error occurred during login');
    } finally {
        submitButton.disabled = false;
    }
});