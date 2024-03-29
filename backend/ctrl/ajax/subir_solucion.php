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

  function copiar_archivo_a_contenedor($id_contenedor, $ruta_origen, $ruta_destino) {
    $cmd_copiar = 'docker cp ' . $ruta_origen . ' ' . $id_contenedor . ':' . $ruta_destino;
    exec($cmd_copiar . ' 2>&1');
  }

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
        // Obtengo estado pendiente de evaluación.
        $select = <<<SQL
          SELECT id FROM estados_envio
          WHERE clave='pendiente_evaluacion'
SQL;
        $result = $db->query($select, []);
        if (count($result) == 1) {
          $id_estado = $result[0]["id"];
          $usuario = $sesion->get_user();
          $id_usuario = $usuario->get_id();
          $insert = <<<SQL
            INSERT INTO envios (id_ejercicio, id_usuario, id_estado, fecha_hora_envio, contenido)
            VALUES ({id_ejercicio}, {id_usuario}, {id_estado}, NOW(), {contenido})
SQL;
          $parametros = ["id_ejercicio" => [$id_ejercicio, 'i'],
                         "id_usuario" => [$id_usuario, 'i'],
                         "id_estado" => [$id_estado, 'i'],
                         "contenido" => [$solucion, 's']
                       ];
          $id_envio_insertado = $db->insert($insert, $parametros);

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
          copiar_archivo_a_contenedor($id_contenedor, $nombre_archivo_temporal, '/' . $id_ejercicio . '.sh');

          // Doy permisos de ejecución a la solución propuesta.
          $cmd_permisos = 'docker exec ' . $id_contenedor . ' bash -c "chmod 777 /' . $id_ejercicio . '.sh"';
          exec($cmd_permisos . ' 2>&1');

          // Defino variables para directorios.
          $dir_precondiciones_origen = "precondiciones";
          $dir_precondiciones_destino = "precondiciones";
          $dir_postcondiciones_origen = "postcondiciones";
          $dir_postcondiciones_destino = "postcondiciones";
          $dir_ejercicios_origen = "ejercicios";

          // Creo directorio de destino de precondiciones.
          $cmd_creacion_dir = 'docker exec ' . $id_contenedor . ' bash -c "mkdir /' . $dir_precondiciones_destino . '"';
          exec($cmd_creacion_dir . ' 2>&1');

          // Copio precondiciones.
          copiar_archivo_a_contenedor($id_contenedor, $dir_precondiciones_origen . '/' . $id_ejercicio, '/' . $dir_precondiciones_destino . '/' . $id_ejercicio . '.sh');

          // Doy permisos de ejecución a las precondiciones.
          $cmd_permisos = 'docker exec ' . $id_contenedor . ' bash -c "chmod +x /' . $dir_precondiciones_destino . '/' . $id_ejercicio . '.sh"';
          exec($cmd_permisos . ' 2>&1');

          // Creo directorio de destino de postcondiciones.
          $cmd_creacion_dir = 'docker exec ' . $id_contenedor . ' bash -c "mkdir /' . $dir_postcondiciones_destino . '"';
          exec($cmd_creacion_dir . ' 2>&1');

          // Copio postcondiciones.
          copiar_archivo_a_contenedor($id_contenedor, $dir_postcondiciones_origen . '/' . $id_ejercicio, '/' . $dir_postcondiciones_destino . '/' . $id_ejercicio . '.sh');

          // Doy permisos de ejecución a las postcondiciones.
          $cmd_permisos = 'docker exec ' . $id_contenedor . ' bash -c "chmod +x /' . $dir_postcondiciones_destino . '/' . $id_ejercicio . '.sh"';
          exec($cmd_permisos . ' 2>&1');

          // Copio juez al contenedor.
          copiar_archivo_a_contenedor($id_contenedor, 'juez', '/juez');

          // Doy permisos de ejecución al juez.
          $cmd_permisos = 'docker exec ' . $id_contenedor . ' bash -c "chmod 777 /juez"';
          exec($cmd_permisos . ' 2>&1');

          // Copio tests al contenedor.
          copiar_archivo_a_contenedor($id_contenedor, $dir_ejercicios_origen . '/' . $id_ejercicio, '/' . $id_ejercicio);

          // Ejecuto solución propuesta en el docker.
          // La solución se ejecuta como root y en el directorio /.
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
            // Establezco el estado de aceptación.
            $select = <<<SQL
              SELECT id FROM estados_envio
              WHERE clave='aceptado'
SQL;
            $result = $db->query($select, []);
            if (count($result) == 1) {
              $id_estado_aceptado = $result[0]["id"];
              $update = <<<SQL
                UPDATE envios SET fecha_hora_dictamen=NOW(), id_estado={$id_estado_aceptado}
                WHERE id={$id_envio_insertado}
SQL;
              $parametros = ["id_envio_insertado" => [$id_envio_insertado, 'i'],
                             "id_estado_aceptado" => [$id_estado_aceptado, 'i']
                           ];
              $db->update($update, $parametros);
            }

            $resultado->set_estado(ResultadoJson::ESTADO_OK);
            $resultado->add_dato("salida", "Ok");
          } else {
            // Establezco el estado de error.
            $select = <<<SQL
              SELECT id FROM estados_envio
              WHERE clave='error'
SQL;
            $result = $db->query($select, []);
            if (count($result) == 1) {
              $id_estado_error = $result[0]["id"];
              $update = <<<SQL
                UPDATE envios SET fecha_hora_dictamen=NOW(), id_estado={$id_estado_error}
                WHERE id={$id_envio_insertado}
SQL;
              $parametros = ["id_envio_insertado" => [$id_envio_insertado, 'i'],
                             "id_estado_error" => [$id_estado_error, 'i']
                           ];
              $db->update($update, $parametros);
            }

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
