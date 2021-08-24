<?php

require_once '../config.php';

$sesion = Session::get_instance();

$sesion->log_out();

$sesion->redirect($LOGIN_PATH);
