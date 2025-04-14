document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

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
        console.log('Sending registration request:', formData); // Debug log

        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('Response received:', response); // Debug log

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = './login.html';
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message || 'An error occurred during registration');
    } finally {
        submitButton.disabled = false;
    }
});