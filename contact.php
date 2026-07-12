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
        header('Location: thank-you.html', true, 303);
        exit;
    }

    $message = 'Your message could not be delivered. Please try again later or contact us directly at synvextechnology@gmail.com.';
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Message Delivery Failed</title><style>body{font-family:Arial,sans-serif;background:#080c14;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:1rem;text-align:center}a{color:#00f2fe;text-decoration:none}</style></head><body><div><h1>Unable to send your inquiry</h1><p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p><p><a href="index.html#contact">Return to contact form</a></p></div></body></html>';
    exit;
}

echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Invalid Request</title><style>body{font-family:Arial,sans-serif;background:#080c14;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:1rem;text-align:center}a{color:#00f2fe;text-decoration:none}</style></head><body><div><h1>Invalid request method</h1><p>Please access the contact form from the website and try again.</p><p><a href="index.html#contact">Back to contact form</a></p></div></body></html>';
