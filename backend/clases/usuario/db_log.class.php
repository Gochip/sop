<?php
namespace log;

/**
 * @version 1.0
 */
abstract class DbLog extends Log{
    /* 
    * Tener en cuenta que si se quieren registrar en dos bd distintas 
    * hay que modificar estos atributos, los debería tener la clase hija. 
    */
    protected static $_HOST = 'localhost';
    protected static $_USER = 'root';
    protected static $_PASS = '';
    protected static $_DATABASE = 'logs';
    
    /**
     * Guarda los mensajes de logs en la BD específica.
     * @return boolean True en caso de que se guarden en BD, False caso contrario
     */
    public function save() {                
        $ok = $this->insert_messages($this->_messages);        
        if($ok){
            parent::clean_messages();            
        }
        return $ok;
    }
    
    /**
     * Permite setear los parámetros para la conexión a la BD
     * @param string $host Host
     * @param string $user Usuario
     * @param string $pass Clave
     * @param string $database Base de datos
     */
    public static function set_default_conexion($host,$user,$pass,$database){
        self::$_HOST = $host;
        self::$_USER = $user;
        self::$_PASS = $pass;
        self::$_DATABASE = $database;
    }
    /**
     * Método abstracto el cual se debe implementar para insertar mensajes
     * en la BD. 
     */
    protected abstract function insert_messages($messages);
    
    /**
     * Método abstracto el cuál debe retornar la fecha dado un timestamp de un
     * mensaje para insertar en la BD
     */
    protected abstract function get_date_time($timestamp); 
}