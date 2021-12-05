import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { PanelLogin } from './Login'
import { PanelRegistro } from './Registro'
import { Ejercicios } from './Ejercicios'
import { TableroPuntuacion } from './TableroPuntuacion'
import { MenuNavegacion } from './MenuNavegacion'
import { ContenidoRealizarOperacionesAritmeticas } from './articulos/ContenidoRealizarOperacionesAritmeticas'
import { ContenidoEliminarEspaciosRepetidos } from './articulos/ContenidoEliminarEspaciosRepetidos'
import { ContenidoEliminarLaCabeceraDeUnArchivo } from './articulos/ContenidoEliminarLaCabeceraDeUnArchivo'
import { ContenidoMostrarColores } from './articulos/ContenidoMostrarColores'
import { ContenidoParticionesYSistemasDeArchivos } from './articulos/ContenidoParticionesYSistemasDeArchivos'
import { ContenidoRenombrarUnConjuntoDeArchivos } from './articulos/ContenidoRenombrarUnConjuntoDeArchivos'
import { ContenidoCrearUnMenu } from './articulos/ContenidoCrearUnMenu'
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
const PATH_PARTICIONES_Y_SISTEMAS_DE_ARCHIVOS = '/particiones-y-sistemas-de-archivos'
const PATH_LOGIN = "/login"
const PATH_DESAFIOS = "/desafios"
const PATH_PUNTUACION = "/puntuaciones"
const PATH_REGISTRO = "/registro"


// Contenidos de cada enlace de información.
class ContenidoInicio extends React.Component {
    irAPracticar() {
        window.location.href = "/login"
    }

    render() {
        return (
            <div className="contenido-cuerpo">
            <h4 className="titulo-contenido-cuerpo">¡Hola!</h4>
            <p>
                En este sitio encontrarás tips o <b>hacks</b> para mejorar tu conocimiento en el lenguaje Bash utilizando los sistemas operativos de Linux Ubuntu, Linux Fedora y MacOS (en sus diferentes versiones).
            </p>
            <p>
                Espero te resulte útil este contenido. Cualquier comentario me lo podés hacer a mi cuenta de Twitter: <a href="https://twitter.com/GochiParisi" target="_blank">@GochiParisi</a>.
            </p>

            <h4 style={{textAlign: "center", marginTop: 40 + "px"}}>
                ¡Quiero practicar Bash ahora mismo!
            </h4>
            <div style={{textAlign: "center", marginTop: 15 + "px"}}>
                <button type="button" className={"btn btn-dark"} onClick={this.irAPracticar}>Practicar</button>
            </div>
            </div>
        );
    }
}

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
        } else if (path === PATH_PARTICIONES_Y_SISTEMAS_DE_ARCHIVOS) {
            componenteAMostrar = <ContenidoParticionesYSistemasDeArchivos />;
        }

        return  (
            <Col className="cuerpo" xs="12" lg="10">
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
            <Col className="menu-lateral" xs="12" lg="2">
                <h3 className="titulo-menu">Menú</h3>
                <Nav defaultActiveKey="/crear-un-menu" className="flex-column mt-3" onSelect={this.onSelect}>
                    <Nav.Link eventKey={ PATH_INICIO }>Inicio</Nav.Link>
                    <Nav.Link eventKey={ PATH_CREAR_UN_MENU }>Crear un menú</Nav.Link>
                    <Nav.Link eventKey={ PATH_ELIMINAR_LA_CABECERA_DE_UN_ARCHIVO }>Eliminar la cabecera de un archivo</Nav.Link>
                    <Nav.Link eventKey={ PATH_ELIMINAR_ESPACIOS_REPETIDOS }>Eliminar espacios</Nav.Link>
                    <Nav.Link eventKey={ PATH_MOSTRAR_COLORES }>Mostrar colores</Nav.Link>
                    <Nav.Link eventKey={ PATH_REALIZAR_OPERACIONES_ARITMETICAS }>Realizar operaciones aritméticas</Nav.Link>
                    <Nav.Link eventKey={ PATH_RENOMBRAR_UN_CONJUNTO_DE_ARCHIVOS }>Renombrar un conjunto de archivos</Nav.Link>
                    <Nav.Link eventKey={ PATH_PARTICIONES_Y_SISTEMAS_DE_ARCHIVOS }>Particiones y sistemas de archivos</Nav.Link>
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

class ContenedorBienvenidaPlataforma extends React.Component {
    render() {
        return <Container fluid style={{height: "calc(100vh - 78px)"}}>
            <Row style={{textAlign: "center"}}>
                <Col md={{ span: 4, offset: 4 }} style={{marginTop: "140px"}}>
                    <PanelLogin/>
                </Col>
            </Row>
        </Container>;
    }
}

class ContenedorRegistroPlataforma extends React.Component {
    render() {
        return <Container fluid style={{height: "calc(100vh - 78px)"}}>
            <Row style={{textAlign: "center"}}>
                <Col md={{ span: 4, offset: 4 }} style={{marginTop: "60px"}}>
                    <PanelRegistro/>
                </Col>
            </Row>
        </Container>;
    }
}

class ContenedorEjercicios extends React.Component {
    render() {
        return (
          <div className={"contenedor-principal"}>
              <MenuNavegacion />
              <Container fluid>
                  <Row style={{textAlign: "center"}}>
                      <Col md={{ span: 10, offset: 1 }} style={{marginTop: "60px"}}>
                          <Ejercicios/>
                      </Col>
                  </Row>
              </Container>
            </div>
          );
    }
}

class ContenedorTableroPuntuacion extends React.Component {
    render() {
        return (
          <div className={"contenedor-principal"}>
              <MenuNavegacion />
              <Container fluid>
                  <Row style={{textAlign: "center"}}>
                      <Col md={{ span: 10, offset: 1 }} style={{marginTop: "60px"}}>
                          <TableroPuntuacion/>
                      </Col>
                  </Row>
              </Container>
            </div>
          );
    }
}

function PrivateRoute ({ children, ...rest }) {
  /*if (autenticado) {
    return (
      <Route path={ PATH_DESAFIOS } exact render={() => <ContenedorEjercicios />} />
    )
  } else {
    return (
      <Route exact render={() => <ContenedorBienvenidaPlataforma />} />
    )
  }*/
}

function getcookie(name = '') {
    let cookies = document.cookie;
    let cookiestore = {};

    cookies = cookies.split(";");

    if (cookies[0] == "" && cookies[0][0] == undefined) {
        return undefined;
    }

    cookies.forEach(function(cookie) {
        cookie = cookie.split(/=(.+)/);
        if (cookie[0].substr(0, 1) == ' ') {
            cookie[0] = cookie[0].substr(1);
        }
        cookiestore[cookie[0]] = cookie[1];
    });

    return (name !== '' ? cookiestore[name] : cookiestore);
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
                            <Route path={ PATH_PARTICIONES_Y_SISTEMAS_DE_ARCHIVOS } exact render={() => <Contenedor />} />
                            <Route path={ PATH_LOGIN } exact render={() => <ContenedorBienvenidaPlataforma />} />
                            <Route path={ PATH_DESAFIOS } exact render={() => <ContenedorEjercicios />} />
                            <Route path={ PATH_PUNTUACION } exact render={() => <ContenedorTableroPuntuacion />} />
                            <Route path={ PATH_REGISTRO } exact render={() => <ContenedorRegistroPlataforma />} />
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
