<?php

require_once '../../config.php';

$sesion = Session::get_instance();
$log = new log\MySqlDbLog();
$resultado = new ResultadoJson();

$json_params = file_get_contents("php://input");
$json_params = json_decode($json_params);

$usuario = $json_params->usuario;
$clave = $json_params->clave;

$db = PoolConnectionDb::get_instance()->get_connection_db();
try {
  $select = <<<SQL
                SELECT id, nombre FROM usuarios WHERE nombre={usuario} AND password=AES_ENCRYPT({clave},{llaveAes})
SQL;
  $parametros = ["usuario" => [$usuario, "s"],
                 "clave" => [$clave, "s"],
                 "llaveAes" => [$DB_KEY_AES, "s"]];

  $result = $db->query($select, $parametros);
  if (count($result) == 1) {
    $id = $result[0]["id"];
    $nombre_usuario = $result[0]["nombre"];
    $us = new Usuario($id, $nombre_usuario, "", "");
    $sesion->log_in($us);
    $resultado->set_estado("ok");
  } else {
    $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
    $resultado->add_dato("tipo", "error");
    $resultado->set_mensaje("Error al iniciar sesión.");
  }
} catch (Exception $ex) {
  //$log->add_exception($ex);

  $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
  $resultado->set_mensaje($ex->getMessage());
}
//$log->save();

echo $resultado->get_json();
