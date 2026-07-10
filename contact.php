<?php
header('Content-Type: application/json; charset=utf-8');

$recipient = 'synvextechnology@gmail.com';
$success = false;
$message = 'Unable to send message right now.';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $projectType = trim($_POST['project_type'] ?? '');
    $messageBody = trim($_POST['message'] ?? '');

    if ($name === '' || $email === '' || $phone === '' || $projectType === '' || $messageBody === '') {
        echo json_encode(['success' => false, 'message' => 'Please fill out all required fields.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
        exit;
    }

    $subject = 'New Website Inquiry from Synvex Technology';
    $body = "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n";
    $body .= "Project Type: $projectType\n\n";
    $body .= "Message:\n$messageBody\n";

    $headers = [];
    $headers[] = 'From: Synvex Technology <no-reply@' . $_SERVER['HTTP_HOST'] . '>';
    $headers[] = 'Reply-To: ' . $email;
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';

    $success = mail($recipient, $subject, $body, implode("\r\n", $headers));

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Your message could not be delivered. Please try again later.']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
