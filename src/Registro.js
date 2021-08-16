import React from 'react'

export class PanelRegistro extends React.Component {

  registrarse() {
    var usuario = document.getElementById('txtUsuario').value;
    var clave = document.getElementById('txtClave').value;
    var repetirClave = document.getElementById('txtRepetirClave').value;
    if (clave !== repetirClave) {

      return;
    }
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: usuario, clave: clave })
    };
    fetch("http://localhost:3000/sop/backend/ctrl/ajax/registrarse.php", requestOptions)
          .then(res => res.json())
          .then(
            (result) => {
              if (result.estado === "ok") {
                window.location.href = "/desafios";
              } else {
                document.getElementById("lblUsuarioOClaveIncorrecta").classList.remove("d-none");
                document.getElementById('txtUsuario').value = "";
                document.getElementById('txtClave').value = "";
                console.log(result);
              }
            },
            // Nota: es importante manejar errores aquí y no en
            // un bloque catch() para que no interceptemos errores
            // de errores reales en los componentes.
            (error) => {
              console.log(error)
            }
          ).catch(error => {
            console.log(error)
          });
  }

  volverAIniciarSesion() {
    window.location.href = "/login";
  }

  render() {
    return (
      <div>
          <h3>Registrarse</h3>
          <label id="lblUsuarioOClaveIncorrecta" className="alert alert-warning d-none">Usuario o clave incorrecta</label>
          <div className="mb-3">
              <label for="txtUsuario" className="form-label">Usuario</label>
              <input type="text" className="form-control" id="txtUsuario" />
          </div>
          <div className="mb-3">
              <label for="txtClave" className="form-label">Clave</label>
              <input type="password" className="form-control" id="txtClave" />
          </div>
          <div className="mb-3">
              <label for="txtClave" className="form-label">Repetir clave</label>
              <input type="password" className="form-control" id="txtRepetirClave" />
          </div>
          <button style={{marginRight: "10px"}} className={"btn btn-dark"} onClick={this.volverAIniciarSesion}>Volver</button>
          <button style={{marginLeft: "10px"}} className={"btn btn-dark"}>Registrarse</button>
      </div>
      );
  }
}
