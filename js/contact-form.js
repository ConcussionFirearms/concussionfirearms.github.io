// File: js/contact-form.js

document.getElementById('contact-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const feedbackDiv = document.getElementById('form-feedback');

    try {
        // Send form data to Netlify function
        const response = await fetch('/.netlify/functions/contactForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, message }),
        });

        const result = await response.json();

        if (response.status === 200) {
            feedbackDiv.textContent = result.message;
            feedbackDiv.style.color = 'green';
        } else {
            feedbackDiv.textContent = result.message;
            feedbackDiv.style.color = 'red';
        }
    } catch (error) {
        // Catch any errors and display feedback
        feedbackDiv.textContent = 'There was an error submitting the form. Please try again later.';
        feedbackDiv.style.color = 'red';
    }
});
