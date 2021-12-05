import React, { useEffect } from 'react';

export class ContenidoRealizarOperacionesAritmeticas extends React.Component {
    render() {
        return (
            <div className="contenido-cuerpo">
                <h4 className="titulo-contenido-cuerpo">Realizar operaciones aritméticas</h4>
                <p>En bash, existen al menos las siguientes 3 alternativas para realizar operaciones aritméticas:</p>
                <ol>
                    <li>Usar la palabra reservada let.</li>
                    <li>Usar el comando expr.</li>
                    <li>Usar la construcción $(( x op y )).</li>
                </ol>

                <h5>Usando la palabra reservada <b>let</b></h5>
                <p>
                    Por ejemplo, para sumar, restar, dividir y multiplicar:
                </p>
                <pre className="code black-code">
{`# Para sumar:
let r=2+4
echo $r

# Para restar:
let r=8-5
echo $r

# Para multiplicar:
let r=2\*4
echo $r

# Para división entera:
let r=9/4
echo $r

# Para obtener el resto de la división:
let r=9%4
echo $r`}
                </pre>
                <p>
                    Notar que la división es una división entera. Es decir, no arroja resultados decimales.
                </p>

                <h5>Usando el comando <b>expr</b></h5>
                <p>
                    Por ejemplo, para sumar, restar, dividir y multiplicar:
                </p>
                <pre className="code black-code">
{`# Para sumar:
r=\`expr 2 + 4\`
echo $r

# Para restar:
r=\`expr 8 - 5\`
echo $r

# Para multiplicar:
r=\`expr 2 \\* 4\`
echo $r

# Para división entera:
r=\`expr 9 / 4\`
echo $r

# Para obtener el resto de la división:
r=\`expr 9 % 4\`
echo $r`}
                </pre>
                <p>
                    Notar que hay un espacio entre los operadores y operandos, esto es porque cada uno de ellos es un parámetro para el comando expr.
                </p>

                <h5>Usando la construcción <b>$(( x op y ))</b></h5>
                <p>
                    Por ejemplo, para sumar, restar, dividir y multiplicar:
                </p>
                <pre className="code black-code">
{`# Para sumar:
r=$((2+4))
echo $r

# Para restar:
r=$((8-5))
echo $r

# Para multiplicar:
r=$((8*5))
echo $r

# Para división entera:
r=$((9/4))
echo $r

# Para obtener el resto de la división:
r=$((9%4))
echo $r`}
                </pre>
                <p>
                    Notar que no hace falta el espacio entre los operadores y los operandos.
                </p>
            </div>
        );
    }
}
