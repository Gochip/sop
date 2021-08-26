CREATE DATABASE juezbash;

CREATE TABLE usuarios(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(80) NOT NULL,
    password BLOB NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE ejercicios(
	id INT NOT NULL AUTO_INCREMENT,
	titulo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    nivel INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE estados_envio(
	id INT NOT NULL AUTO_INCREMENT,
    clave VARCHAR(30) NOT NULL,
    nombre VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE envios(
	id INT NOT NULL AUTO_INCREMENT,
    id_ejercicio INT NOT NULL,
    id_usuario INT NOT NULL,
    id_estado INT NOT NULL,
    fecha_hora_envio DATETIME,
    fecha_hora_dictamen DATETIME,
    contenido TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_ejercicio) REFERENCES ejercicios(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_estado) REFERENCES estados_envio(id)
);

INSERT INTO estados_envio (clave, nombre) VALUES ('pendiente_evaluacion', 'Pendiente de evaluación');
INSERT INTO estados_envio (clave, nombre) VALUES ('aceptado', 'Aceptado');
INSERT INTO estados_envio (clave, nombre) VALUES ('error', 'Error');
