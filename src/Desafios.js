import React from 'react'


export class Desafios extends React.Component {
    render() {
      return (
        <table className={"table table-dark table-striped"}>
            <thead>
                <th>Ejercicio</th>
                <th>Nivel</th>
                <th>Subir solución</th>
            </thead>
            <tbody>
                <tr>
                    <td>Multiplicar 2 números.</td>
                    <td>Principiante</td>
                    <td>
                        <button type="button" class="btn btn-dark">Subir solución</button>
                    </td>
                </tr>
                <tr>
                    <td>Sumar números por parámetros.</td>
                    <td>Medio</td>
                    <td>
                        <button type="button" class="btn btn-dark">Subir solución</button>
                    </td>
                </tr>
                <tr>
                    <td>Test</td>
                    <td>Alto</td>
                    <td>
                        <button type="button" class="btn btn-dark">Subir solución</button>
                    </td>
                </tr>
                <tr>
                    <td>Test</td>
                    <td>Muy alto</td>
                    <td>
                        <button type="button" class="btn btn-dark">Subir solución</button>
                    </td>
                </tr>
            </tbody>
        </table>
      )
    }
}
