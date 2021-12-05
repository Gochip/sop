import React from 'react'



export class TableroPuntuacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("/sop/backend/ctrl/ajax/get_puntuaciones.php")
      .then(res => res.json())
      .then(
        (result) => {
          if (result.estado === "ok") {
            var datosParaTabla = []
            for (var i = 0; i < result.datos.ejercicios_resueltos_por_usuarios.length; i++) {
              var resolucion = result.datos.ejercicios_resueltos_por_usuarios[i];
              if (!(resolucion.nombre_usuario in datosParaTabla)) {
                datosParaTabla[resolucion.id_usuario] = {
                  nombre_usuario: resolucion.nombre_usuario,
                  ejercicios_resueltos: [
                    resolucion.id_ejercicio
                  ]
                };
              } else {
              }
            }
            console.log(JSON.stringify(datosParaTabla))
            this.setState({
              isLoaded: true,
              items: datosParaTabla
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
                  <th>Usuario</th>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  <th>6</th>
                  <th>7</th>
                  <th>8</th>
                  <th>9</th>
                  <th>10</th>
                  <th>11</th>
                  <th>12</th>
                  <th>13</th>
                  <th>14</th>
                  <th>15</th>
                  <th>16</th>
                </tr>
              </thead>
              <tbody>
                {
                  items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.nombre_usuario}</td>
                    <td>{1 in item.ejercicios_resueltos}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
          </table>
        )
      } else {
        return (
          <span></span>
        )
      }
    }
  }
}
