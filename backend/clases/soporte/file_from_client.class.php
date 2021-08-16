<?php

/**
 * Esta clase encapsula los datos de un archivo que llega desde el cliente.
 * Este archivo puede ser una imagen o cualquier otro tipo de archivo.
 * 
 * PRECAUCIÓN: Luego de llamar a get_content() es probable que se necesite llamar
 * a mysqli_real_escape_string (no comprobado si es necesario).
 *
 * Versiones:
 * 1.2.1: Agrega variable $_directory_upload
 * 1.2.2: Ya no lanza una excepción en el get_image cuando el input file fue enviado vacío sino que devuelve null
 * 1.2.3: Agrega variable estática $_MAX_SIZE para indicar el tamaño máximo de la imagen.
 * 1.3: Se cambia el nombre de esta clase de Image a FileFromClient.
 * Antes estaba pensado para una Imagen. Ahora es para un archivo de cualquier tipo.
 * 
 * Ejemplo:
 *
 * $file_from_client = FileFromClient::get_file("input_file");
 * $nombre_file = $file_from_client->get_name();
 * $file_from_client->upload($nombre_file, 'dir/');
 * $content = $file_from_client->get_content(); // return BLOB
 * $save_in_database($content);
 *
 *
 * @author: Parisi Germán
 * @version: 1.3
 */
class FileFromClient {

    /**
     *
     * @var string es el nombre original del archivo en la máquina cliente.
     */
    private $_name;

    /**
     *
     * @var string es el tipo mime del archivo. Ejemplo: "image/gif".
     */
    private $_type;

    /**
     *
     * @var int es el tamaño del archivo en bytes.
     */
    private $_size;

    /**
     *
     * @var string es el nombre temporal del archivo.
     */
    private $_tmp_name;

    /**
     *
     * @var int es el código de error asociado a la carga de la imagen.
     */
    private $_error;

    /*
     *
     * @var string es el nombre del archivo subido.
     */
    private $_file_name_upload;

    /**
     *
     * @var string es el nombre del directorio donde se va a subir.
     */
    private $_directory_upload;

    /*
     *
     * @var boolean indica si el archivo fue subido al servidor.
     */
    private $_uploaded;
    
    /**
     * 
     * @var int tamaño máximo de la imagen.
     */
    private static $_MAX_SIZE = 1000000;

    public function __construct($error, $name, $type, $size, $tmp_name) {
        $this->_error = $error;
        $this->_name = $name;
        $this->_type = $type;
        $this->_size = $size;
        $this->_tmp_name = $tmp_name;
    }

    /**
     * Retorna un objeto Image a partir del input file html.
     * 
     * @param string es el name del campo file html.
     * @return FileFromClient 
     */
    public static function get_file($input_file) {
        $error = (int) $_FILES[$input_file]['error'];
        $name = $_FILES[$input_file]['name'];
        $type = $_FILES[$input_file]['type'];
        $size = $_FILES[$input_file]['size'];
        $tmp_name = $_FILES[$input_file]['tmp_name'];
        if ($error === 0) {
            if($size > self::$_MAX_SIZE){
                throw new RuntimeException("El tamaño de la imagen es demasiado grande");
            }
            $image = new FileFromClient($error, $name, $type, $size, $tmp_name);
            return $image;
        } else {
            if($error === UPLOAD_ERR_NO_FILE){
                return null;
            } else {
                throw new RuntimeException("Error en el campo input file: $input_file ($error)");
            }
        }
    }

    public function get_name() {
        return $this->_name;
    }

    public function get_type() {
        return $this->_type;
    }

    /**
     * Retorna la extension con el punto
     * @return string
     */
    public function get_extension() {
        $parts = explode(".", $this->_name);
        if (count($parts) >= 2) {
            return '.' . $parts[count($parts) - 1];
        } else {
            return '.unknown';
        }
    }

    public function get_size() {
        return $this->_size;
    }

    public function get_tmp_name() {
        return $this->_tmp_name;
    }

    public function get_error() {
        return $this->_error;
    }

    public function is_uploaded() {
        return $this->_uploaded;
    }

    public function get_file_name_upload() {
        return $this->_file_name_upload;
    }

    public function get_directory_upload() {
        return $this->_directory_upload;
    }

    /*
     * Carga la imagen en el servidor.
     *
     */

    public function upload($file_name_upload, $directory_upload = "/tmp/") {
        $uploaded = move_uploaded_file($this->_tmp_name,
                $directory_upload . $file_name_upload);
        $this->_file_name_upload = $file_name_upload;
        $this->_directory_upload = $directory_upload;
        $this->_uploaded = $uploaded;
    }

    /*
     * Retorna el contenido en formato BLOB (binario) o null en caso de error.
     *
     */

    public function get_content() {
        if ($this->get_error() === 0 && $this->_uploaded) {
            $content = file_get_contents($this->_file_name_upload);
            if ($content === false) {
                return null;
            }
            return $content;
        } else {
            return null;
        }
    }

}