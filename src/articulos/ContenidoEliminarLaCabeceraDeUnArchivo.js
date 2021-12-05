import React, { useEffect } from 'react';

export class ContenidoEliminarLaCabeceraDeUnArchivo extends React.Component {
    render() {
        return (
            <div className="contenido-cuerpo">
                <h4 className="titulo-contenido-cuerpo">Eliminar la cabecera de un archivo</h4>
                <p>
                    Supongamos que tenemos el siguiente archivo llamado "paises":
                </p>
                <pre className="code black-code">
{`País,Población,Superficie
Argentina,44000000,2780000
Brasil,209500000,8516000
Chile,18730000,759950
Uruguay,3449000,176215
Paraguay,6956000,406752
Bolivia,11350000,1099000
Perú,31990000,1285000`}</pre>
            <p>
                Entonces si necesitamos trabajar con los datos pero queremos ignorar a la cabecera se puede utilizar el comando tail para ello. Por ejemplo:
            </p>
            <pre className="code black-code">
{`tail -n +2 paises`}
            </pre>
            <p>
                Tal como la documentación del comando tail explica, al especificar un valor que comience con el signo + en la opción n, le estaremos indicando que debe empezar a listar desde esa línea hasta el final del archivo. En este ejemplo, le estamos indicando que comience a listar desde la línea 2 hasta el final del archivo.
            </p>
            <p>
                Bien, ahora que ya sabemos ignorar a la cabecera podemos realizar un ordenamiento de los datos por población:
            </p>
            <pre className="code black-code">
{`tail -n +2 paises | sort -t ',' -n -k 2 -r`}
            </pre>
            </div>
        );
    }
}
