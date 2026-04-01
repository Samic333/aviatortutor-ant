<?php
/**
 * AviatorTutor Register Action
 */

use App\Lib\Database;
use App\Lib\Auth;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /");
    exit();
}

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$role = $_POST['role'] ?? 'STUDENT'; // Default to student
$airlineId = $_POST['airlineId'] ?? null;
$company = $_POST['company'] ?? null;

if (empty($name) || empty($email) || empty($password)) {
    $_SESSION['error'] = "Please fill in all required fields.";
    header("Location: /?auth=signup");
    exit();
}

if (strlen($password) < 8) {
    $_SESSION['error'] = "Password must be at least 8 characters.";
    header("Location: /?auth=signup");
    exit();
}

try {
    $db = Database::getInstance();
    
    // Check if user exists
    $db->query("SELECT id FROM users WHERE email = :email");
    $db->bind(':email', $email);
    if ($db->single()) {
        $_SESSION['error'] = "A user with this email already exists.";
        header("Location: /?auth=signup");
        exit();
    }

    $db->beginTransaction();

    // Create User
    $userId = 'u_' . bin2hex(random_bytes(8));
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    
    $db->query("INSERT INTO users (id, name, email, password_hash, role) VALUES (:id, :name, :email, :password_hash, :role)");
    $db->bind(':id', $userId);
    $db->bind(':name', $name);
    $db->bind(':email', $email);
    $db->bind(':password_hash', $passwordHash);
    $db->bind(':role', $role);
    $db->execute();

    // Create Profile
    if ($role === 'INSTRUCTOR') {
        $profileId = 'ip_' . bin2hex(random_bytes(8));
        $db->query("INSERT INTO instructor_profiles (id, user_id, airline_id, company, pending_approval) VALUES (:id, :user_id, :airline_id, :company, TRUE)");
        $db->bind(':id', $profileId);
        $db->bind(':user_id', $userId);
        $db->bind(':airline_id', $airlineId ?: null);
        $db->bind(':company', $company ?: null);
        $db->execute();
    } else {
        $profileId = 'sp_' . bin2hex(random_bytes(8));
        $db->query("INSERT INTO student_profiles (id, user_id) VALUES (:id, :user_id)");
        $db->bind(':id', $profileId);
        $db->bind(':user_id', $userId);
        $db->execute();
    }

    $db->commit();

    // Log the user in
    $user = [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
        'role' => $role
    ];
    Auth::login($user);

    // Redirect
    $redirect = ($role === 'INSTRUCTOR') ? '/instructor' : '/student';
    header("Location: " . $redirect);
    exit();

} catch (\Exception $e) {
    if (isset($db)) $db->rollBack();
    error_log($e->getMessage());
    $_SESSION['error'] = "An error occurred during registration. Please try again.";
    header("Location: /?auth=signup");
    exit();
}
