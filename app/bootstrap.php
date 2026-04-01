<?php
/**
 * AviatorTutor PHP Bootstrap
 */

// Include Config
require_once __DIR__ . '/../config/config.php';

// Simple Autoloader (Replaces Composer Autoload for now)
spl_autoload_register(function ($class) {
    // Map namespace to directory
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require_once $file;
    }
});

// Initialize Auth
App\Lib\Auth::init();
