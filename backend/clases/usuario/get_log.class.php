<?php

namespace log;

class GetLog {

    /**
     * Retorna los logs para un determinado sistema.
     */
    public static function get_log_aplicacion($id_sistema, $desde, $cantidad = 10, $level = Log::APP) {
        $db = \PoolConnectionDb::get_instance()->get_connection_db();
        $consulta = <<<SQL
                SELECT * FROM logs
                WHERE level={level} AND system_id={id_sistema}
                ORDER BY date DESC
                LIMIT {cantidad} OFFSET {desde}
SQL;
        $resultado = $db->query($consulta, array(
                'level' => [$level, 's'],
                'id_sistema' => [$id_sistema, 's'],
                'cantidad' => [$cantidad, 'd'],
                'desde' => [$desde, 'd']
            )
        );
        
        $app_logs = array();
        $len_resultado = count($resultado);
        for ($i = 0; $i < $len_resultado; $i++) {
            $fila_log = $resultado[$i];
            $app_log = new AppLog();
            $app_log->set_texto($fila_log["text"]);
            $user_id = $fila_log["user_id"];
            $usuario = new \Usuario($user_id, '');
            $app_log->set_usuario($usuario);
            $app_log->set_fecha(date("d/m/Y H:i", strtotime($fila_log["date"])));
            $app_logs[] = $app_log;
        }
        return $app_logs;
    }

}

class AppLog {

    private $texto;
    private $usuario;
    private $fecha;

    function get_texto() {
        return $this->texto;
    }

    function get_usuario() {
        return $this->usuario;
    }

    function get_fecha() {
        return $this->fecha;
    }

    function set_texto($texto) {
        $this->texto = $texto;
    }

    function set_usuario($usuario) {
        $this->usuario = $usuario;
    }

    function set_fecha($fecha) {
        $this->fecha = $fecha;
    }

}
