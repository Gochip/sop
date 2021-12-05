import React, { useEffect } from 'react';

export class ContenidoCrearUnMenu extends React.Component {
    render() {
        return (
            <div className="contenido-cuerpo">
                <h4 className="titulo-contenido-cuerpo">Crear un menú</h4>
                <p>
                    Un menú implica mostrarle al usuario las opciones que tiene a disposición para ejecutar, solicitar que ingrese una de esas opciones y volver a repetir este proceso.
                </p>
                <p>
                    Por ejemplo, un menú funcionando se puede ver algo así:
                </p>
                <pre className="code black-code">
{`Menú de opciones:
A) Ejecutar funcionalidad A.
B) Ejecutar funcionalidad B.
C) Salir.
Ingrese una opción:   `}</pre>
                <p>A continuación se presenta la estructura para crear un menú como el presentado anteriormente.</p>
                <pre className="code black-code">
{`#!/bin/bash
while true
do
	echo "Menú de opciones:"
	echo "A) Ejecutar funcionalidad A."
	echo "B) Ejecutar funcionalidad B."
	echo "C) Salir."

	echo -n "Ingrese una opción: "
	read opcion
	case $opcion in
		a|A)
			# Acá se escribe el contenido de la funcionalidad A.
			echo "Ejecutando la funcionalidad A..."
			;;
		b|B)
			# Acá se escribe el contenido de la funcionalidad B.
			echo "Ejecutando la funcionalidad B..."
			;;
		c|C)
			break;;
	esac

done`}</pre>
        <p>
            Lo primero que hay que notar es el ciclo while, el cual permite que una vez terminada una ejecución se vuelva a mostrar el menú para poder volver a comenzar. Adentro del bloque while:
        </p>
        <ol>
            <li>Se muestra el menú a través del comando echo.</li>
            <li>Se solicita al usuario que ingrese la opción con el comando read.</li>
            <li>Se utiliza la sentencia case para determinar qué bloque ejecutar.</li>
            <li>Se ejecuta el bloque de la funcionalidad seleccionada (revisar el break en la opción salir).</li>
        </ol>
        </div>
        )
    }
}
