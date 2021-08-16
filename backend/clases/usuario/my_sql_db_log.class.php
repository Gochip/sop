<?php

namespace log;

/**
 * Clase que permite registrar los logs en una base de datos MySql
 * Cambios:
 *     Agrego constructor.
 *     Agrego ip y scripts a la BD.
 *
 * Modificada y adaptada para este proyecto:
 *     Agrego el system_id.
 * 
 * @version 1.0.2
 */
final class MySqlDbLog extends DBLog {

    public function __construct($user = '', $id_sistema = null) {
        parent::__construct($user);
        $this->id_sistema = $id_sistema;
    }

    /**
     * Inserta un array de mensajes en la BD
     * @param \log\Message[] $messages
     * @return boolean True en caso de éxito, false caso contrario
     */
    protected function insert_messages($messages) {
        if(empty($messages)) return false;
        $ok = true;
        $con = new \mysqli(parent::$_HOST, parent::$_USER, parent::$_PASS,
                parent::$_DATABASE);
        $con->set_charset('utf8');

        if ($con->connect_errno) {
            return false;
        }
        $user = $this->get_user();
        if (!isset($user) || $user === "Anonym") {
            $user = null;
        }
        foreach ($messages as $msg) {
            $text = $this->sanitize($con, $msg->get_text());
            $level = $this->sanitize($con, $msg->get_level());
            $script = filter_input(INPUT_SERVER, 'PHP_SELF');
            $ip = filter_input(INPUT_SERVER, 'REMOTE_ADDR');
            $system_id = $this->id_sistema;

            if (isset($user) && isset($system_id)) {
                $insert = "INSERT INTO logs (text, level, user_id, date, script, ip, system_id) VALUES ";
                $insert .= " ('$text','$level','$user', NOW(), '$script', '$ip','$system_id')";
            } else if (isset($user)) {
                $insert = "INSERT INTO logs (text, level, user_id, date, script, ip) VALUES ";
                $insert .= " ('$text','$level','$user', NOW(), '$script', '$ip')";
            } else if (isset($system_id)) {
                $insert = "INSERT INTO logs (text, level, date, script, ip, system_id) VALUES ";
                $insert .= " ('$text','$level', NOW(), '$script', '$ip','$system_id')";
            } else {
                $insert = "INSERT INTO logs (text, level, date, script, ip) VALUES ";
                $insert .= " ('$text','$level', NOW(), '$script', '$ip')";
            }

            $result = $con->query($insert);

            if ($result === 0) {
                $ok = false;
                break;
            }
        }
        $con->close();
        return $ok;
    }

    public function set_id_sistema($id_sistema) {
        $this->id_sistema = $id_sistema;
    }

    private function sanitize($con, $input) {
        return mysqli_real_escape_string($con, $input);
    }

    /**
     * Retorna la fecha con el formato para insertar en una bd Mysql
     * @param int $timestamp Timestamp del mensaje
     * @return string Fecha con el formato aaaa-mm-dd hh:mm:ss
     */
    protected function get_date_time($timestamp) {
        return date("Y-m-d H:i:s", $timestamp);
    }

}
