import React, { useEffect } from 'react';

export class ContenidoParticionesYSistemasDeArchivos extends React.Component {
    render() {
        return (
            <div className="contenido-cuerpo">
                <h4 className="titulo-contenido-cuerpo">Particiones y sistemas de archivos</h4>
                <p>Para aprender a crear particiones en discos y configurar sistemas de archivos en ellas,
                vamos a utilizar un "disco duro virtual". En realidad será un dispositivo de bloques tipo loop
                (no importa si no conocés este tipo de dispositivo, te lo explicaré en otro artículo).</p>
                <p>Lo primero que vamos a hacer, es crear un archivo de 10 MB (9,8 MiB = 10.240.000 bytes) con todos sus bytes en cero.</p>
                <pre className="code black-code">
dd if=/dev/zero of=disco bs=1K count=10000
                </pre>
                <p>
                  Ahora utilizaremos el comando fsdik, el cual nos va a permitir crear y manipular una tabla de particiones.
                </p>
                <h5>Tabla de particiones</h5>
                <p>Existen diferentes maneras de crear las particiones en un disco (dispositivo de bloques). Las 2 más conocidas
                son GPT (GUID Partition Table) y MBR (Master Boot Record). Al utilizar fdisk, por default, particionaremos nuestro disco en MBR.
                Si quisiéramos hacerlo en GPT, deberíamos utilizar gdisk.</p>
                <p>
                  Ejecutamos lo siguiente:
                </p>
                <pre className="code black-code">
fdisk disco
                </pre>
                <p>
                  Esto mostrará un menú interactivo que nos permitirá ir creando las particiones. A continuación te dejo un video en donde creo
                  2 particiones primarias, 1 extendida y, adentro de esa extendida, 2 particiones lógicas.
                </p>
                <div style={{ 'textAlign': 'center', 'marginTop': '25px', 'marginBottom': '25px' }}>
                  <video width="968" controls playbackrate="2">
                    <source src="fdisk.mp4" type="video/mp4" />
                  </video>
                </div>
                <p>
                  Básicamente lo que creamos en el video, lo podemos resumir en la siguiente imagen:
                </p>
                <div style={{ 'textAlign': 'center' }}>
                  <img src="particiones.svg" style={{ 'width': '80%', 'marginTop': '25px', 'marginBottom': '45px' }} />
                </div>

                <h5>Creando dispositivo de bloques</h5>
                <p>
                  Ahora vamos a crear el dispositivo de bloques, pero antes de eso, vamos a consultar los
                  dispositivos de bloques que tenemos actualmente:
                </p>
                <pre className="code black-code">
ls -l /dev/ | grep ^b
                </pre>
                <p>
                  Obtendrás una salida parecida a la siguiente:
                </p>
                <div style={{ "textAlign": "left", "marginBottom": "20px" }}>
                  <img src="dispositivos_bloques_pre.png"/>
                </div>
                <p>
                  Ahora sí, llegó el momento de crear el dispositivo de bloques. Ejecutamos el siguiente comando:
                </p>
                <pre className="code black-code">
sudo losetup -fP disco
                </pre>

                <p>
                  Si ahora consultamos los dispositivos de bloques, veremos que aparece uno más (en mi caso volví a
                    levantar el loop7 y aparecieron todas sus particiones, en tu caso puede ser que no tenías el loop7):
                </p>
                <div style={{ "textAlign": "left", "marginBottom": "20px" }}>
                  <img src="dispositivos_bloques_post.png"/>
                </div>
                <p>
                  Con losetup estamos creando un dispositivo de bloques tipo loop. Los dispositivos
                  de bloques tipo loop son aquellos en donde el dispositivo está en el mismo
                  sistema de archivos.
                </p>

                <h5 style={{ "marginTop": "30px"}}>Configurando sistema de archivos</h5>
                <p>
                  Para configurar un sistema de archivos en una de las particiones anteriormente creadas, debemos ejecutar:
                </p>
                <pre className="code black-code">
{`sudo mkfs.ext4 /dev/loop7p1
sudo mkfs.ntfs /dev/loop7p2`}
                </pre>
                <p>
                  Notar que hemos configurado el sistema de archivos ext4 en la partición loop7p1 y el sistema de archivos ntfs en loop7p2.
                </p>
                <p>
                  De hecho, ahora podemos revisar que así haya sido con el comando lsblk.
                </p>
                <pre className="code black-code">
lsblk -o NAME,FSTYPE,MOUNTPOINT
                </pre>
                <div style={{ "textAlign": "left", "marginBottom": "20px" }}>
                  <img src="lsblk.png"/>
                </div>

                <h5 style={{ "marginTop": "30px"}}>Montando el sistema de archivos</h5>
                <p>Por último, debemos montar el sistema de archivos, y para ello necesitamos un directorio. Entonces, lo creamos:</p>
                <pre className="code black-code">
sudo mkdir /mnt/dir
                </pre>
                <p>
                  Ahora, montamos el dispositivo en el directorio.
                </p>
                <pre className="code black-code">
sudo mount /dev/loop7p1 dir
                </pre>
                <p>
                  Finalmente podemos ingresar a este directorio y crear un archivo pero
                  previamente es necesario cambiar los permisos del directorio.
                  Una vez que estés adentro del directorio, podés ejecutar:
                </p>
                <pre className="code black-code">
df .
                </pre>
                <p>
                  Con esto podrás revisar en qué sistema de archivos te encuentras.
                </p>

                <h5 style={{ "marginTop": "30px"}}>Preguntas avanzadas para investigar</h5>
                <ol>
                  <li>¿Qué pasa si monto 2 veces el mismo dispositivo pero en 2 directorios diferentes?</li>
                  <li>¿Puedo con el comando dd crear un archivo que contenga solo los datos de la MBR?</li>
                  <li>¿Puedo convertir un disco en MBR en GPT?</li>
                </ol>

            </div>
        );
    }
}
