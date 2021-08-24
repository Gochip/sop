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
                  SELECT id, titulo, contenido, nivel FROM ejercicios
SQL;
    $parametros = [];

    $ejercicios = array();
    $result = $db->query($select, $parametros);

    foreach ($result as $fila) {
      $id = $fila["id"];
      $titulo = $fila["titulo"];
      $contenido = $fila["contenido"];
      $nivel = $fila["nivel"];

      $ejercicios[] = array(
        "id" => $id,
        "titulo" => $titulo,
        "contenido" => $contenido,
        "nivel" => $nivel
      );
    }

    $resultado->set_estado(ResultadoJson::ESTADO_OK);
    $resultado->add_dato("ejercicios", $ejercicios);
  } catch (Exception $ex) {
    //$log->add_exception($ex);

    $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
    $resultado->set_mensaje($ex->getMessage());
  }
}
//$log->save();

echo $resultado->get_json();
