<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Define email parameters
    $to = "ConcussionFirearms@outlook.com";
    $subject = "New Contact Form Submission";
    $headers = "From: " . $email;
    $body = "Name: " . $name . "\nEmail: " . $email . "\nMessage: " . $message;

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo "Message sent successfully.";
    } else {
        echo "Failed to send message.";
    }
}
?>
