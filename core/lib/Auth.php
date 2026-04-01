<?php

namespace App\Lib;

class Auth {
    
    /**
     * Start the session and set configuration
     */
    public static function init() {
        if (session_status() == PHP_SESSION_NONE) {
            session_name(SESSION_NAME);
            session_start();
        }
    }

    /**
     * Set the user session after login
     */
    public static function login($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['name'] ?? 'User';
        $_SESSION['user_role'] = $user['role'] ?? 'STUDENT';
        $_SESSION['last_activity'] = time();
    }

    /**
     * Clear the session and logout
     */
    public static function logout() {
        self::init();
        $_SESSION = [];
        session_destroy();
        
        // Remove cookie
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
    }

    /**
     * Check if a user is logged in
     */
    public static function isLoggedIn() {
        self::init();
        return isset($_SESSION['user_id']);
    }

    /**
     * Get the logged-in user's role
     */
    public static function getRole() {
        self::init();
        return $_SESSION['user_role'] ?? null;
    }

    /**
     * Check if a user has a specific role
     */
    public static function hasRole($roles) {
        self::init();
        if (!is_array($roles)) {
            $roles = [$roles];
        }
        return in_array(self::getRole(), $roles);
    }

    /**
     * Ensure the user is logged in, redirect otherwise
     */
    public static function requireLogin() {
        if (!self::isLoggedIn()) {
            $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'];
            header("Location: /");
            exit();
        }
    }

    /**
     * Ensure the user has a specific role, redirect otherwise
     */
    public static function requireRole($roles) {
        self::requireLogin();
        if (!self::hasRole($roles)) {
            header("Location: /unauthorized");
            exit();
        }
    }

    /**
     * Get the logged-in user's ID
     */
    public static function getUserId() {
        self::init();
        return $_SESSION['user_id'] ?? null;
    }
}
