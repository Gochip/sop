<?php

require_once '../../config.php';
ini_set("display_errors", 1);

$sesion = Session::get_instance();
$log = new log\MySqlDbLog();
$resultado = new ResultadoJson();

if (!$sesion->is_active()) {
    $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
    $resultado->add_dato("tipo", "sesion_invalida");
    $resultado->add_dato("url", "$LOGIN_PATH");
    $resultado->set_mensaje("Sesión inactiva");

    //Log
    //$log->add_message("Sesión inactiva", log\Log::WARNING);
} else {
  $db = PoolConnectionDb::get_instance()->get_connection_db();
  try {

    $id_contenedor = null;
    ob_start();
    exec("docker run -d -it ubuntu bash 2>&1", $id_contenedor);
    $result = ob_get_contents();
    ob_end_clean();

    $id_contenedor = $id_contenedor[0];

    ob_start();
    $shell_script = 'A=2;B=3;let C=$A*$B;echo $C';

    $nombre_archivo_temporal = "nombre_temporal";
    $mi_archivo = fopen($nombre_archivo_temporal, "w");
    fwrite($mi_archivo, $shell_script);
    $cmd_copiar = 'docker cp ' . $nombre_archivo_temporal . ' ' . $id_contenedor . ':/' . $nombre_archivo_temporal;

    $salidas = null;
    exec($cmd_copiar . ' 2>&1', $salidas);

    $cmd = 'docker exec ' . $id_contenedor . ' bash -c "/bin/bash /' . $nombre_archivo_temporal . '"';
    $salidas = null;
    exec($cmd . ' 2>&1', $salidas);
    $result = ob_get_contents();
    ob_end_clean();

    $salida = "";
    foreach ($salidas as $s) {
      $salida .= $s . "<br/>";
    }

    $resultado->set_estado(ResultadoJson::ESTADO_OK);
    $resultado->add_dato("salida", $salida);
  } catch (Exception $ex) {
    //$log->add_exception($ex);

    $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
    $resultado->set_mensaje($ex->getMessage());
  }
}
//$log->save();

echo $resultado->get_json();
