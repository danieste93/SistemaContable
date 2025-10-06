import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import {connect} from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import CircularProgress from '@material-ui/core/CircularProgress';
import ModalAddCatPub from './modal-addcatpub';
import ModalEditCatPub from './modal-editcatpub';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { addPublicacion,deletePubliHtml } from '../reduxstore/actions/blog';
import ModalAddPublicacion from './modal-htmldescrippublicacion';
import ModalDeleteGeneral from './cuentascompo/modal-delete-general';
import ModalDeleteCat from './cuentascompo/modal-delete-cat';
class AcessBlog extends Component {
    state={
        addCat:false,
        editCat:false,
        deleteCat:false,
        AddPublicacion:false,
        loadingUpdatePubli:false,
        selectedCat:"",
        modalDelete:false,
        selectedPublic:"",
        itemTodelete:"",
        catToDelete:"",
        Publicacionprimera:"",
        Publicacionsegunda:"",
        Publicaciontercera:"",
        Publicacioncuarta:"",
        Alert:{Estado:false},
    }
    componentDidMount(){
      if(!this.props.state.RegContableReducer.Publicaciones){
   
        this.getPublicaciones()
     }
    }
    updatePublicaciones=()=>{
      this.setState({loadingUpdatePubli:true})
      let datos = {
        User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,},
        ...this.state
      }
        let lol = JSON.stringify(datos)
    
        fetch("/public/tienda/updateConfigPubli", {
        method: 'POST', // or 'PUT'
        body: lol, // data can be `string` or {object}!
        headers:{
        'Content-Type': 'application/json',
        "x-access-token": this.props.state.userReducer.update.usuario.token
        }
        }).then(res => res.json())
        .catch(error => {console.error('Error:', error);
        })  .then(response => {  
        console.log(response,"updateconfig")
        if(response.status == 'error'){
        alert("error al actualizar registros")
          }
        else{
          let add = {
            Estado:true,
            Tipo:"success",
            Mensaje:"Configuracion actualizada"
        }
   
          this.setState({Alert: add,loadingUpdatePubli:false})
        
        }   
        })

    }
    getPublicaciones=()=>{
      console.log("getPublic")
      let datos = {
        User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
         
        },
      
      }
    let lol = JSON.stringify(datos)
    
    fetch("/public/tienda/getpublihtml", {
    method: 'POST', // or 'PUT'
    body: lol, // data can be `string` or {object}!
    headers:{
    'Content-Type': 'application/json',
    "x-access-token": this.props.state.userReducer.update.usuario.token
    }
    }).then(res => res.json())
    .catch(error => {console.error('Error:', error);
    })  .then(response => {  
    console.log(response,"regs")
    if(response.status == 'error'){
    alert("error al actualizar registros")
      }
    else{
     
      this.props.dispatch(addPublicacion(response.Publicaciones))
    
    }   
    })
    }
    handleChangeGeneral=(e)=>{
      console.log(e.target)
      this.setState({
      [e.target.name]:e.target.value
      })
      }  
render(){
  const handleClose = (event, reason) => {
    let AleEstado = this.state.Alert
    AleEstado.Estado = false
    this.setState({Alert:AleEstado})
   
}
  const Alert=(props)=> {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  let misCatsPubli=[]
let catRender =""
  if(this.props.state.RegContableReducer.Categorias){
    if(this.props.state.RegContableReducer.Categorias.length > 0){
      misCatsPubli = this.props.state.RegContableReducer.Categorias.filter(x=>x.tipocat == "Publicacion") 
      console.log(misCatsPubli)
      if(misCatsPubli.length > 0){
catRender = misCatsPubli.map(x=><div style={{backgroundImage: `url(${x.imagen[0]})`}} className='contCategoria'> 
  <div className='contTituloCatPub'>

  {x.nombreCat} 
  <Dropdown>
        
        <Dropdown.Toggle variant="light" className="contDropdown" id="dropdownm" style={{marginRight:"5px"}}>
        <span className="material-icons">
        more_vert
        </span>
    </Dropdown.Toggle>
  
     <Dropdown.Menu>
     
        <Dropdown.Item>
        <button className=" btn btn-primary btnDropDowm" onClick={()=>this.setState({selectedCat:x,editCat:true})}>
       
       <span className="material-icons">
     edit
     </span>
     <p>Editar</p>
     </button>
        </Dropdown.Item>

        <Dropdown.Item>
        <button className=" btn btn-danger btnDropDowm" onClick={()=>{this.setState({catToDelete:x,deleteCat:true})}}>
       
       <span className="material-icons">
     delete
     </span>
     <p>Eliminar</p>
     </button>
        </Dropdown.Item>

       
     </Dropdown.Menu>
          
           </Dropdown>
  </div>



</div>)
      }
    }}

let pubRender = []
let pubConfigRender=[]
if(this.props.state.RegContableReducer.Publicaciones){
if(this.props.state.RegContableReducer.Publicaciones.length > 0){
  pubConfigRender= this.props.state.RegContableReducer.Publicaciones.map(x=>{
    return(<option value={x._id}>{x.Titulo}</option>)
  })
  pubRender = this.props.state.RegContableReducer.Publicaciones.map(x=>{

    return(<div className='contPubliGeneral'>
<div className='contHeaderPub'>
<div className='contTituloPub' >{x.Titulo}</div>
<Dropdown>
        
        <Dropdown.Toggle variant="light" className="contDropdown" id="dropdownm" style={{marginRight:"5px"}}>
        <span className="material-icons">
        more_vert
        </span>
    </Dropdown.Toggle>
  
     <Dropdown.Menu>
     
        <Dropdown.Item>
        <button className=" btn btn-primary btnDropDowm" onClick={()=>this.setState({selectedPublic:x,AddPublicacion:true})}>
       
       <span className="material-icons">
     edit
     </span>
     <p>Editar</p>
     </button>
        </Dropdown.Item>

        <Dropdown.Item>
        <button className=" btn btn-danger btnDropDowm" onClick={()=>{this.setState({itemTodelete:x,modalDelete:true})}}>
       
       <span className="material-icons">
     delete
     </span>
     <p>Eliminar</p>
     </button>
        </Dropdown.Item>

       
     </Dropdown.Menu>
          
           </Dropdown>

</div>
<div className='contHtmlPub'>
<div dangerouslySetInnerHTML={{ __html: x.publicHtml }}>

</div>

</div>
<div className='contFooter'>

</div>

    </div>)
  })
}}
    return (
        <div style={{marginTop:"60px"}}>  
     <div className="tituloArt">Administrar Blog Posting</div>
    <div className="contGnCroom">
    <div className="contheaderConfig">
      <div>
      <div className="tituloArt">Configuración</div>
    <div className='contSendButton'> 
    
    <button className=" btn btn-primary botonAddCrom" onClick={this.updatePublicaciones}>
         <Animate show={!this.state.loadingUpdatePubli}>
         <span className="material-icons">
       send
       </span>
         </Animate>
       </button>
       <Animate show={this.state.loadingUpdatePubli}>
<CircularProgress/>
</Animate>

    </div>
      </div>
  
    <div className='contConfigTabla'>
    <div className='contTabla'>
      <div className='claveTabla'>
      Publicación Principal
      </div>
  <div className='valorTabla'>
        <select className='customSelect' name={"Publicacionprimera"}  value={this.state.Publicacionprimera} onChange={this.handleChangeGeneral}>
          <option value={""}></option>
          {pubConfigRender}
        </select>
      </div>

    </div>
    <div className='contTabla'>
      <div className='claveTabla'>
      Publicación Segunda
      </div>
  <div className='valorTabla'>
        <select className='customSelect' name={"Publicacionsegunda"} value={this.state.Publicacionsegunda} onChange={this.handleChangeGeneral}>
          <option value={""}></option>
          {pubConfigRender}
        </select>
      </div>

    </div>
    <div className='contTabla'>
      <div className='claveTabla'>
      Publicación Tercera
      </div>
  <div className='valorTabla'>
        <select className='customSelect' name={"Publicaciontercera"} value={this.state.Publicaciontecera} onChange={this.handleChangeGeneral}>
          <option value={""}></option>
          {pubConfigRender}
        </select>
      </div>

    </div>
    <div className='contTabla'>
      <div className='claveTabla'>
      Publicación Cuarta
      </div>
  <div className='valorTabla'>
        <select className='customSelect' name={"Publicacioncuarta"} value={this.state.Publicacioncuarta} onChange={this.handleChangeGeneral}>
          <option value={""}></option>
          {pubConfigRender}
        </select>
      </div>

    </div>
   
    </div>
  
    </div>
    <div className="contheadercromm">
        <div className="tituloArt">Mis Categorias</div>
        <div className="contLoader">
        <Animate show={!this.state.loadginData}>
        <div className="contBotonesCuen">
        <button className=" btn btn-success botonAddCrom" onClick={()=>{this.setState({addCat:true})}}>
      
      <span className="material-icons">
    add
    </span>

    </button>
          
       
          <Dropdown>
        
          <Dropdown.Toggle variant="light" className="contDropdown" id="dropdownm" style={{marginRight:"15px"}}>
          <span className="material-icons">
          more_vert
          </span>
      </Dropdown.Toggle>
    
       <Dropdown.Menu>
       
   
    
          <Dropdown.Item>
          <button className=" btn btn-warning btnDropDowm" onClick={this.updateData}>
         
         <span className="material-icons">
       update
       </span>
       <p>Actualizar</p>
       </button>
          </Dropdown.Item>

        

         
       </Dropdown.Menu>
            
             </Dropdown>
            
       
          
          </div>
        </Animate>
        <Animate show={this.state.loadginData}>
        <CircularProgress />
        </Animate>
        </div>
    </div>
    <div className='contCategorias'>
{catRender}

    </div>
    <div className="contheadercromm">
        <div className="tituloArt">Mis Publicaciones</div>
        <div className="contLoader">
        <Animate show={!this.state.loadginData}>
        <div className="contBotonesCuen">
        <button className=" btn btn-success botonAddCrom" onClick={()=>{this.setState({AddPublicacion:true})}}>
      
      <span className="material-icons">
    add
    </span>

    </button>
          
       
          <Dropdown>
        
          <Dropdown.Toggle variant="light" className="contDropdown" id="dropdownm" style={{marginRight:"15px"}}>
          <span className="material-icons">
          more_vert
          </span>
      </Dropdown.Toggle>
    
       <Dropdown.Menu>
       
   
    
          <Dropdown.Item>
          <button className=" btn btn-warning btnDropDowm" onClick={this.updateData}>
         
         <span className="material-icons">
       update
       </span>
       <p>Actualizar</p>
       </button>
          </Dropdown.Item>

        

         
       </Dropdown.Menu>
            
             </Dropdown>
            
       
          
          </div>
        </Animate>
        <Animate show={this.state.loadginData}>
        <CircularProgress />
        </Animate>
        </div>
    </div>
      <div className='mainContPubs'>
{pubRender}
      </div>


    </div> 
    <Animate show={this.state.addCat}>
        <ModalAddCatPub   Flecharetro4={()=>{this.setState({addCat:false})}}/>
        </Animate>
        <Animate  show={this.state.editCat}>
        <ModalEditCatPub data={this.state.selectedCat}  Flecharetro4={()=>{this.setState({editCat:false})}}/>
        </Animate>
        <Animate show={this.state.AddPublicacion}>
        <ModalAddPublicacion  editData={this.state.selectedPublic} Flecharetro={()=>{this.setState({AddPublicacion:false,selectedPublic:""})}}/>
        </Animate>
        <Animate show={this.state.modalDelete}> 
        <ModalDeleteGeneral
         sendSuccess={(e)=>{this.props.dispatch(deletePubliHtml(e.Publicacion));this.setState({itemTodelete:""}) }}
         sendError={()=>{console.log("deleteerror")}}
        itemTodelete={this.state.itemTodelete}
         mensajeDelete={{mensaje:"Estas seguro quieres eliminar esta articulo", url:"/public/tienda/deletepublihtml" }}
        Flecharetro={()=>this.setState({modalDelete:false})}
  
        />
           </Animate>
           <Animate show={this.state.deleteCat}> 
           <ModalDeleteCat catDelete={this.state.catToDelete} Flecharetro={()=>{this.setState({deleteCat:false})}}/>
           </Animate>
           <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
<style >
{`
.contTabla{
  width: 100%;
  max-width: 300px;
}
.customSelect{
  width: 60%;
}
.contConfigTabla{
  display:flex;
  width: 60%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.contTituloPub{
  width: 85%;
  font-size: 25px;
  font-weight: bolder;
  overflow-y: scroll;
  text-overflow: ellipsis;
  max-height: 120px;
}
.contHeaderPub{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0px;
  
  border-bottom: 2px solid darkblue;
  
}
.contPubliGeneral{
  width: 250px;
  margin:15px;
  border:1px solid darkblue;

 
  border-radius:10px;
}

.contHtmlPub{
  overflow:hidden;
  overflow-y:scroll;
  max-height: 300px;
}
.mainContPubs{
  display: flex;
  flex-wrap: wrap;
}
.contGnCroom{
    display: flex;
    flex-flow: column;
    width: 100%;
    align-items: center;

  }
  .contBotonesCuen{
    display:flex;
  }
  .valorTabla{
    width: 100%;
    max-width: 300px;
  }
  .botonAddCrom {
    display: flex;
    padding: 4px;
    margin: 5px;
}
  .contLoader{
          
    display: flex;
    flex-flow: column;
  }
  .contCategoria{
    width: 150px;
    height:150px;
    border:1px solid darkblue;
    border-radius:10px;
    background-size: cover;
  }
  .contCategorias{
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
  .contTituloCatPub{
    align-items: center;
    display: flex;
    justify-content: space-between;
    flexwrap: wrap;
    width: 100%;
    flex-wrap: wrap;
    background: #ffffffdb;
  }
  .contheadercromm{
    display: flex;
    justify-content: space-around;
    width: 100%;
    background: #e3ebf3;
    border-radius: 15px;
    padding: 5px;
    margin-top:20px;
    z-index: 10;
  }
  .contheaderConfig{
    display: flex;
    justify-content: space-around;
    width: 100%;
    background: #e3ebf3;
    border-radius: 15px;
    padding: 5px;
    margin-top:20px;
    flex-wrap:wrap;
    z-index: 10;
  }
  .contDropdown {
    margin-top: 5px;
    margin-left: 5px;
    height: 34px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
  .btnDropDowm p{
    margin-left: 4%;
  }
`}
            </style>
        </div> 
    )
}
}

const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
  export default connect(mapStateToProps, null)(AcessBlog);