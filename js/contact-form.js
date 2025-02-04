document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(this);

  fetch('/_actions/workflows/contact-form/dispatches', {  // Correct endpoint for GH Actions
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData.entries())) // Convert FormData to JSON
  })
  .then(response => {
    if (response.ok) {
      alert('Thank you for your message!');
      this.reset();
    } else {
      return response.text().then(err => {throw new Error(err)}); // More detailed error handling
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred. Please try again later.');
  });
});
