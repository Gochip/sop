import React, { useEffect } from 'react';

export class ContenidoEliminarEspaciosRepetidos extends React.Component {
    render() {
        return (
            <div className="contenido-cuerpo">
                <h4 className="titulo-contenido-cuerpo">Eliminar espacios repetidos</h4>
                <p>
                    A veces ciertos archivos o salidas de comandos presentan los datos separados por varios espacios para que sean más legibles por un humano aunque esto genera que sea un problema para procesarlos. Por ejemplo, si ejecutamos ls -l /, podríamos obtener algo así:
                </p>
                <pre className="code black-code">
{`drwxr-xr-x   2 root root  4096 oct  2  2019 bin
drwxr-xr-x   3 root root 12288 oct  4  2019 boot
drwxrwxr-x   2 root root  4096 may 29  2016 cdrom
drwxr-xr-x  22 root root  4360 oct 28 23:03 dev
drwxr-xr-x 173 root root 12288 oct 28 23:03 etc
drwxr-xr-x   6 root root  4096 oct 18  2019 home
drwxr-xr-x  25 root root  4096 mar 30  2019 lib
drwxr-xr-x   2 root root  4096 mar 30  2019 lib32
drwxr-xr-x   2 root root  4096 mar 30  2019 lib64
drwx------   2 root root 16384 may 29  2016 lost+found
drwxr-xr-x   3 root root  4096 may 29  2016 media
drwxr-xr-x   2 root root  4096 abr 20  2016 mnt
drwxr-xr-x  12 root root  4096 jul 14 10:55 opt
dr-xr-xr-x 348 root root     0 oct 28 23:03 proc
drwx------  24 root root  4096 jun 23 11:01 root
drwxr-xr-x  44 root root  1400 oct 29 00:07 run
drwxr-xr-x   2 root root 12288 oct  2  2019 sbin
drwxr-xr-x   7 root root  4096 oct 29 00:39 snap
drwxr-xr-x   2 root root  4096 abr 20  2016 srv
dr-xr-xr-x  13 root root     0 oct 29 02:00 sys
drwxrwxrwt  23 root root 45056 oct 29 02:09 tmp
drwxr-xr-x  14 root root  4096 abr 28  2019 usr
drwxr-xr-x  15 root root  4096 may 30  2016 var`}
                </pre>
                <p>
                    Entonces si quisiéramos utilizar el comando cut para obtener la tercera columna, podríamos pensar que haciendo algo así funcionaría:
                </p>
                <pre className="code black-code">
{`ls -l / | cut -d ' ' -f 3`}
                </pre>
                <p>
                    Pero si lo ejecutamos nos daremos cuenta que evidentemente algo malo está pasando. Por eso, es que antes de ejecutar cut debemos convertir esos espacios repetidos en uno solo. Eso se puede hacer fácilmente con el comando tr:
                </p>
                <pre className="code black-code">
{`ls -l / | tr -s " "`}
                </pre>
                <p>
                    Si bien ahora la salida no es tan legible para un humano pero sí es más fácil de procesar con cut.
                </p>
                <pre className="code black-code">
{`drwxr-xr-x 2 root root 4096 oct 2 2019 bin
drwxr-xr-x 3 root root 12288 oct 4 2019 boot
drwxrwxr-x 2 root root 4096 may 29 2016 cdrom
drwxr-xr-x 22 root root 4360 oct 28 23:03 dev
drwxr-xr-x 173 root root 12288 oct 28 23:03 etc
drwxr-xr-x 6 root root 4096 oct 18 2019 home
drwxr-xr-x 25 root root 4096 mar 30 2019 lib
drwxr-xr-x 2 root root 4096 mar 30 2019 lib32
drwxr-xr-x 2 root root 4096 mar 30 2019 lib64
drwx------ 2 root root 16384 may 29 2016 lost+found
drwxr-xr-x 3 root root 4096 may 29 2016 media
drwxr-xr-x 2 root root 4096 abr 20 2016 mnt
drwxr-xr-x 12 root root 4096 jul 14 10:55 opt
dr-xr-xr-x 349 root root 0 oct 28 23:03 proc
drwx------ 24 root root 4096 jun 23 11:01 root
drwxr-xr-x 44 root root 1400 oct 29 00:07 run
drwxr-xr-x 2 root root 12288 oct 2 2019 sbin
drwxr-xr-x 7 root root 4096 oct 29 00:39 snap
drwxr-xr-x 2 root root 4096 abr 20 2016 srv
dr-xr-xr-x 13 root root 0 oct 29 02:00 sys
drwxrwxrwt 23 root root 45056 oct 29 01:55 tmp
drwxr-xr-x 14 root root 4096 abr 28 2019 usr
drwxr-xr-x 15 root root 4096 may 30 2016 var`}</pre>
            <p>
                Ahora sí podemos obtener la tercera columna con cut:
            </p>
            <pre className="code black-code">
{`ls -l / | tr -s " " | cut -d ' ' -f 3`}
            </pre>

            <p>
                <b>Tip para usuarios de MacOS: </b>
                <span>Tené cuidado con presionar la tecla <i>espacio</i> junto con la tecla <i>Alt</i> ya que generará un <a href="https://en.wikipedia.org/wiki/Non-breaking_space)" target="_blank" rel="noopener noreferrer">non-breaking space</a> y el comando anterior va a fallarte, probablemente con un "command not found".</span>
            </p>

            </div>
        );
    }
}
