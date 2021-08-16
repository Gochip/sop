<?php

/**
 * 
 * @author Parisi Germán
 * @version 1.0
 */
class UtilJsonEmbebido {

    private $array_con_elemento_borrado;
    private $elemento_eliminado;
    private $array_con_elemento_insertado;

    public function eliminar_elemento($array, $callback_igualdad) {
        $this->array_con_elemento_borrado = $this->eliminar_elemento_rec($array, $callback_igualdad);
    }

    private function eliminar_elemento_rec($array, $callback_igualdad) {
        $tmp = array();
        if (is_array($array)) {
            $len_array = count($array);
            for ($i = 0; $i < $len_array; $i++) {
//                if ($callback_igualdad($array[$i])) {
//                    $this->elemento_eliminado[] = $array[$i];
//                } else {
//                    if (isset($array[$i]["bases_datos"])) {
//                        $bases_datos = $array[$i]["bases_datos"];
//                        $tmp[]["bases_datos"] = self::eliminar_elemento_rec($bases_datos->jsonSerialize(), $callback_igualdad);
//                    } else {
//                        $tmp[] = $array[$i];
//                    }
//                }
                if (!$callback_igualdad($array[$i])) {
                    if (isset($array[$i]["bases_datos"])) {
                        $bases_datos = $array[$i]["bases_datos"];
                        $fila = $array[$i];
                        if(!is_array($bases_datos)){
                            $fila["bases_datos"] = self::eliminar_elemento_rec($bases_datos->jsonSerialize(), $callback_igualdad);
                        } else {
                            $fila["bases_datos"] = self::eliminar_elemento_rec($bases_datos, $callback_igualdad);
                        }
                        $tmp[] = $array[$i];
                    } else {
                        $tmp[] = $array[$i];
                    }
                } else {
                    $this->elemento_eliminado = $array[$i];
                }

//                if ($callback_igualdad($array[$i])) {
//                    if (isset($tmp[$i]["bases_datos"])) {
//                        $tmp[$i]["bases_datos"][] = $nuevo_elemento;
//                    } else {
//                        $tmp[$i]["bases_datos"] = array();
//                        $tmp[$i]["bases_datos"][] = $nuevo_elemento;
//                    }
//                }
            }
        }
        return $tmp;
    }

    public function insertar_elemento($array, $nuevo_elemento, $callback_igualdad) {
        $this->array_con_elemento_insertado = $this->insertar_elemento_rec($array, $nuevo_elemento, $callback_igualdad);
    }

    private function insertar_elemento_rec($array, $nuevo_elemento, $callback_igualdad) {
        $tmp = array();
        if (is_array($array)) {
            $len_array = count($array);
            for ($i = 0; $i < $len_array; $i++) {
                if (isset($array[$i]["bases_datos"])) {
                    $bases_datos = $array[$i]["bases_datos"];
                    $tmp[$i] = $array[$i];
                    if(!is_array($bases_datos)){
                        $tmp[$i]["bases_datos"] = self::insertar_elemento_rec($bases_datos->jsonSerialize(), $nuevo_elemento, $callback_igualdad);
                    } else {
                        $tmp[$i]["bases_datos"] = self::insertar_elemento_rec($bases_datos, $nuevo_elemento, $callback_igualdad);
                    }
                } else {
                    $tmp[] = $array[$i];
                }
                if ($callback_igualdad($array[$i])) {
                    if (isset($tmp[$i]["bases_datos"])) {
                        $tmp[$i]["bases_datos"][] = $nuevo_elemento;
                    } else {
                        $tmp[$i]["bases_datos"] = array();
                        $tmp[$i]["bases_datos"][] = $nuevo_elemento;
                    }
                }
            }
        }
        return $tmp;
    }

    function get_array_con_elemento_borrado() {
        return $this->array_con_elemento_borrado;
    }

    function get_elemento_eliminado() {
        return $this->elemento_eliminado;
    }

    function get_array_con_elemento_insertado() {
        return $this->array_con_elemento_insertado;
    }

}
