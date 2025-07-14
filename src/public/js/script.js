const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const loading = document.getElementById('loading');
const successMessage = document.getElementById('successMessage');

// Form validation
function validateForm() {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate required fields
    const requiredFields = ['name', 'email', 'password'];

    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showError(field, 'This field is required');
            isValid = false;
        }
    });

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailPattern.test(data.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    if (data.password && data.password.length < 8) {
        showError('password', 'Password must be at least 8 characters long');
        isValid = false;
    }

    return isValid;
}

function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loading.style.display = 'block';

    try {
        // Prepare form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Send to backend - replace with your actual API endpoint
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Success
            successMessage.style.display = 'block';
            form.reset();

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            // Handle error response
            const errorData = await response.json();
            alert('Registration failed: ' + (errorData.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        loading.style.display = 'none';
    }
});

// Real-time validation
form.addEventListener('input', (e) => {
    const field = e.target;
    const errorElement = document.getElementById(field.name + 'Error');

    if (errorElement && errorElement.style.display === 'block') {
        errorElement.style.display = 'none';
    }
});