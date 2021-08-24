import React from 'react'


export class Ejercicios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/sop/backend/ctrl/ajax/get_ejercicios.php")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            isLoaded: true,
            items: result.datos.ejercicios
          });
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
        return <div>Error al cargar los desafíos</div>;
      } else if (!isLoaded) {
        return <div>Cargando...</div>;
      } else {
        return (
          <table className={"table table-dark table-striped"}>
              <thead>
                  <th>Título</th>
                  <th>Enunciado</th>
                  <th>Nivel</th>
                  <th>Subir solución</th>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr>
                    <td>{item.titulo}</td>
                    <td><button type="button" className={"btn btn-dark"}>Leer</button></td>
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
