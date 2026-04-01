<?php
/**
 * AviatorTutor Logout Action
 */

use App\Lib\Auth;

App\Lib\Auth::init();
App\Lib\Auth::logout();

header("Location: /");
exit();
