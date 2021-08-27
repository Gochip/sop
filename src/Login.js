import React from 'react'

export class PanelLogin extends React.Component {

  constructor (props) {
    super(props);
    this.iniciarSesion = this.iniciarSesion.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  irAlRegistro() {
    window.location.href = "/registro";
  }

  iniciarSesion() {
    var usuario = document.getElementById('txtUsuario').value;
    var clave = document.getElementById('txtClave').value;
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: usuario, clave: clave })
    };
    fetch("/sop/backend/ctrl/ajax/iniciar_sesion.php", requestOptions)
          .then(res => res.json())
          .then(
            (result) => {
              if (result.estado === "ok") {
                window.location.href = "/desafios";
              } else {
                document.getElementById("lblUsuarioOClaveIncorrecta").classList.remove("d-none");
                document.getElementById('txtUsuario').value = "";
                document.getElementById('txtClave').value = "";
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

  onKeyPress(event) {
    if (event.charCode === 13) {
      this.iniciarSesion()
    }
  }

  render() {
    return (
      <div>
          <h3>Panel para iniciar sesión</h3>
          <label id="lblUsuarioOClaveIncorrecta" className="alert alert-warning d-none">Usuario o clave incorrecta</label>
          <div className="mb-3">
              <label for="txtUsuario" className="form-label">Usuario</label>
              <input type="text" className="form-control" id="txtUsuario" />
          </div>
          <div className="mb-3">
              <label for="txtClave" className="form-label">Clave</label>
              <input type="password" className="form-control" id="txtClave" onKeyPress={this.onKeyPress} />
          </div>
          <button style={{marginRight: "10px"}} className={"btn btn-dark"} onClick={this.iniciarSesion}>Iniciar sesión</button>
          <button style={{marginLeft: "10px"}} className={"btn btn-dark"} onClick={this.irAlRegistro}>Registrarse</button>
      </div>
      );
  }
}
