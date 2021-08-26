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

  leerContenido() {
    const modalEjercicios = <ModalEjercicios />;
    ReactDOM.render(modalEjercicios, document.getElementById('root'));
    /*const [modal, setModal] = useState(null)
    const exampleModal = useRef()

    useEffect(() => {
      setModal(
        new Modal(exampleModal.current)
      )
    }, [])*/
  }

  componentDidMount() {
    fetch("http://localhost:3000/sop/backend/ctrl/ajax/get_ejercicios.php")
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
                      <td><button type="button" className={"btn btn-dark"} onClick={this.leerContenido}>Leer</button></td>
                      <td>{item.nivel}</td>
                      <td><button type="button" className={"btn btn-dark"}>Subir solución</button></td>
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

  render() {
    const { show, isLoaded, items } = this.state;
    return (
      <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>Enunciado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          TEST
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.cerrar}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
