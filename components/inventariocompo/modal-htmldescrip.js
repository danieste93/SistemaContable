import React, { Component } from 'react'
import {Animate} from "react-animate-mount"
import EmailEditor from 'react-email-editor';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ModalTemplates from "./modal-templates"
class HtmlDescip extends Component {
  state={
    Alert:{Estado:false},
    loading:false,
    loadOneTime:false,
    templates:false,
    loadingSaveDesing:false,
  }
  emailEditorRef   = React.createRef();
  saveDesign = () => {
    if(!this.state.loadingSaveDesing){
      this.setState({loadingSaveDesing:true})
      this.emailEditorRef.current.editor.exportHtml((data) => {
       
        this.emailEditorRef.current?.editor?.saveDesign((diseno) => {
          const { design, html } = data;
          console.log(data)
          let datos = {User: {DBname:this.props.userData.user.DBname},
          HTMLdata: html,
          idArt:"9999999",
          EqId:"9999999",
          Titulo:"Por titular",
          Diseno:diseno,
          Tipo:"Template"
        }
console.log(datos)
        fetch("/public/saveTemplate", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(datos), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.userData.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
         console.log(response)
         if(response.message=="error al registrar"){
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Error en el sistema, porfavor intente en unos minutos"
        }
        this.setState({Alert: add, loading:false,}) 
        }else{
                  
          let add = {
          Estado:true,
          Tipo:"success",
          Mensaje:"Plantilla Guardada"
        }
        this.setState({loadingSaveDesing: false, Alert:add})
      
      }  
        
        })



        })
       })
    }
  }
  exportHtml = () => {
    if(!this.state.loading){
    this.setState({loading:true})
console.log(this.props.data)
    this.emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html} = data;

   
    
      this.emailEditorRef.current?.editor?.saveDesign((design) => {
      
        let datos = {User: {DBname:this.props.userData.user.DBname},
        HTMLdata: html,
        idArt:this.props.data._id,
        EqId:this.props.data.Eqid,
        Titulo:this.props.data.Titulo,
        Diseno:design
      }
      fetch("/public/editHtmlArt", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(datos), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.userData.token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
       console.log(response)
       if(response.message=="error al registrar"){
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:"Error en el sistema, porfavor intente en unos minutos"
      }
      this.setState({Alert: add, loading:false,}) 
      }else{
                
        let add = {
        Estado:true,
        Tipo:"success",
        Mensaje:"Articulo Actualizado"
      }
      this.setState({Alert: add})
      this.Onsalida()
    }  
      
      })


      });
  

    });}
  };

    componentDidMount(){

      console.log(this.props)
      setTimeout(function(){ 
        
        document.getElementById('mainHtmlDescript').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
   
      Onsalida=()=>{
        document.getElementById('mainHtmlDescript').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      loaddata=  ()=>{
     if(this.state.loadOneTime == false){
     
        let datos = {User: {DBname:this.props.userData.user.DBname,

        },          
        idArt:this.props.data.Eqid,
      }
      let lol = JSON.stringify(datos)
      fetch("/public/gethtmlart", {
        method: 'POST', // or 'PUT'
        body: lol, // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.userData.token
        }
      }).then(res => res.json())
      .catch(error => {console.error('Error:', error);
             })
      .then(response => {  
       console.log(response)
       this.setState({loadOneTime:true})
          if(response.status == 'error'){
        
                  if(response.message == "error al decodificar el token"){
                    this.props.dispatch(logOut());
                    this.props.dispatch(cleanData());
                    alert("Session expirada, vuelva a iniciar sesion para continuar");
                
                
                    Router.push("/")
                      
                  }
                  if(response.message=="error al registrar"){
                    let add = {
                      Estado:true,
                      Tipo:"error",
                      Mensaje:"Error en el sistema, porfavor intente en unos minutos"
                  }
                  this.setState({Alert: add, loading:false,}) 
                  }else if(response.message=="articuloHTML no encontrado"){
                    
                  }

          }else if(response.status == 'Ok'){             

            if(response.message == "articuloHTML no encontrado"){

            }else if(response.message == "articuloHTML Encontrado"){

this.emailEditorRef.current?.editor?.loadDesign(response.HTMLdata.Diseno);

            }
          }
      });
    }
        }
        SendDesing=  (data)=>{

this.emailEditorRef.current?.editor?.loadDesign(data);
        }
  
    render () {
     const funclista =  () => {
        this.setState({loading:false})
        console.log("en getdata On ready")
  
   
  
     
  
          // editor is ready
          // you can load your template here;
          // const templateJson = {};
          // emailEditorRef.current.editor.loadDesign(templateJson);
        };
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
   
        return ( 

         <div >

<div className="maincontacto" id="mainHtmlDescript" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Editor HTML 

</div>



</div> 
<div className="Scrolled">

<EmailEditor ref={this.emailEditorRef} onReady={()=>{  this.loaddata()}} />
<div className='custombuttons'>
<div className="contBotonPago">
                    <Animate show={this.state.loading}>
                    <CircularProgress />
</Animate>
<Animate show={!this.state.loading}>
                    <button  className={` btn btn-primary botonedit2 `} onClick={this.exportHtml} >
<p>Guardar</p>
<i className="material-icons">
edit
</i>

</button>
</Animate>
                    </div>
                    <div className="contBotonPago">
               
                    <button  className={` btn btn-warning customLandscape `} onClick={()=>{this.setState({templates:true})}} >
<p>Plantillas</p>
<i className="material-icons">
landscape
</i>

</button>

                    </div>
                    <div className="contBotonPago">
                    <Animate show={this.state.loadingSaveDesing}>
                    <CircularProgress />
</Animate>
<Animate show={!this.state.loadingSaveDesing}>
                    <button  className={` btn btn-danger botonedit2 `} onClick={this.saveDesign} >
<p>Guardar Template</p>
<i className="material-icons">
edit
</i>

</button>
</Animate>
                    </div>
</div>
</div>
</div>
        </div>
<Animate show={this.state.templates}>

  <ModalTemplates  SendDesing={this.SendDesing} userdata={this.props.userData}Flecharetro={()=>{this.setState({templates:false})}}/>
</Animate>

          <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
        <style jsx >{`
        .customLandscape{

        }
.custombuttons{
  display: flex;
  justify-content: space-around;
}

           .maincontacto{
            z-index: 1298;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            left: -100%;
            position: fixed;
            top: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition:0.5s;
            
            }

            .contcontacto{
              border-radius: 30px;
              
              width: 90%;
              background-color: white;
              display: flex;
              flex-flow: column;
              justify-content: space-around;
              align-items: center;
              
              }
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
              }
              .entradaaddc{
                left: 0%;
                }

                .headercontact {

                  display:flex;
                  justify-content: space-around;
                  width: 80%;
                  }
                  .tituloventa{
                    display: flex;
                    align-items: center;
                    font-size: 30px;
                    font-weight: bolder;
                    text-align: center;
                    justify-content: center;
                    }
                    .tituloventa p{
                    margin-top:5px;
                    margin-bottom:5px
                    }
                    .botonedit{
                      display:flex;
                      padding:4px;
                      margin: 4px;
                  }
                  .botonedit p{
                      margin:0px
                  }
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 90vh;
                      padding: 5px;
                     
                     }
                  
           `}</style>
        

          
           </div>
        )
    }
}

export default HtmlDescip