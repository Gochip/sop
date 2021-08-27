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
    // Obtengo entradas del front.
    $solucion = file_get_contents("php://input");
    $id_ejercicio = filter_input(INPUT_GET, "id_ejercicio");

    if (isset($solucion) && isset($id_ejercicio) && is_numeric($id_ejercicio) &&
        strlen($solucion) <= 3000) {
      // Verifico si existe el ejercicio.
      $select = <<<SQL
        SELECT id, titulo FROM ejercicios
        WHERE id={id}
SQL;
      $parametros = ["id" => [$id_ejercicio, "i"]];

      $result = $db->query($select, $parametros);
      if (count($result) == 1) {
        // Creo el contenedor.
        $id_contenedor = null;
        ob_start();
        exec("docker run -d -it ubuntu bash 2>&1", $id_contenedor);
        $result = ob_get_contents();
        ob_end_clean();

        // Guardo el id_contenedor.
        $id_contenedor = $id_contenedor[0];

        // Creo un archivo temporal con la solución propuesta.
        $nombre_archivo_temporal = "nombre_temporal_" . $id_contenedor;
        $mi_archivo = fopen($nombre_archivo_temporal, "w");
        fwrite($mi_archivo, $solucion);

        // Copio el archivo de la solución al contenedor.
        $cmd_copiar = 'docker cp ' . $nombre_archivo_temporal . ' ' . $id_contenedor . ':/' . $id_ejercicio . '.sh';
        exec($cmd_copiar . ' 2>&1');

        // Doy permisos de ejecución a la solución propuesta.
        $cmd_permisos = 'docker exec ' . $id_contenedor . ' bash -c "chmod 777 /' . $id_ejercicio . '.sh"';
        exec($cmd_permisos . ' 2>&1');

        // Copio juez al contenedor.
        $cmd_copiar = 'docker cp juez ' . $id_contenedor . ':/juez';
        exec($cmd_copiar . ' 2>&1');

        // Doy permisos de ejecución al juez.
        $cmd_permisos = 'docker exec ' . $id_contenedor . ' bash -c "chmod 777 /juez"';
        exec($cmd_permisos . ' 2>&1');

        // Copio tests al contenedor.
        $cmd_copiar = 'docker cp ' . $id_ejercicio . ' ' . $id_contenedor . ':/' . $id_ejercicio;
        exec($cmd_copiar . ' 2>&1');

        // Ejecuto solución propuesta en el docker.
        ob_start();
        $cmd = 'docker exec ' . $id_contenedor . ' bash -c "/bin/bash /juez ' . $id_ejercicio . '"';
        $salidas = null;
        exec($cmd . ' 2>&1', $salidas);
        $result = ob_get_contents();
        ob_end_clean();

        // Verifico salidas de la solución propuesta.
        $salida = "";
        foreach ($salidas as $s) {
          $salida .= $s;
        }

        // Limpiar contenedor.
        $cmd = 'docker container stop ' . $id_contenedor;
        exec($cmd . ' 2>&1');

        // Eliminar archivo temporal.
        unlink($nombre_archivo_temporal);

        // Generar respuesta.
        if (trim($salida) === "Ok") {
          $resultado->set_estado(ResultadoJson::ESTADO_OK);
          $resultado->add_dato("salida", "Ok");
        } else {
          $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
          $resultado->add_dato("salida", trim($salida));
        }
      } else {
        $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
        $resultado->add_dato("salida", "Error");
      }
    } else {
      $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
      $resultado->add_dato("salida", "Error");
    }
  } catch (Exception $ex) {
    //$log->add_exception($ex);

    $resultado->set_estado(ResultadoJson::ESTADO_ERROR);
    $resultado->add_dato("salida", "Error");
  }
}
//$log->save();

echo $resultado->get_json();
