document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form[data-netlify="true"]');
    const feedbackDiv = document.getElementById('form-feedback');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                feedbackDiv.textContent = 'Thanks for your message! We will get back to you shortly.';
                feedbackDiv.style.color = 'green';
                form.reset(); // Reset the form fields
            } else {
                // Show error message
                feedbackDiv.textContent = 'There was an error sending your message. Please try again later.';
                feedbackDiv.style.color = 'red';
            }
        })
        .catch(error => {
            feedbackDiv.textContent = 'There was an error submitting the form. Please try again later.';
            feedbackDiv.style.color = 'red';
        });
    });
});
