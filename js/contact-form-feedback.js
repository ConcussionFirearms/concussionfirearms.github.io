document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const feedbackDiv = document.getElementById('form-feedback');
    const form = document.getElementById('contact-form');

    // Optionally, clear any previous feedback
    feedbackDiv.textContent = '';

    // Show a loading message until form submission is complete
    feedbackDiv.textContent = 'Sending your message...';
    feedbackDiv.style.color = 'blue';

    // Create a FormData object to send with fetch (if needed, to show loading)
    const formData = new FormData(form);

    // Manually submit the form using the fetch API
    fetch('/', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            // Show success message
            feedbackDiv.textContent = 'Thanks for your message! We will get back to you shortly.';
            feedbackDiv.style.color = 'green';
            form.reset(); // Reset the form fields
        } else {
            // Show error message if submission failed
            feedbackDiv.textContent = 'There was an error sending your message. Please try again later.';
            feedbackDiv.style.color = 'red';
        }
    })
    .catch(error => {
        // Catch any fetch errors
        feedbackDiv.textContent = 'There was an error submitting the form. Please try again later.';
        feedbackDiv.style.color = 'red';
    });
});
