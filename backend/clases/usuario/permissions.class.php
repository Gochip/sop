<?php

namespace permissions;

class Permissions {

    private $_id_user = -1;
    private $_id_system = '';

    /* RECURSOS */
    const DB_RESOURCE = 'DB';
    const USUARIOS_RESOURCE = 'USUARIOS';
    const PERMISOS_RESOURCE = 'PERMISOS';
    const OTROS_RESOURCE = 'OTROS';
    const ESTADISTICAS_RESOURCE = 'ESTADISTICAS';
    const EXCEL_RESOURCE = 'EXCEL';
    const INDICADORES_RESOURCE = 'INDICADORES';
    const USUARIOS_INACTIVOS_RESOURCE = 'USUARIOS_INACTIVOS';
    const CALENDARIO = 'CALENDARIO';
    const NOTIFICACIONES = 'NOTIFICACIONES';
    const CUENTA = 'CUENTA';
    const INICIO = 'INICIO';
    /* ACCIONES */
    const CREAR_ACTION = 'CREAR';
    const CONSULTAR_ACTION = 'CONSULTAR';
    const MODIFICAR_ACTION = 'MODIFICAR';
    const INICIAR_SESION_ACTION = 'INICIAR_SESION';
    const IMPORTAR_ACTION = 'IMPORTAR';
    const EXPORTAR_ACTION = 'EXPORTAR';
    
    /* TIPOS RECURSOS */
    const DB_TYPE = "BD"; //BASE DE DATOS
    const ACM_TYPE = "ACM"; // ALTA CONSULTA MODIFICACION
    const SISTEMA_TYPE = "SISTEMA";
    const IE_TYPE = 'IE'; //IMPORTAR EXPORTAR
    
    public function __construct($id_user, $id_sytem) {
        $this->_id_user = $id_user;
        $this->_id_system = $id_sytem;
    }

    public function has_permission($resource, $action, $id_user = NULL, $id_system = NULL) {
        $ok = FALSE;
        $db = \PoolConnectionDb::get_instance()->get_connection_db();
        $select_sql = <<<SQL
                SELECT * FROM permissions AS p INNER JOIN resources AS r
                ON (p.id_resource=r.id) INNER JOIN actions AS a 
                ON (p.id_action=a.id) WHERE r.name={name_resource} AND 
                a.name={name_action} AND p.enabled=1 AND p.id_user={id_user}
                AND p.id_system={id_system}
SQL;
        $params = ["name_resource" => [$resource, 's'], "name_action" => [$action, 's']];
        $params["id_user"] = [(isset($id_user) && !is_null($id_user)) ? $id_user : $this->_id_user, 'd'];
        $params["id_system"] = [(isset($id_system) && !is_null($id_user)) ? $id_system : $this->_id_system, 's'];

        $result = $db->query($select_sql, $params);
        if (count($result) > 0) {
            $ok = TRUE;
        }
        return $ok;
    }

    public function set_permission($resource, $action, $enabled, $id_user = NULL, $id_system = NULL) {
        $ok = FALSE;
        if (!isset($resource) || !isset($action) || !isset($enabled)) {
            return false;
        }
        /* ¿Ya tiene el permiso (deshabilitado/habilitado)? */
        $db = \PoolConnectionDb::get_instance()->get_connection_db();
        $select_sql = <<<SQL
                SELECT * FROM permissions AS p INNER JOIN resources AS r
                ON (p.id_resource=r.id) INNER JOIN actions AS a 
                ON (p.id_action=a.id) WHERE r.name={name_resource} AND 
                a.name={name_action} AND p.id_user={id_user}
                AND p.id_system={id_system}
SQL;
        $params = ["name_resource" => [$resource, 's'], "name_action" => [$action, 's']];
        $params["id_user"] = [(isset($id_user)) ? $id_user : $this->_id_user, 'd'];
        $params["id_system"] = [(isset($id_system)) ? $id_system : $this->_id_system, 's'];
        $params["enabled"] = [(($enabled == true) ? 1 : 0), 'd'];

        $result = $db->query($select_sql, $params);
        if (count($result) > 0) {
            /* Ya existe el permiso. Actualizo enabled */            
            $update_sql = <<<SQL
                    UPDATE permissions SET enabled={enabled}
                    WHERE id_user={id_user} AND id_system={id_system}
                    AND id_resource=(SELECT id FROM resources WHERE name={name_resource}) 
                    AND id_action=(SELECT id FROM actions WHERE name={name_action})
SQL;
            $numrows = $db->update($update_sql, $params);            
            $ok = ($numrows > 0);
        } else {
            /* No existe el permiso. Lo inserto */
            $db->begin_transaction();
            try {
                $insert_sql = "INSERT INTO permissions (id_user,id_resource,id_action,id_system,enabled) ";
                $insert_sql .= "VALUES ({id_user},(SELECT id FROM resources WHERE name={name_resource}),";
                $insert_sql .= "(SELECT id FROM actions WHERE name={name_action}),{id_system},{enabled})";

                $id_generado = $db->insert($insert_sql, $params);
                $ok = ($id_generado > 0);
                $db->commit();
            } catch (Exception $ex) {
                $db->rollback();
                $ok = FALSE;
            }
        }
        return $ok;
    }
    /**
     * Devuelve las acciones que aplican a un cierto tipo de recurso.
     * @param string $type_resource Tipo de Recurso [Permissions::DB_TYPE | Permissions::ACM_TYPE | Permissions::SISTEMA_TYPE ]
     * @return array Cada fila de la forma ["id"=>__,"name"=>__,"description"=>__]
     */
    public function get_actions_by_type_resource($type_resource){
        $result = array();
        if(!isset($type_resource) || $type_resource == ''){
            return $result;
        }
        $db = \PoolConnectionDb::get_instance()->get_connection_db();
        $consulta = <<<SQL
                SELECT a.id AS id,a.name AS name,a.description AS description
                FROM actions AS a INNER JOIN actions_x_types_resources AS axtr
                ON (a.id=axtr.id_action) INNER JOIN types_resources AS tr 
                ON (axtr.id_type=tr.id) WHERE tr.name={type_resource}
                ORDER BY a.description
SQL;
        $actions = $db->query($consulta, ["type_resource"=>[$type_resource,'s']]);
        if(count($actions) > 0){
            $result = $actions;
        }
        return $result;
    }
    /**
     * Retorna los permisos que cumplen con los siguientes filtros.
     * OJO!! NO RETORNA LOS PERMISOS PERTENECIENTES AL USUARIO ACTUAL, EXCEPTO
     * QUE SE ESPECIFIQUE COMO PARÁMETRO EL ID DEL USUARIO!!!
     * @param string $id_system Id del sistema.
     * @param string $type_resource Tipo de Recurso [Permissions::DB_TYPE | Permissions::ACM_TYPE | Permissions::SISTEMA_TYPE ]
     * @param string $resource Recurso [Permissions::DB_RESOURCE | Permissions::USUARIO_RESOURCE | Permissions::PERMISOS_RESOURCE]
     * @param string $action Accion [Permissions::ALTA_ACTION | Permissions::CONSULTAR_ACTION | Permissions::MODIFICAR_ACTION | Permissions::INICIAR_SESION_ACTION]
     * @param int $id_user Id de usuario perteneciente al permiso.
     * @return \permissions\Permission|array Array con objetos Permission 
     */
    public function get_permissions($id_system,$type_resource = NULL, $resource = NULL,$action = NULL,$id_user = NULL){
        $result = array();
        if(!isset($id_system) || $id_system == ''){
            return $result;
        }
        $db = \PoolConnectionDb::get_instance()->get_connection_db();
        $consulta = <<<SQL
                SELECT a.id AS id_action,a.name AS name_action,a.description AS description_action,
                r.id AS id_resource, r.name AS name_resource, r.description AS description_resource,
                p.id_system AS id_system, p.enabled AS enabled, p.id_user AS id_user,
                tr.id AS id_type, tr.name AS name_type 
                FROM actions AS a INNER JOIN permissions AS p
                ON (a.id=p.id_action) INNER JOIN resources AS r 
                ON (r.id=p.id_resource) INNER JOIN types_resources AS tr
                ON (r.id_type=tr.id) INNER JOIN actions_x_types_resources as axtr 
                ON (axtr.id_type=tr.id and axtr.id_action=a.id)
                WHERE p.id_system={id_system} 
SQL;
        $parametros = array();
        $parametros["id_system"] = [$id_system,'s'];
    
        if(isset($type_resource)){
            $consulta .= " AND tr.name={type_resource}";
            $parametros["type_resource"] = [$type_resource,'s'];
        }
        if(isset($resource)){
            $consulta .= " AND r.name={resource} ";
            $parametros["resource"] = [$resource,'s'];
        }
        if(isset($action)){
            $consulta .= " AND a.name={action} ";
            $parametros["action"] = [$action,'s'];
        }
        if(isset($id_user)){
            $consulta .= " AND p.id_user={id_user}";
            $parametros["id_user"] = [$id_user,'d'];
        }else{
            $consulta .= " AND p.id_user != {id_user}";
            $parametros["id_user"] = [$this->_id_user,'d'];
        }
        
        $permisos = $db->query($consulta, $parametros);
        
        foreach($permisos as $p){            
            $permiso = new Permission();
            $permiso->set_enabled($p['enabled']);
            $permiso->set_id_action($p['id_action']);
            $permiso->set_name_action($p['name_action']);
            $permiso->set_description_action($p['description_action']);
            $permiso->set_id_resource($p['id_resource']);
            $permiso->set_name_resource($p['name_resource']);
            $permiso->set_description_resource($p['description_resource']);
            $permiso->set_id_system($p['id_system']);
            $permiso->set_id_user($p['id_user']);
            $permiso->set_id_type_resource($p['id_type']);
            $permiso->set_name_type_resource($p['name_type']);
            $result[] = $permiso;
        }
        return $result;
    }
    /**
     * Retorna todas las bases de datos pertenecientes al Sistema dado.
     * @param string $id_system Id del sistema
     * @return array Cada fila tiene la siguiente estructura ["id"=> __ , "name"=> __]
     */
    public function get_bds_system($id_system=NULL){
        $consulta =<<<SQL
                SELECT db.id AS id, db.name AS name 
                FROM data_bases AS db INNER JOIN data_bases_x_systems AS dbxs 
                ON (db.id=dbxs.id_data_base) WHERE dbxs.id_system={id_system}
                ORDER BY db.name
SQL;
        if(!is_null($id_system)){
            $parametros = ["id_system"=>[$id_system,'s']];
        }else{
            $parametros = ["id_system"=>[$this->_id_system,'s']];
        }
        $db = \PoolConnectionDb::get_instance()->get_connection_db();
        $bds = $db->query($consulta, $parametros);        
        return $bds;
    }
    
    /**
     * Retorna todos los permisos que no son del TIPO BD, corresponden al 
     * sistema dado y que no pertenecen al usuario actual.
     * @param string $id_system Id de sistema si es necesario obtener permisos de otro sistema
     * @return \permissions\Permission Array con permisos 
     */
    public function get_permissions_not_bds($id_system=NULL){
        $result = array();
        
        $consulta= <<<SQL
        SELECT a.id AS id_action,a.name AS name_action,a.description AS description_action,
                r.id AS id_resource, r.name AS name_resource, r.description AS description_resource,
                p.id_system AS id_system, p.enabled AS enabled, p.id_user AS id_user,
                tr.id AS id_type, tr.name AS name_type 
                FROM actions AS a INNER JOIN permissions AS p
                ON (a.id=p.id_action) INNER JOIN resources AS r 
                ON (r.id=p.id_resource) INNER JOIN types_resources AS tr
                ON (r.id_type=tr.id) INNER JOIN actions_x_types_resources as axtr 
                ON (axtr.id_type=tr.id and axtr.id_action=a.id)
                WHERE p.id_system={id_system} AND tr.name != 'BD' 
                AND p.id_user != {id_user}
SQL;
        $parametros = array();
        if(!is_null($id_system)){
            $parametros = ["id_system"=>[$id_system,'s']];
        }else{
            $parametros = ["id_system"=>[$this->_id_system,'s']];
        }
        $parametros["id_user"]= [$this->_id_user,'d'];
        $db = \PoolConnectionDb::get_instance()->get_connection_db();
        $permisos = $db->query($consulta, $parametros);
        
        foreach($permisos as $p){            
            $permiso = new Permission();
            $permiso->set_enabled($p['enabled']);
            $permiso->set_id_action($p['id_action']);
            $permiso->set_name_action($p['name_action']);
            $permiso->set_description_action($p['description_action']);
            $permiso->set_id_resource($p['id_resource']);
            $permiso->set_name_resource($p['name_resource']);
            $permiso->set_description_resource($p['description_resource']);
            $permiso->set_id_system($p['id_system']);
            $permiso->set_id_user($p['id_user']);
            $permiso->set_id_type_resource($p['id_type']);
            $permiso->set_name_type_resource($p['name_type']);
            $result[] = $permiso;
        }
        return $result;
    }
    
    /**
     * Obtiene los recursos. OJO! Si se incluyen los recursos del tipo
     * de BD, va a retornar todos independientemente del sistema 
     * @param boolean $exclude_type_db True si queremos excluir recursos del tipo BD
     * @return array Array de los recursos con las claves: [id_resource,name_resource,description_resource,id_type,name_type]
     */
    public function get_resources($exclude_type_db = true){        
        $consulta = <<<SQL
    SELECT r.id AS id_resource,r.name AS name_resource,r.description AS description_resource,
        t.id AS id_type,t.name AS name_type FROM resources AS r INNER JOIN types_resources
        AS t ON r.id_type=t.id WHERE 1=1 
SQL;
        if($exclude_type_db){
            $consulta .= " AND t.name != {tipo_bd}";
        }
        $consulta .= " ORDER BY r.description";
        $parametros = ["tipo_bd"=>[self::DB_TYPE,'s']];
        $bd = \PoolConnectionDb::get_instance()->get_connection_db();
        $result = $bd->query($consulta, $parametros);
        return $result;
    }
    
    /**
     * 
     * @param type $exclude_type_db
     * @return array Array con los tipos de recursos. Claves: [id,name]
     */
    public function get_types_resources($exclude_type_db = true){
        $consulta = "SELECT id,name FROM types_resources ";
        if($exclude_type_db){
            $consulta .= " WHERE name != {tipo_bd}";
        }
        $parametros = ["tipo_bd"=>[self::DB_TYPE,'s']];
        $db = \PoolConnectionDb::get_instance()->get_connection_db();
        $result = $db->query($consulta, $parametros);
        return $result;
    }
}
