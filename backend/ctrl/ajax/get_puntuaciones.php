<?php

require_once '../../config.php';

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
    $select = <<<SQL
      SELECT id_usuario, u.nombre AS nombre_usuario, id_ejercicio FROM envios AS e
      INNER JOIN usuarios AS u ON (e.id_usuario = u.id)
      WHERE id_estado=2
      GROUP BY id_usuario, id_ejercicio;
SQL;
    $parametros = [];

    $ejercicios_resueltos_por_usuarios = array();
    $result = $db->query($select, $parametros);

    foreach ($result as $fila) {
      $id_usuario = $fila["id_usuario"];
      $nombre_usuario = $fila["nombre_usuario"];
      $id_ejercicio = $fila["id_ejercicio"];
      $ejercicios_resueltos_por_usuarios[] = array(
        "id_usuario" => $id_usuario,
        "nombre_usuario" => $nombre_usuario,
        "id_ejercicio" => $id_ejercicio
      );
    }

    $resultado->set_estado(ResultadoJson::ESTADO_OK);
    $resultado->add_dato("ejercicios_resueltos_por_usuarios", $ejercicios_resueltos_por_usuarios);
  } catch (Exception $ex) {
    //$log->add_exception($ex);

    $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
    $resultado->set_mensaje($ex->getMessage());
  }
}
//$log->save();

echo $resultado->get_json();
