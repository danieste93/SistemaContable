

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
      usuario:false

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
  
    
    
    if(route === "/"){
    
      this.setState({fondoalt:false})

    }
   else{
  
    this.setState({fondoalt:true})
   }
 
   
 
     this.channel2.subscribe('fondoalt', (data) => {
   
      this.setState({fondoalt:true})
       
     });

   


     window.addEventListener('resize',()=>{
      
    this.desktopverifi()
     })
  

    window.addEventListener('scroll', (event) => {
          const {route} = this.props.router;

        
          const alturawindow = window.document.documentElement.clientHeight
          
         if( route === "/" && window.scrollY >= alturawindow  ){
           
              this.setState({isscroll:true})
           
              this.channel1.publish('scrollon', {
                message: 'enviado desde reset'
             });
              
          } 
     
                   

  
 
  else if(route === "/" && window.scrollY <= 50){
    this.setState({isscroll:false})
   
  }else if( route === "/" && window.scrollY <= alturawindow ){
    this.channel1.publish('scrollof', {
      message: 'enviado desde reset'
   });
   this.setState({ iconchange:false})
  } 
 

  else if (route !== "/" && window.scrollY >= 10){
    this.setState({isscroll:true, iconchange:true})

  } else if (route !== "/"  && window.scrollY <= 5){
    this.setState({isscroll:false, iconchange:false})

  } 

 

      }// fin del evento 
      
    );
  }

  logOut=()=>{

    this.props.dispatch(logOut())
    Router.push("/")
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
usercont=(e)=>{

  if(this.props.usuario !== ""  ){
    const ruta = `/`
    let asignadorDeRuta=()=>{
      if(this.props.usuario.update.usuario.user.Tipo === "administrador"){
 
        return "/usuarios/administrador"
     
    } else if(this.props.usuario.update.usuario.user.Tipo === "vendedor" || this.props.usuario.update.usuario.user.Tipo === "tesorero"){
    
      return "/usuarios/vendedor"
  }
  }
  
    return ( 
    <Dropdown>
      <Dropdown.Toggle variant="info" className="userCont" id="dropdown-basic" style={{marginRight:"15px"}}>
      {this.props.usuario.update.usuario.user.Usuario.substring(0,1).toUpperCase()}
      </Dropdown.Toggle>

      <Dropdown.Menu>
      <Dropdown.Item href={asignadorDeRuta()}>
        
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
        <Link href="/" ><a style={{textDecoration:"none"}}>
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
  }else{return ("")}

}

  render() {
    

     let estilosnav = this.state.isscroll?"botonClickactive":"botonClick";
   

       
    

    let fondobarra = this.state.isscroll == true ? "fondoa": 
                     this.state.isscroll == false && !this.state.fondoalt? "fondod":
                     this.state.isscroll == false && this.state.fondoalt? "fondoalt":
                     'bocultar';

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
    
      <div  className={fondobarra}>
     
   

      <div className="contlogo">
      <Link href="/" >
    <img className='logoimg'src="/static/logo1.png" alt="logotipo empresa" />
    </Link>
    </div>
     

      <div id='mainul'className={modificator}>
       
       <div className="botonera">
                 
               
           


                  
        
                  
             
               
                  </div>
           
    

    </div>
 
    <div className="navXSderecha ">


    {this.usercont()}

        
  
 </div>    
 
    
      </div>
    );
  }
}

const mapStateToProps = state => {
  const usuario = state.userReducer

  return {usuario}
};
export default connect(mapStateToProps)(withRouter(Navbar))

