<?php
namespace permissions;

class Permission implements \JsonSerializable{
    private $_id_system;
    private $_enabled;
    
    private $_id_user;
    
    private $_id_resource;
    private $_name_resource;
    private $_description_resource;
    
    private $_id_action;
    private $_name_action;
    private $_description_action;
    
    private $_id_type_resource;
    private $_name_type_resource;
    
    function get_id_user() {
        return $this->_id_user;
    }

    function get_id_resource() {
        return $this->_id_resource;
    }

    function get_name_resource() {
        return $this->_name_resource;
    }

    function get_id_action() {
        return $this->_id_action;
    }

    function get_name_action() {
        return $this->_name_action;
    }

    function get_id_system() {
        return $this->_id_system;
    }

    function get_enabled() {
        return $this->_enabled;
    }

    function set_id_user($_id_user) {
        $this->_id_user = $_id_user;
    }

    function set_id_resource($_id_resource) {
        $this->_id_resource = $_id_resource;
    }

    function set_name_resource($_name_resource) {
        $this->_name_resource = $_name_resource;
    }

    function set_id_action($_id_action) {
        $this->_id_action = $_id_action;
    }

    function set_name_action($_name_action) {
        $this->_name_action = $_name_action;
    }

    function set_id_system($_id_system) {
        $this->_id_system = $_id_system;
    }

    function set_enabled($_enabled) {
        $this->_enabled = $_enabled;
    }
    function get_description_resource() {
        return $this->_description_resource;
    }

    function get_description_action() {
        return $this->_description_action;
    }

    function set_description_resource($_description_resource) {
        $this->_description_resource = $_description_resource;
    }

    function set_description_action($_description_action) {
        $this->_description_action = $_description_action;
    }
    
    function get_id_type_resource() {
        return $this->_id_type_resource;
    }

    function get_name_type_resource() {
        return $this->_name_type_resource;
    }

    function set_id_type_resource($_id_type_resource) {
        $this->_id_type_resource = $_id_type_resource;
    }

    function set_name_type_resource($_name_type_resource) {
        $this->_name_type_resource = $_name_type_resource;
    }

    public function jsonSerialize() {
      return [
          "enabled"=> $this->_enabled,
          "id_user"=> $this->_id_user,
          "id_resource"=>  $this->_id_resource,
          "name_resource" => $this->_name_resource,
          "id_action"=> $this->_id_action,
          "name_action" => $this->_name_action
          ];  
    }

}
