import React, { Component } from 'react'
class LoginCompo extends Component {
    state = {}
    render() {

        return(
            <div className="jwMainContainer">

<div className="jwSubContainer jwColumn">
        <div className="jwCard extend  jwColumn">
            	<p className="tituloArt"> Eliminar tus de datos de la app</p>
                <p className="textoArt"> Al efectuar este proceso se eliminaran todos tus datos almacenados en la aplicacion, incluye usuario, contraseña, iglassCoins, historial de compras y demas datos obtenidos en la dinamica de iGlassApp. </p>
        </div>
        
        <div className="jwCard extend  jwColumn">  
        <ol>
            <li>Ingresa a tu perfil</li>
            <li>En la parte final en final de la pestaña de informacion personal</li>
            <li>Click en el boton Borrar cuenta</li>
            <li>Ingresa tu contraseña</li>
        </ol>
        
        <p className="subTituloart"> Listo todos tus datos se han eliminado del sistema</p>
            </div>
            </div>
        <style> {`
         
                `}
               
            </style>

        </div>

            )
    }

}

export default LoginCompo