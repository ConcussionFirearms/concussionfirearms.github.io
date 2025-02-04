document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(this);

  fetch('/.netlify/functions/submit-form', { // Or /.github/actions/submit-form for GH Actions
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      alert('Thank you for your message!');
      this.reset();
    } else {
      alert('An error occurred. Please try again later.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred. Please try again later.');
  });
});
