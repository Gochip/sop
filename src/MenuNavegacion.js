import React from 'react'

export class MenuNavegacion extends React.Component {
    render() {
        return (
          <nav className={"navbar navbar-expand-lg navbar-dark bg-dark"}>
            <div className={"container-fluid"}>
                <div className={"collapse navbar-collapse"}>
                    <ul className={"navbar-nav me-auto mb-2 mb-lg-0"}>
                    <li className={"nav-item"}>
                      <a className={"nav-link active"} aria-current="page" href="#">Desafíos</a>
                    </li>
                    <li className={"nav-item"}>
                      <a className={"nav-link"} href="#">Puntuaciones</a>
                    </li>
                    <li>
                      <a className={"nav-link"} href="/sop/backend/ctrl/cerrar_sesion.php">Salir</a>
                    </li>
                  </ul>
                </div>
            </div>
        </nav>
        )
    }
}
