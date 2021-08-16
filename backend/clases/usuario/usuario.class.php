<?php

/**
 * Implementación de SessionUser 
 */
class Usuario extends SessionUser {

    private $_id;
    private $_user_name;
    private $_first_name;
    private $_last_name;
    private $_id_system;
    private $_is_admin;
    private $_email;
    private $_email_verificado;
    private $_systems;

    public function __construct($id, $user_name, $first_name = '', $last_name = '') {
        $this->_id = $id;
        $this->_user_name = $user_name;
        $this->_first_name = $first_name;
        $this->_last_name = $last_name;
        $this->_is_admin = false;
        $this->_email = null;
        $this->_email_verificado = false;
        $this->_systems = [];
    }

    /**
     * La estrategia can_access queda obsoleta en este proyecto.
     * Se debe usar el método has_permission
     * @param type $url
     * @param type $method
     */
    public function can_access($url, $method) {
        
    }

    public function has_permission($resource, $action) {
        $permission = new permissions\Permissions($this->_id, $this->_id_system);
        return $permission->has_permission($resource, $action);
    }

    public function get_id() {
        return $this->_id;
    }

    public function get_first_name() {
        return $this->_first_name;
    }

    public function get_last_name() {
        return $this->_last_name;
    }

    public function get_user_name() {
        return $this->_user_name;
    }

    public function get_name() {
        return $this->_last_name . " " . $this->_first_name;
    }

    public function set_id($id) {
        $this->_id = $id;
    }

    public function set_first_name($first_name) {
        $this->_first_name = $first_name;
    }

    public function set_last_name($last_name) {
        $this->_last_name = $last_name;
    }

    public function set_user_name($user_name) {
        $this->_user_name = $user_name;
    }

    public function set_is_admin($is_admin) {
        $this->_is_admin = $is_admin;
    }

    public function is_admin() {
        return $this->_is_admin;
    }

    function get_email() {
        return $this->_email;
    }

    function set_email($_email) {
        $this->_email = $_email;
    }

    function get_email_verificado() {
        return $this->_email_verificado;
    }

    function set_email_verificado($_email_verificado) {
        $this->_email_verificado = $_email_verificado;
    }

    /**
     * 
     * Debería llamarse get_system_id
     */
    public function get_id_system() {
        return $this->_id_system;
    }

    public function set_id_system($id_system) {
        $this->_id_system = $id_system;
    }

    public function update_user() {
        /* volver a cargar los datos desde la bd */
    }

    public function set_systems($systems) {
        $this->_systems = $systems;
    }

    public function get_count_systems() {
        return count($this->_systems);
    }

}
