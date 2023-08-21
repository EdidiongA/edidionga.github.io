
<?php
require 'phpmailer/PHPMailerAutoload.php';

// Get form data
$full_name = $_POST['full_name'];
$email = $_POST['email'];
$mobile_number = $_POST['mobile_number'];
$email_subject = $_POST['email_subject'];
$message = $_POST['message'];

// Validate form data
if (filter_var($email, FILTER_VALIDATE_EMAIL) && $full_name && $message) {
    // Create a new PHPMailer instance
    $mail = new PHPMailer;

    // Configure SMTP settings
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'your_username';
    $mail->Password = 'your_password';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // Set sender and recipient
    $mail->setFrom($email, $full_name);
    $mail->addAddress('didianwanane@gmail.com');

    // Set email subject and body
    $mail->Subject = $email_subject;
    $mail->Body = "Full Name: $full_name\nEmail: $email\nMobile Number: $mobile_number\nMessage: $message";

    // Attempt to send the email
    if ($mail->send()) {
        echo 'Message sent successfully!';
    } else {
        echo 'Message could not be sent.';
    }
} else {
    echo 'Invalid form data.';
}
?>
