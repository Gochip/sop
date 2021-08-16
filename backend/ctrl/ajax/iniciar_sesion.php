<?php

require_once '../../config.php';

$sesion = Session::get_instance();
$log = new log\MySqlDbLog();
$resultado = new ResultadoJson();

$json_params = file_get_contents("php://input");
$json_params = json_decode($json_params);

$usuario = $json_params->usuario;
$clave = $json_params->clave;

if ($usuario === "german" && $clave === "parisi") {
    $resultado->set_estado("ok");
} else {
    $resultado->set_estado("error");
    $resultado->add_dato("tipo", "error");
    $resultado->set_mensaje("Error al iniciar sesión.");
}
//$log->save();

echo $resultado->get_json();