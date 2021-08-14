import React from 'react'

export class PanelLogin extends React.Component {
  render() {
    return (
      <div>
          <h3>Panel para iniciar sesión</h3>
          <div className="mb-3">
              <label for="lblUsuario" className="form-label">Usuario</label>
              <input type="text" className="form-control" id="lblUsuario" />
          </div>
          <div className="mb-3">
              <label for="lblClave" className="form-label">Clave</label>
              <input type="password" className="form-control" id="lblClave" />
          </div>
          <button style={{marginRight: "10px"}}>Iniciar sesión</button>
          <button style={{marginLeft: "10px"}}>Registrarse</button>
      </div>
      );
  }
}
