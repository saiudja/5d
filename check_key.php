<?php
$correct_key = 'activation';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $key = $_POST['key'] ?? '';
    if ($key === $correct_key) {
        echo 'OK';
    } else {
        echo 'ERROR';
    }
} else {
    http_response_code(405);
    echo 'Method Not Allowed';
}
?>