import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
//import { Modal } from 'bootstrap'
//import { useState, useEffect, useRef } from 'react'


export class Ejercicios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  leerContenido(contenido) {
    // Se usa una key random para que se vuelva a llamar al constructor del componente React.
    const modalEjercicios = <ModalEjercicios show={true} enunciado={contenido} key={Math.random()} />;
    ReactDOM.render(modalEjercicios, document.getElementById('modales'));
  }

  subirSolucion(idEjercicio) {
    const modalSubirSolucion = <ModalSubirSolucion idEjercicio={idEjercicio} key={Math.random()} />;
    ReactDOM.render(modalSubirSolucion, document.getElementById('modales'));
  }

  componentDidMount() {
    fetch("/sop/backend/ctrl/ajax/get_ejercicios.php")
      .then(res => res.json())
      .then(
        (result) => {
          if (result.estado === "ok") {
            this.setState({
              isLoaded: true,
              items: result.datos.ejercicios
            });
          } else {
            this.setState({
              isLoaded: true,
              error: "Ocurrió un error"
            });
          }
        },
        // Nota: es importante manejar errores aquí y no en
        // un bloque catch() para que no interceptemos errores
        // de errores reales en los componentes.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }

    render() {
      const { error, isLoaded, items } = this.state;
      if (error) {
        return <div style={{"color": "white"}}>Error al cargar los desafíos</div>;
      } else if (!isLoaded) {
        return <div>Cargando...</div>;
      } else {
        if (items != null) {
          return (
            <table className={"table table-dark table-striped"}>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Enunciado</th>
                    <th>Nivel</th>
                    <th>Subir solución</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>{item.titulo}</td>
                      <td><button type="button" className={"btn btn-dark"} onClick={() => this.leerContenido(item.contenido)}>Leer</button></td>
                      <td>{item.nivel}</td>
                      <td><button type="button" className={"btn btn-dark"} onClick={() => this.subirSolucion(item.id)}>Subir solución</button></td>
                    </tr>
                  ))}
                </tbody>
            </table>
          )
        }

      }
    }
}


export class ModalEjercicios extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: true,
      isLoaded: false,
      items: []
    };
    this.cerrar = this.cerrar.bind(this);
  }

  cerrar() {
    this.setState({
      show: false
    });
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
  }

  render() {
    const { show, isLoaded, items } = this.state;

    return (
      <>
        <Modal show={show}>
          <Modal.Header>
            <Modal.Title>Enunciado</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.enunciado}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.cerrar}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}


export class ModalSubirSolucion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: true,
      isLoaded: false,
      items: []
    };
    this.cerrar = this.cerrar.bind(this);
    this.subir = this.subir.bind(this);
  }

  cerrar() {
    this.setState({
      show: false
    });
  }

  subir() {
    let solucion = document.getElementById("txaSolucion").value;
    if (solucion != null && solucion !== "") {
      document.getElementById("btnSubir").setAttribute("disabled", "true");
      const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: solucion
      };
      fetch("/sop/backend/ctrl/ajax/subir_solucion.php?id_ejercicio=" + this.props.idEjercicio, requestOptions)
            .then(res => res.json())
            .then(
              (result) => {
                document.getElementById("btnSubir").removeAttribute("disabled");
                if (result.estado === "ok") {
                  let resultado = document.getElementById("resultado");
                  resultado.innerHTML = result.datos.salida;
                  resultado.classList.remove("alert-info");
                  resultado.classList.remove("alert-danger");
                  resultado.classList.add("alert-success");
                } else {
                  let resultado = document.getElementById("resultado");
                  resultado.innerHTML = result.datos.salida;
                  resultado.classList.remove("alert-info");
                  resultado.classList.remove("alert-success");
                  resultado.classList.add("alert-danger");
                }
              },
              (error) => {
                console.log(error)
              }
            ).catch(error => {
              console.log(error)
            });
    }
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
  }

  render() {
    const { show, isLoaded, items } = this.state;

    return (
      <>
        <Modal show={show} size="lg">
          <Modal.Header>
            <Modal.Title>Subir solución</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea rows="10" className={"form-control"} id="txaSolucion"></textarea>
            <p id="resultado" className={"alert alert-info"}>Subí tu solución y aquí verás el resultado...</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.subir} id="btnSubir">
              Subir
            </Button>
            <Button variant="secondary" onClick={this.cerrar}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
