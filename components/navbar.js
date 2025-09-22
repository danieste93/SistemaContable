

import React from 'react';
import { logOut } from '../reduxstore/actions/myact'; 
import { withRouter } from 'next/router';
import '../styles/nav.css';
import postal from 'postal';
import Link from 'next/link';
import {connect} from 'react-redux';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Router from "next/router"

 class Navbar extends React.Component {
  

    state = {
      isOpen: false,
      isscroll: false,
      iconchange:false,
      alturabanner:false,
      scrollanimAltura:false,
      ondesktop: false,
      fondoalt:false,
      usuario:false,
      setSidebarOpen:false,

    };
    channel1 = null;
    channel2 = null;
    channel3 = null;
  
 
  
 

  componentDidMount() {
    
    this.desktopverifi()

    
    this.channel1 = postal.channel();
    this.channel2 = postal.channel();
    this.channel3 = postal.channel();

    const {route} = this.props.router;
  
    
    
    
 
  

   


     window.addEventListener('resize',()=>{
      
    this.desktopverifi()
     })
  

    window.addEventListener('scroll', (event) => {
          const {route} = this.props.router;

        
          const alturawindow = window.document.documentElement.clientHeight
          
         if( window.scrollY >= 10){
           
              this.setState({isscroll:true})
           
              
              
          } 
     
                   

  
 
  else if( window.scrollY <= 50){
    this.setState({isscroll:false})
   
  }else if(  window.scrollY <= alturawindow ){
    this.channel1.publish('scrollof', {
      message: 'enviado desde reset'
   });
   this.setState({ iconchange:false})
  } 
 

  else if ( window.scrollY >= 10){
    this.setState({isscroll:true, iconchange:true})

  } else if ( window.scrollY <= 5){
    this.setState({isscroll:false, iconchange:false})

  } 

 

      }// fin del evento 
      
    );
  }

  logOut=()=>{
  
    this.props.dispatch(logOut())

    localStorage.clear()
  
    }
  desktopverifi(){
    if(window.document.body.clientWidth >= 1200){
      this.setState({ondesktop:true})
     
    } else if(window.document.body.clientWidth < 1200){
      this.setState({ondesktop:false})
    }
  }

  burgerclick = valor => {
   this.setState({
    isOpen: !this.state.isOpen
  });
}




botonera = (e) =>{
 
const ocultador = ()=>{
  if(!this.state.ondesktop){

    this.setState({
      isOpen: !this.state.isOpen
    });
  
    this.channel3.publish('botonera', {
      message: 'enviado desde botonera'
   });
  }

}

ocultador();
  
}

botonlogin=()=>{

  let estilosnav = this.state.isscroll?"botonClickactive":"botonClick";
  if(this.props.usuario !== "" ){
    console.log("ejecutando con user")

if(this.props.usuario.update.usuario.Tipo == "administrador"){

  return (<Link href="/usuarios/administrador" >
  <div id="perfiladmin"   className={estilosnav} onClick={this.botonera}>
    <div id="adminicon" className="iconic "   >
    <img src="/icons/account_box.svg" alt=""/>
    </div> 
    <div className="conttextbar" >
        <a className="enlacePrincipal">Admin</a>
        </div>
  </div>
  </Link>)
}
else if(this.props.usuario.update.usuario.Tipo == "vendedor" || this.props.usuario.update.usuario.Tipo == "tesorero"){

  return (<Link href="/usuarios/vendedor" >
  <div id="perfil"   className={estilosnav} onClick={this.botonera}>
    <div id="clienticon"  className="iconic "   >
    <img src="/icons/account_box.svg" alt=""/>
    </div> 
    <div className="conttextbar " >
        <a className="enlacePrincipal">Perfil</a>
        </div>
  </div>
  </Link>)
}


  
  }
  
  
  else {
    console.log("ejecutando sin user")
    return (<Link href="/ingreso">
  <div id="login123"   className={estilosnav} onClick={this.botonera}>
    
    <div id="sinusericon"  className="iconic "   >
    <img src="/icons/account_box.svg" alt=""/>
    </div> 
    <div className="conttextbar" >
     <a className="enlacePrincipal"> Ingresa</a>  
        </div>
  </div>
  </Link>
  )}
}
 asignadorDeRuta=()=>{
  if(this.props.usuario.update.usuario.user.Tipo === "administrador"){

    return "/usuarios/administrador"
 
} else if(this.props.usuario.update.usuario.user.Tipo === "vendedor" || this.props.usuario.update.usuario.user.Tipo === "tesorero"){

  return "/usuarios/vendedor"
}
}
usercont=(e)=>{
  const {route} = this.props.router;

  const links = [
    { name: 'Inicio', icon: 'home' },
    { name: 'Servicios', icon: 'build' },
    { name: 'Productos', icon: 'shopping_cart' },
    { name: 'Contacto', icon: 'contact_mail' },
  ];
  if(this.props.usuario !== ""  ){
    const ruta = `/`

  
    return ( 
    <Dropdown>
      <Dropdown.Toggle variant="info" className="userCont" id="dropdown-basic" style={{marginRight:"15px"}}>
      {this.props.usuario.update.usuario.user.Usuario.substring(0,1).toUpperCase()}
      </Dropdown.Toggle>

      <Dropdown.Menu>
      <Dropdown.Item href={"/registro-contable"}>
        <button className='btn btn-warning btnDropDowm ' >  
      <span className="material-icons">
account_balance
</span>
<p>Cuentas</p>
</button>
        </Dropdown.Item>
        <Dropdown.Item href={"/inventario"}>
        <button className='btn btn-info btnDropDowm ' >  
      <span className="material-icons">
inventory_2
</span>
<p>Inventario</p>
</button>
        </Dropdown.Item>
        <Dropdown.Item href={"/punto-de-venta"}>
        <button className='btn btn-secondary btnDropDowm ' >  
      <span className="material-icons">
point_of_sale
</span>
<p>P. Venta</p>
</button>
        </Dropdown.Item>
      <Dropdown.Item href={this.asignadorDeRuta()}>
        
      <button className='btn btn-success btnDropDowm ' >  
      <span className="material-icons">
dashboard
</span>
<p>Dashboard</p>
</button>
        </Dropdown.Item>
        <Dropdown.Item href={"/configuracion-general"}>
        <button className='btn btn-primary btnDropDowm ' >  
      <span className="material-icons">
settings
</span>
<p>Configuracion</p>
</button>
        </Dropdown.Item>
        <Dropdown.Item href="#/action-2">
        <Link href="/ingreso" ><a style={{textDecoration:"none"}}>
        <button className=" btn btn-danger btnDropDowm"  onClick={this.logOut}>
        <span className="material-icons">
logout
</span>
<span>Cerrar sesión</span>

</button>
</a>
        </Link>
        </Dropdown.Item>
       
      
      </Dropdown.Menu>
    </Dropdown>)
  }else if( route === "/" ){return (
    <div className='contBotonera'>
<div className="links-desktop">
          {links.map((link) => (
            <a key={link.name} href={`#${link.name.toLowerCase()}`} className="nav-link">
              
              {link.name}
            </a>
          ))}
        </div>
        <Link href="/ingreso">
        <button className="ingreso-button">Ingreso</button>
        </Link>
       
         {/* Burger button for mobile */}
         <button className="burger-button" onClick={() => this.setState({setSidebarOpen:true})}>
          <span className="material-icons">menu</span>
        </button>



</div>

  )



  }

}

  render() {
    const {route} = this.props.router;
    let genrouter = route == "/ingreso"?"/":"/ingreso"
const links = [
    { name: 'Inicio', icon: 'home' },
    { name: 'Servicios', icon: 'build' },
    { name: 'Productos', icon: 'shopping_cart' },
    { name: 'Contacto', icon: 'contact_mail' },
  ];
     let estilosnav = this.state.isscroll?"botonClickactive":"botonClick";


    let fondobarra = this.state.isscroll == true ? "fondoa": "fondod"
              

    let modificator;

    if(this.state.ondesktop){

      modificator = "navBDESKTOP"
    }

    else if(!this.state.ondesktop && this.state.isOpen){

      modificator = "navBA"
    }
    
    else if(!this.state.ondesktop && !this.state.isOpen){

      modificator = "navBD"
    }


    return (
    
      <div style={{paddingBottom:"2px"}} className={fondobarra}>
     
   

      <div className="contlogo">
      <Link href={genrouter} >
    <img className='logoimg'src="/static/logo1.png" alt="logotipo empresa" />
    </Link>
    </div>
     

  
 
    <div className="navXSderecha ">


    {this.usercont()}

        
  
 </div> 

   {/* Sidebar */}
   
       <div className={`sidebar ${this.state.setSidebarOpen ? 'open' : ''}`}>
          <button className="close-button" onClick={() => this.setState({setSidebarOpen:false})}>
            <span className="material-icons">close</span>
          </button>
          <div className="logo-container">
            <img src="/static/logo1.png" alt="Logo de la empresa" className="logo" />
          </div>
          <nav className="sidebar-links">
            {links.map((link) => (
              <a
                key={link.name}
                href={`#${link.name.toLowerCase()}`}
                className="sidebar-link"
                onClick={() =>  this.setState({setSidebarOpen:true})}
              >
                <span className="material-icons sidebar-icon">{link.icon}</span>
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      

 <style >{`
       
        .ingreso-button {
          background: white;
          color: #16a34a;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          border: none;
          cursor: pointer;
          margin-right:5px;
        }
        .links-desktop {
          display: none;
        }
        .nav-link {
          color: white;
          margin-left: 1rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          position: relative;
        }
        .nav-link::after {
          content: '';
          display: block;
          width: 0;
          height: 2px;
          background: white;
          transition: width 0.3s;
          position: absolute;
          bottom: -2px;
          left: 0;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-icon {
          margin-right: 0.25rem;
        }
        .burger-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          display: block;
        }
     .sidebar {
          position: fixed;
          top: 0;
          right: -20rem;
          width: 10rem;
          height: 100%;
          background: white;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
          padding: 1rem;
          z-index: 100;
          display: flex;
          flex-direction: column;
          transition: 1s;
        }
          .open {
          right: 0px;
        }
        .close-button {
          align-self: flex-end;
          background: none;
          border: none;
          cursor: pointer;
        }
        .logo-container {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .logo {
          width: 4rem;
          height: auto;
          filter: grayscale(100%);
        }
        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .sidebar-link {
          color: #1f2937;
          text-decoration: none;
          font-size: 1rem;
          display: flex;
          align-items: center;
        }
        .sidebar-icon {
          margin-right: 0.5rem;
        }
        .sidebar-link:hover {
          color: #16a34a;
        }
          .contBotonera{
          display:flex;
          width:100%;
              justify-content: flex-end;
              margin-top: 13px;
    padding-right: 10px;
          }

        @media (min-width: 768px) {
          .links-desktop {
          width: 100%;
        justify-content: space-around;
          font-size:1.1rem;
            display: flex;
            margin-right:100px
          }
          .burger-button {
            display: none;
          }
        }
      `}</style>
    
      </div>
    );
  }
}

const mapStateToProps = state => {
  const usuario = state.userReducer

  return {usuario}
};
export default connect(mapStateToProps)(withRouter(Navbar))

