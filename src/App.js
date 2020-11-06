import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import 'bootstrap/dist/css/bootstrap.min.css';

/*import ReactGA from 'react-ga';

ReactGA.initialize('G-L3XPQBWLHB', {
  debug: true,
  titleCase: false,
  gaOptions: {
    userId: 123
  }
});*/


const PATH_INICIO = "/";
const PATH_CREAR_UN_MENU = "/crear-un-menu";
const PATH_ELIMINAR_LA_CABECERA_DE_UN_ARCHIVO = "/eliminar-la-cabecera-de-un-archivo";
const PATH_ELIMINAR_ESPACIOS_REPETIDOS = "/eliminar-espacios-repetidos";
const PATH_MOSTRAR_COLORES = "/mostrar-colores";
const PATH_REALIZAR_OPERACIONES_ARITMETICAS = '/realizar-operaciones-aritmeticas'
const PATH_RENOMBRAR_UN_CONJUNTO_DE_ARCHIVOS = '/renombrar-un-conjunto-de-archivos'


// Contenidos de cada enlace de información.
class ContenidoInicio extends React.Component {
    render() {
        return (
            <div className="contenido-cuerpo">
            <h4 className="titulo-contenido-cuerpo">¡Hola!</h4>
            <p>
                En este sitio encontrarás tips o <b>hacks</b> para mejorar tu conocimiento en el lenguaje Bash y en el sistema operativo Linux.
            </p>
            <p>
                Espero te resulte útil este contenido. Cualquier comentario me lo podés hacer a mi cuenta de Twitter: <a href="https://twitter.com/GochiParisi" target="_blank">@GochiParisi</a>.
            </p>
            </div>
        );
    }
}

class ContenidoCrearUnMenu extends React.Component {
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

class ContenidoEliminarLaCabeceraDeUnArchivo extends React.Component {
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

class ContenidoEliminarEspaciosRepetidos extends React.Component {
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
            
            </div>
        );
    }
}

class ContenidoMostrarColores extends React.Component {
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
                    Se pueden consultar más colores en <a href="https://gist.github.com/jonsuh/3c89c004888dfc7352be">https://gist.github.com/jonsuh/3c89c004888dfc7352be</a>
                </p>
            </div>
        );
    }
}

class ContenidoRealizarOperacionesAritmeticas extends React.Component {
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

class ContenidoRenombrarUnConjuntoDeArchivos extends React.Component {
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
{`find . -type f -exec mv {} {}.txt \;`}
                </pre>
                <p>
                    El comando find busca archivos desde un directorio que cumpla con la condición que requerimos. Por cada archivo que cumpla esa condición se puede ejecutar otro comando (esto último, lo podemos hacer gracias al parámetro exec). En el ejemplo anterior, el comando find busca desde el directorio actual a todos los archivos regulares y, para cada uno de ellos, ejecuta el comando mv.
                </p>
                <div class="row">
                    <div className="offset-lg-2 col-lg-2 code">
                        find .
                    </div>
                    <div className="col-lg-2 code">
                        -type f
                    </div>
                    <div className="col-lg-2 code">
                        -exec mv {} {}.txt ;
                    </div>
                </div>
                <div class="row">
                    <div className="offset-lg-2 col-lg-2">
                        <p>Directorio desde donde comienza la búsqueda.</p>
                    </div>
                    <div className="col-lg-2">
                        <p>Condición para buscar archivos.</p>
                    </div>
                    <div className="col-lg-2">
                        <p>Comando que se va a ejecutar por cada archivo.</p>
                    </div>
                </div>
            </div>
        );
    }
}
// Fin de contenidos de cada enlace de información.

class Cuerpo extends React.Component {
    render() {
        var path = window.location.pathname;
        
        //ReactGA.pageview(path);
        var componenteAMostrar = <ContenidoInicio />;
        if (path === PATH_INICIO) {
            componenteAMostrar = <ContenidoInicio />;
        } else if (path === PATH_CREAR_UN_MENU) {
            componenteAMostrar = <ContenidoCrearUnMenu />;
        } else if (path === PATH_ELIMINAR_LA_CABECERA_DE_UN_ARCHIVO) {
            componenteAMostrar = <ContenidoEliminarLaCabeceraDeUnArchivo />;
        } else if (path === PATH_ELIMINAR_ESPACIOS_REPETIDOS) {
            componenteAMostrar = <ContenidoEliminarEspaciosRepetidos />;
        } else if (path === PATH_MOSTRAR_COLORES) {
            componenteAMostrar = <ContenidoMostrarColores />;
        } else if (path === PATH_REALIZAR_OPERACIONES_ARITMETICAS) {
            componenteAMostrar = <ContenidoRealizarOperacionesAritmeticas />;
        } else if (path === PATH_RENOMBRAR_UN_CONJUNTO_DE_ARCHIVOS) {
            componenteAMostrar = <ContenidoRenombrarUnConjuntoDeArchivos />;
        }
        
        return  (
            <Col className="cuerpo" xs lg="10">
                { componenteAMostrar }
            </Col>
        );
    }
}

class Menu extends React.Component {
    
    onSelect(path) {
        window.location.href = path;
    }

    render() {
        return (
            <Col className="menu-lateral" xs lg="2">
                <h3 className="titulo-menu">Linux - Bash</h3>
                <Nav defaultActiveKey="/crear-un-menu" className="flex-column mt-3" onSelect={this.onSelect}>
                    <Nav.Link eventKey={ PATH_INICIO }>Inicio</Nav.Link>
                    <Nav.Link eventKey={ PATH_CREAR_UN_MENU }>Crear un menú</Nav.Link>
                    <Nav.Link eventKey={ PATH_ELIMINAR_LA_CABECERA_DE_UN_ARCHIVO }>Eliminar la cabecera de un archivo</Nav.Link>
                    <Nav.Link eventKey={ PATH_ELIMINAR_ESPACIOS_REPETIDOS }>Eliminar espacios</Nav.Link>
                    <Nav.Link eventKey={ PATH_MOSTRAR_COLORES }>Mostrar colores</Nav.Link>
                    <Nav.Link eventKey={ PATH_REALIZAR_OPERACIONES_ARITMETICAS }>Realizar operaciones aritméticas</Nav.Link>
                    <Nav.Link eventKey={ PATH_RENOMBRAR_UN_CONJUNTO_DE_ARCHIVOS }>Renombrar un conjunto de archivos</Nav.Link>
                </Nav>
            </Col>
        );
    }
}

class Contenedor extends React.Component {
    render() {
        return <Container fluid>
            <Row>
                <Menu />
                <Cuerpo />
            </Row>
        </Container>;
    }
}

export default class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <TransitionGroup>
                    <CSSTransition
                      key={window.location.key}
                      timeout={{ enter: 300, exit: 300 }}
                    >
                        <Switch>
                            <Route path={ PATH_INICIO } exact render={() => <Contenedor />} />
                            <Route path={ PATH_CREAR_UN_MENU } exact render={() => <Contenedor />} />
                            <Route path={ PATH_ELIMINAR_LA_CABECERA_DE_UN_ARCHIVO } exact render={() => <Contenedor />} />
                            <Route path={ PATH_ELIMINAR_ESPACIOS_REPETIDOS } exact render={() => <Contenedor />} />
                            <Route path={ PATH_MOSTRAR_COLORES } exact render={() => <Contenedor />} />
                            <Route path={ PATH_REALIZAR_OPERACIONES_ARITMETICAS } exact render={() => <Contenedor />} />
                            <Route path={ PATH_RENOMBRAR_UN_CONJUNTO_DE_ARCHIVOS } exact render={() => <Contenedor />} />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </BrowserRouter>
        );
    }
}

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. ok.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
