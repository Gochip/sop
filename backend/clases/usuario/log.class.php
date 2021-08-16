<?php

namespace log;

/**
 * @version 1.1
 */
abstract class Log {
    /* Levels de un log */
    const INFO = 'INFO';
    const SUCCESS = 'SUCCESS';
    const WARNING = 'WARNING';
    const ERROR = 'ERROR';
    const APP = 'APP'; // Este nivel implica que el log se va a mostrar en la aplicación.
    
    /**
     * Mensajes
     * @var array Array de mensajes de tipo \Message 
     */
    protected $_messages;
    
    /**
     * Id que representa al usuario que realiza la acción del log.
     * @var int Id de usuario  
     */
    private $_user;
    
    /**
     * Array con levels de mensajes que se van a dejar de almacenar.
     * @var array Levels de mensajes que no se tendrán mas en cuenta 
     */
    private static $_forget_levels = array();
    
    public function __construct($user = ''){
        $this->_messages = array();
        $this->_user = $user;        
    }
    
    /**
     * Agrega un mensaje al array de mensajes.
     * @param string $message Mensaje a añadir
     * @param string $level Level del log [INFO | SUCCESS | WARNING | ERROR]
     * @return bolean False si el level es un level excluido.
     */
    public function add_message($message,$level){
        if(self::is_forget_level($level)){
            return false;
        }
        $msg = new Message($message,$level,time());
        $this->_messages[] = $msg;
        return true;
    }
    /**
     * Permite añadir un mensaje de un \Exception   
     * @param \Exception $exception Excepción para agregar al log
     */
    public function add_exception(\Exception $exception) {
        $text = '';
        $code = $exception->getCode();
        $file = $exception->getFile();
        $line = $exception->getLine();
        $msg = $exception->getMessage();
        $trace = $exception->getTraceAsString();

        $text .= 'Code: ' . $code . PHP_EOL;
        $text .= 'File: ' . $file . PHP_EOL;
        $text .= 'Line: ' . $line . PHP_EOL;
        $text .= 'Msg: ' . $msg . PHP_EOL;
        $text .= 'Trace: ' . $trace;
                
        $this->add_message($text, Log::ERROR);
    }
    
    /**
     * Limpia todos los mensajes que haya en el array.
     */
    public function clean_messages(){
        $this->_messages = array();
    }
    
    /**
     * Guarda los mensajes actuales que se encuentran en el array.
     */
    public abstract function save();
    
    /**
     * Retorna el id del usuario. En caso de no tener un usuario devuelve 
     * 'Anonym'
     * @return string Id del usuario
     */
    public function get_user(){
        return (empty($this->_user))?'Anonym':$this->_user;
    }
    /**
     * Setea el Id del usuario
     * 
     * @param string $user Id del usuario
     */
    public function set_user($user){
        $this->_user = $user;
    }
    
    /**
     * Permite dejar de registrar mensajes de un Level específico.
     * @param string $level Level de mensajes que se van a dejar de registrar    
     */
    public static function not_save_level($level){
        if(self::is_forget_level($level)){
            return;
        }
        self::$_forget_levels[] = $level;
    }
    
    private static function is_forget_level($level){        
        return in_array($level,self::$_forget_levels);
    }
}

/**
 * @version 1.0
 */
class Message{
    /**
     * Texto del mensaje
     * @var string 
     */
    private $_text;
    /**
     * Nivel asociado al mensaje. 
     * @var string [INFO|SUCCESS|WARNING|ERROR] 
     */
    private $_level;
    private $_timestamp;
    
    function __construct($text,$level,$timestamp) {
        $this->_text = $text;
        $this->_level = $level;
        $this->_timestamp = $timestamp;
    }
    
    /**
     * Obtiene el texto del mensaje
     * @return string
     */
    function get_text() {
        return $this->_text;
    }

    /**
     * Obtiene el nivel del mensaje
     * @return string
     */
    function get_level() {
        return $this->_level;
    }
    /**
     * Obtiene el timestamp del mensaje cuando fue creado
     * @return int
     */
    function get_timestamp() {
        return $this->_timestamp;
    }
    /**
     * Setear el texto del mensaje
     * @param string $text Texto del mensaje
     */
    function set_text($text) {
        $this->_text = $text;
    }
    /**
     * Setear el nivel del mensaje
     * @param string $level [INFO|SUCCESS|WARNING|ERROR]
     */
    function set_level($level) {
        $this->_level = $level;
    }
    /**
     * Permite setear el timestamp del mensaje
     * @param int $timestamp Timestamp de la creacion del mensaje
     */
    function set_timestamp($timestamp) {
        $this->_timestamp = $timestamp;
    }


}
