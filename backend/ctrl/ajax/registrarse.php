<?php

require_once '../../config.php';

$sesion = Session::get_instance();
$log = new log\MySqlDbLog();
$resultado = new ResultadoJson();

$json_params = file_get_contents("php://input");
$json_params = json_decode($json_params);

$db = PoolConnectionDb::get_instance()->get_connection_db();
$usuario = $json_params->usuario;
$clave = $json_params->clave;
try{
  if (isset($usuario) && isset($clave))  {
    if (strlen($usuario) < 3 || strlen($usuario) > 80) {
      $resultado->set_estado("error");
      $resultado->add_dato("tipo", "error");
      $resultado->set_mensaje("El nombre de usuario debe tener en 3 y 80 caracteres.");
    } else if (strlen($clave) < 8) {
      $resultado->set_estado("error");
      $resultado->add_dato("tipo", "error");
      $resultado->set_mensaje("La clave debe tener más de 8 caracteres.");
    } else if (strlen($clave) > 100) {
      $resultado->set_estado("error");
      $resultado->add_dato("tipo", "error");
      $resultado->set_mensaje("La clave debe tener 100 o menos caracteres.");
    } else {
      $db->begin_transaction();

      $consulta_usuario = <<<SQL
        SELECT COUNT(nombre) AS cantidad
        FROM usuarios
        WHERE nombre={nombre}
SQL;
      $parametros = ["nombre" => [$usuario, 's']];
      $usuarioExistente = $db->query($consulta_usuario, $parametros);
      if (isset($usuarioExistente) && $usuarioExistente[0]["cantidad"] > 0) {
        $resultado->set_estado("error");
        $resultado->add_dato("tipo", "error");
        $resultado->set_mensaje("El nombre de usuario ya existe.");
        $db->rollback();
      } else {
        $insert = <<<SQL
          INSERT INTO usuarios (nombre, password, fecha_creacion)
          VALUES ({nombre}, AES_ENCRYPT({clave},{llaveAes}), NOW())
SQL;
        $parametros = ["nombre" => [$usuario, 's'],
                       "clave" => [$clave, 's'],
                       "llaveAes" => [$DB_KEY_AES, 's']
                     ];
        $id_insertado = $db->insert($insert, $parametros);

        $db->commit();

        $select = <<<SQL
                      SELECT id, nombre FROM usuarios WHERE nombre={usuario}
SQL;
        $parametros = ["usuario" => [$usuario, "s"]];

        $result = $db->query($select, $parametros);
        if (count($result) == 1) {
          $id = $result[0]["id"];
          $nombre_usuario = $result[0]["nombre"];
          $us = new Usuario($id, $nombre_usuario, "", "");
          $sesion->log_in($us);

          $resultado->set_estado("ok");
        } else {
          $resultado->set_estado("error");
          $resultado->add_dato("tipo", "error");
          $resultado->set_mensaje("Se registró pero no se pudo iniciar sesión.");
        }
      }
    }
  } else {
    $resultado->set_estado("error");
    $resultado->add_dato("tipo", "error");
    $resultado->set_mensaje("No se estableció un nombre usuario o clave.");
  }
} catch (Exception $ex) {
    //$log->add_exception($ex);

    $db->rollback();

    $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
    $resultado->set_mensaje($ex->getMessage());
}
//$log->save();

echo $resultado->get_json();
