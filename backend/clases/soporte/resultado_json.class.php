<?php

/**
 * 
 * @author Parisi Germán
 * @version 1.0
 */
class ResultadoJson {

    /**
     * Es el estado de la respuesta.
     * Se pueden usar las constantes definidas en esta misma clase o cualquier otro string.
     * @var string $estado
     */
    private $estado;

    /**
     * Es un mensaje que explica el resultado.
     * @var string $mensaje
     */
    private $mensaje;

    /**
     * Son los datos asociados a este resultado.
     * @var string[] $datos
     */
    private $datos;

    const ESTADO_OK = "ok";
    const ESTADO_ERROR = "error";

    public function __construct() {
        $this->estado = null;
        $this->mensaje = "";
        $this->datos = array();
        $this->respuesta_http = 200;
    }

    public function set_estado($estado) {
        $this->estado = $estado;
        if ($estado === self::ESTADO_OK) {
            $this->respuesta_http = 200;
        } else {
            http_response_code(500);
            $this->respuesta_http = 500;
        }
    }

    public function set_mensaje($mensaje) {
        $this->mensaje = $mensaje;
    }

    public function add_dato($clave, $dato) {
        $this->datos[$clave] = $dato;
    }

    public function get_estado() {
        return $this->estado;
    }

    public function get_mensaje() {
        return $this->mensaje;
    }

    public function get_datos() {
        return $this->datos;
    }

    public function get_json() {
        $resultado = array();
        if (isset($this->estado)) {
            $resultado["estado"] = $this->estado;
            $resultado["mensaje"] = $this->mensaje;
            $resultado["datos"] = $this->datos;
        } else {
            throw new RuntimeException("No se incluyó un resultado en la respuesta");
        }
        return json_encode($resultado);
    }

}
