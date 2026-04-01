<?php
/**
 * AviatorTutor Login Action
 */

use App\Lib\Database;
use App\Lib\Auth;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /");
    exit();
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    $_SESSION['error'] = "Please fill in all fields.";
    header("Location: /?auth=signin");
    exit();
}

try {
    $db = Database::getInstance();
    $db->query("SELECT * FROM users WHERE email = :email");
    $db->bind(':email', $email);
    $user = $db->single();

    if ($user && password_verify($password, $user['password_hash'])) {
        // Success
        Auth::login($user);
        
        // Redirect based on role
        $role = $user['role'];
        $redirect = '/student';
        if ($role === 'INSTRUCTOR') $redirect = '/instructor';
        elseif ($role === 'ADMIN' || $role === 'SUPER_ADMIN') $redirect = '/admin';
        
        // Check if there was a previous redirect
        if (isset($_SESSION['redirect_after_login'])) {
            $redirect = $_SESSION['redirect_after_login'];
            unset($_SESSION['redirect_after_login']);
        }
        
        header("Location: " . $redirect);
        exit();
    } else {
        // Fail
        $_SESSION['error'] = "Invalid email or password.";
        header("Location: /?auth=signin");
        exit();
    }
} catch (\Exception $e) {
    error_log($e->getMessage());
    $_SESSION['error'] = "An error occurred. Please try again later.";
    header("Location: /?auth=signin");
    exit();
}
