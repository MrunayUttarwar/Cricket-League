document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable the submit button to prevent double submission
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        userRole: document.getElementById('userRole').value
    };

    try {
        // Validate form data before sending
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            throw new Error('Please fill in all required fields');
        }

        console.log('Sending registration request:', formData);

        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            throw new Error(data.message || `Registration failed. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert(`Registration failed: ${error.message}`);
    } finally {
        submitButton.disabled = false;
    }
});