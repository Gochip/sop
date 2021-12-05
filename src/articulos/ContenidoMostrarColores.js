import React, { useEffect } from 'react';

export class ContenidoMostrarColores extends React.Component {
    render() {
        return (
            <div className="contenido-cuerpo">
                <h4 className="titulo-contenido-cuerpo">Mostrar colores</h4>
                <p>
                    Se pueden mostrar colores en la terminal usando ciertas combinaciones de caracteres. A continuación se presenta un ejemplo mostrando un texto en colores rojo, verde y blanco.
                </p>
                <pre className="code black-code">
{`#!/bin/bash

ROJO='\\033[0;31m'
VERDE='\\033[0;32m'
SIN_COLOR='\\033[0m'
echo -e "\${ROJO}Esto va a ser en color rojo."
echo -e "\${VERDE}Esto va a ser en color verde."
echo "Esto sigue en color verde."
echo -e "\${SIN_COLOR}Le quitamos el color, será el color por default."`}
                </pre>
                <p>
                    La salida de la ejecución del anterior script es:
                </p>
                <div className="code black-code" style={{marginBottom: 16 + 'px'}}>
                    <font color="#CD0000">Esto va a ser en color rojo.</font><br/>
                    <font color="#00CD00">Esto va a ser en color verde.</font><br/>
                    <font color="#00CD00">Esto sigue en color verde.</font><br/>
                    Le quitamos el color, será el color por default.
                </div>
                <p>
                    Se pueden consultar más colores en <a href="https://gist.github.com/jonsuh/3c89c004888dfc7352be" target="_blank" rel="noopener noreferer">https://gist.github.com/jonsuh/3c89c004888dfc7352be</a>
                </p>
            </div>
        );
    }
}
