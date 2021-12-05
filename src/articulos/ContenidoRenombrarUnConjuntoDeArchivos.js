import React, { useEffect } from 'react';

export class ContenidoRenombrarUnConjuntoDeArchivos extends React.Component {
    render() {
        return (
            <div className="contenido-cuerpo">
                <h4 className="titulo-contenido-cuerpo">Renombrar un conjunto de archivos</h4>
                <p>En determinadas ocasiones me fue útil saber esto. Supongamos que tenemos una serie de archivos como la siguiente:</p>
                <pre className="code black-code">
{`archivo1  archivo2  archivo3  archivo4  archivo5`}
                </pre>
                <p>Notar que todos esos archivos no tienen extensión. Si quisiéramos agregarle la extensión .txt sin hacerlo de a uno por vez, podríamos hacerlo con el comando find y el parámetro exec. Veamos el comando y luego vamos a explicarlo:</p>
                <pre className="code black-code">
{`find . -type f -exec mv {} {}.txt \\;`}
                </pre>
                <p>
                    El comando find busca archivos desde un directorio que cumpla con la condición que requerimos. Por cada archivo que cumpla esa condición se puede ejecutar otro comando (esto último, lo podemos hacer gracias al parámetro exec). En el ejemplo anterior, el comando find busca desde el directorio actual a todos los archivos regulares y, para cada uno de ellos, ejecuta el comando mv.
                </p>
                <div class="row">
                    <div className="offset-lg-1 col-lg-3 code" style={{'text-align': 'center'}}>
                        find .
                    </div>
                    <div className="col-lg-3 code" style={{'text-align': 'center'}}>
                        -type f
                    </div>
                    <div className="col-lg-3 code" style={{'text-align': 'center'}}>
                        -exec mv {} {}.txt \;
                    </div>
                </div>
                <div class="row">
                    <div className="offset-lg-1 col-lg-3">
                        <p style={{'text-align': 'left'}}>Directorio desde donde comienza la búsqueda.</p>
                    </div>
                    <div className="col-lg-3">
                        <p style={{'text-align': 'left'}}>Condición para buscar archivos.</p>
                    </div>
                    <div className="col-lg-3">
                        <p style={{'text-align': 'left'}}>Comando que se va a ejecutar por cada archivo.</p>
                    </div>
                </div>
            </div>
        );
    }
}
