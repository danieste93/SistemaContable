import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import DropFileInput from "../drop-file-input/DropFileInput"
import { Animate } from "react-animate-mount";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {connect} from 'react-redux';
import ModalDeleteGeneral from './modal-delete-general';
class ModalSelectIcon extends Component {
   
  state={
    agregarImagenes:false,
    EditMode:false,
    loading:false,
    archivos:[],
    Alert:{Estado:false},
    urlImg:[],
    matrizIcons : [
    ]
  }

    componentDidMount(){



      this.getIcons()
     
      setTimeout(function(){ 
        
        document.getElementById('mainSelectIcons').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
      getIcons=()=>{
        let lol = JSON.stringify({  
          Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
          iDgeneral:9999996
          })
             


       let url = "/public/geticons"   
     fetch(url, {
     method: 'POST', // or 'PUT'
     body: lol, // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json',
       "x-access-token": this.props.state.userReducer.update.usuario.token
     }
     }).then(res => res.json()).then(response =>{
       console.log(response)

       this.setState({matrizIcons: response.Icons.concat(this.state.matrizIcons)
       })
        
      })
    }
      uploadimages=()=>{
        const miFormaData = new FormData()
        for(let i=0; i<=this.state.archivos.length;i++){
          miFormaData.append("file", this.state.archivos[i])
        
        
        miFormaData.append("upload_preset","perpeis7")
        const options = {
          method: 'POST',
          body: miFormaData,
          // If you add this, upload won't work
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // }
          };
          
          fetch('https://api.cloudinary.com/v1_1/registrocontabledata/image/upload', options)
          .then((response) => (
           response.json()
           )).then((data)=>{
             if(data.secure_url){
        let archivos = this.state.urlImg
        let stateactualizado = [...archivos, data.secure_url]
        this.setState({urlImg:stateactualizado})
        if(stateactualizado.length == this.state.archivos.length){
          this.setState({loading:false,agregarImagenes:false})
          

          let lol = JSON.stringify({  
             Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname},
             iDgeneral:9999996, 
             ...this.state})
                


          let url = "/public/addnewicons"   
        fetch(url, {
        method: 'POST', // or 'PUT'
        body: lol, // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.state.userReducer.update.usuario.token
        }
        }).then(res => res.json()).then(response =>{
         
          this.setState({matrizIcons: response.updadatedIcons.Data
          })

        })



        }
        }
          })
          .catch(error => {
         
            console.log(error)}
          );
        }
        
        
        
        }
      Onsalida=()=>{
        document.getElementById('mainSelectIcons').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      onFileChange = (files) => {

        this.setState({archivos:files})
      }
      Comprobador=()=>{
        this.setState({loading:true})
        if(this.state.archivos.length > 0){
       
          this.state.archivos.every((x,i)=> {
           
            if(x.type == "image/jpeg" || x.type == "image/jpg"  || x.type == "image/png"  || x.type == "image/webp"){
          
           if((i+1 ==this.state.archivos.length )){
            this.uploadimages()
           }
            }else{
                  
              let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:`El archivo ${x.name} no es un formato de imagen valido`
            }
            this.setState({Alert: add,  loading:false,}) 
            return false
            }
           
            
            })
         
         }else{
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Ingrese una imagen"
        }
        this.setState({Alert: add,  loading:false,}) 
         }
      }

    render () {
console.log(this.state)
      let matrizSuperiorIcons = 
       [ 
        {
          Nombre:"",
          Url:"",
          Categorias:[],
        },
        {
          Nombre:"",
          Url:"",
          Categorias:[],
        },
        {
          Nombre:"",
          Url:"",
          Categorias:[],
        },
      
      
      ]
let borderEdit = this.state.EditMode?"borderEdit":""
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
      

  

let iconosRender = this.state.matrizIcons.map((x,i)=> <div className={`MainContIcon ${borderEdit}`} key={i}>
  <Animate show={this.state.EditMode}>
   <button className=" btn btn-danger botonAddCrom" onClick={()=>{this.setState({itemTodelete:{seleccionado:x,iDgeneral:9999996},modalDelete:true})}}>
         
         <span className="material-icons">
       delete
       </span>
       </button>
       </Animate>
  <div className="contIconoFondo " onClick={()=>{this.props.sendUrl(x)}} >
                
                <img className='fondoCuentaSe jwPointer' src={x} />
               
                   </div>
</div>)

        return ( 

         <div >

<div className="maincontactoSelecticons" id="mainSelectIcons" >
<div className="contcontactoSIcons"  >
<div className="headercontactIcon">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Selecciona un fondo

</div>

<button className=" btn btn-success botonAddCrom" onClick={()=>{this.setState({agregarImagenes:!this.state.agregarImagenes})}}>
      
      <span className="material-icons">
    add
    </span>

    </button>
    <button className=" btn btn-primary botonAddCrom" onClick={()=>{this.setState({EditMode:!this.state.EditMode})}}>
         
         <span className="material-icons">
       edit
       </span>
       </button>
<Animate show={this.state.agregarImagenes}>
<div className='ContDropFile'>
<DropFileInput
                onFileChange={(files) => this.onFileChange(files)}
            />
</div>
<button className="botoncontact" onClick={this.Comprobador}>
<Animate show={this.state.loading}>
<CircularProgress />  
           
    </Animate>
<Animate show={!this.state.loading}>
    Agregar
    </Animate>
</button>
</Animate>

</div> 
<div className="Scrolled">
  <div className='ContenedorFondos'>
  {iconosRender}
  </div>

</div>
</div>
        </div>
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
  <Animate show={this.state.modalDelete}> 
        <ModalDeleteGeneral
         sendSuccess={(e)=>{this.setState({matrizIcons:e.updadatedIcons.Data})}}
         sendError={()=>{console.log("deleteerror")}}
        itemTodelete={this.state.itemTodelete}
         mensajeDelete={{mensaje:"Estas seguro quieres eliminar este fondo", url:"/public/deleteicon" }}
        Flecharetro={()=>this.setState({modalDelete:false})}
  
        />
           </Animate>
        <style >{`
        .fondoCuentaSe{
          width: 100%;
          margin: 10px;
          max-width: 331px;
      
        }
      .ContenedorFondos{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
      
      }
          .botonAddCrom{
            display:flex;
            padding:4px;
            margin:5px
             }
             .MainContIcon{
              display: flex;
              flex-flow: row-reverse;
              border:0px solid black;
              border-radius:0px
            
             }
             .borderEdit{
              border:1px solid black;
              transition:0.8s;
              border-radius:15px
            }
        
        .botonAddCrom p{
            margin:0px
        }
        .ContenedorIconos{
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
           .maincontactoSelecticons{
            z-index: 1302;
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

            .contcontactoSIcons{
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
.headercontactIcon{
  display:flex;
  align-items: center;
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
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 50vh;
                      padding: 5px;
                     
                     }
                    
                    .contIconoSelect{
                      background: whitesmoke;
                      border-radius: 50%;
                      padding: 5px;
                      display: flex;
                      justify-content: center;
                      border-bottom: 4px solid black;
                      height: 80px;
                      overflow: hidden;
                      margin: 10px;
                    } 
             .iconoCuenta{
              width: 95%;
              border-radius: 50%;
             }
           `}</style>
        

          
           </div>
        )
    }
}

const mapStateToProps = state=>  {
   
  return {
      state
  }
};

export default connect(mapStateToProps, null)(ModalSelectIcon);