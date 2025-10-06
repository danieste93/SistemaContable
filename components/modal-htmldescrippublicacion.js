import React, { Component } from 'react'
import {Animate} from "react-animate-mount"
import {connect} from 'react-redux';
import EmailEditor from 'react-email-editor';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import MuiAlert from '@material-ui/lab/Alert';
import DropFileInput from "./drop-file-input/DropFileInput"
import ModalTemplates from "./inventariocompo/modal-templates";
import { addPublicacion, editPublicacion } from "../reduxstore/actions/blog";
class HtmlDescip extends Component {
  state={
    Alert:{Estado:false},
    loading:false,
    loadOneTime:false,
    templates:false,
    loadingSaveDesing:false,
    CatSelect:"",
    SubCatSelect:"",
    nombreSelect:"",
    editMode:false,
    urlImg:[],
    archivos:[]
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
            "x-access-token": this.props.state.userReducer.update.usuario.token
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
  uploadimages=(vals)=>{
    
    const miFormaData = new FormData()
    let DBname = this.props.state.userReducer.update.usuario.user.DBname
    const userFolder = DBname ? `${DBname}/HTMLarts` : "uploads/default";

    for(let i=0; i<this.state.archivos.length;i++){
    
      miFormaData.append("file", this.state.archivos[i])
    
    
    miFormaData.append("upload_preset","perpeis7")
    miFormaData.append("folder", userFolder); // Aquí se define la carpeta del usuario
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
        console.log(data)
         if(data.secure_url){
         
    let misURLS= this.state.urlImg
    let stateactualizado = [...misURLS, data.secure_url]
    this.setState({urlImg:stateactualizado})
   console.log(stateactualizado)
  // console.log(this.state.archivos.length)
    if(stateactualizado.length == this.state.archivos.length){

    
    this.generadorArticulo(stateactualizado)
    }
    }
      })
      .catch(error => {
     
        console.log(error)}
      );
    }
    
    
    
    }
  comprobadorGenArt=(e)=>{
    console.log("en gen Art")
 
    if(this.state.CatSelect.trim() == ""){
      let add = {
        Estado:true,
        Tipo:"error",
        Mensaje:"Seleccione una categoria"
    }
    this.setState({Alert: add, loading:false}) 
  }
  else if(this.state.nombreSelect.trim() == ""){
    let add = {
      Estado:true,
      Tipo:"error",
      Mensaje:"Seleccione un Nombre para la publicación"
  }
  this.setState({Alert: add, loading:false}) 
}
  else if(this.state.archivos.length == 0 && this.state.urlImg.length == 0){
    let add = {
      Estado:true,
      Tipo:"error",
      Mensaje:"Ingrese una imagen"
  }
  this.setState({Alert: add, loading:false}) 
  }
  
else if(this.state.archivos.length == 0 && this.state.urlImg.length > 0){

  this.generadorArticulo(this.state.urlImg)


}else if(this.state.archivos.length > 0){
  console.log("lugar esperado")
  this.uploadimages()}
    
}
onFileChange = (files) => {

  this.setState({archivos:files})
}
generadorArticulo = (imgs) => {
  if(!this.state.loading){
    this.setState({loading:true})

    this.emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html} = data;

   
    
      this.emailEditorRef.current?.editor?.saveDesign((designed, err) => {
        console.log(err)
        console.log(designed == this.props.editData.Diseno)
      let idEdit = this.state.editMode?this.props.editData._id:""

        let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname},
        HTMLdata: html,
       Categoria:this.state.CatSelect,
       SubCategoria:this.state.SubCatSelect,
        Titulo:this.state.nombreSelect,
        Diseno:designed,
        Tipo:"Publicacion",
        Tiempo:new Date().getTime(),
        _id:idEdit,
        Imagen:imgs
      }
      let routeSelect = this.state.editMode?"/public/tienda/editpublihtml":"/public/tienda/addpublihtml"
      console.log(routeSelect)
      fetch(routeSelect, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(datos), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.state.userReducer.update.usuario.token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
       console.log(response)
       if(response.message=="Error al crear articulo"){
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:"Error al crear articulo, porfavor intente en unos minutos"
      }
      this.setState({Alert: add, loading:false,}) 
      }else{
                
 

      if(this.state.editMode){
        let add = {
          Estado:true,
          Tipo:"success",
          Mensaje:"Publicacion Editada"
        }
        this.setState({Alert: add, loading:false,}) 
        this.props.dispatch(editPublicacion(response.Publicacion))
      }else{
        let add = {
          Estado:true,
          Tipo:"success",
          Mensaje:"Publicacion Creada"
        }
        
        this.setState({Alert: add, loading:false,}) 
        this.props.dispatch(addPublicacion(response.Publicacion))
      }

    
      this.Onsalida()
    }  
      
      })


      });
  

    });}
}

    componentDidMount(){

      if(this.props.editData && this.props.editData != ""){
  
       
        this.setState({nombreSelect:this.props.editData.Titulo,
                       CatSelect:this.props.editData.Categoria,
                       SubCatSelect:this.props.editData.SubCategoria,
                       editMode:true,
                       urlImg:this.props.editData.Imagen,
        
        })
        
         }
         
      
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
        console.log("ejecutando loaddata")
        if(this.state.loadOneTime == false){
        this.setState({loadOneTime:true})
            if(this.props.editData && this.props.editData != ""){
              console.log(this.props.editData.Diseno)
            this.emailEditorRef.current?.editor?.loadDesign(this.props.editData.Diseno);
      
             }}
           }
        SendDesing=  (data)=>{

this.emailEditorRef.current?.editor?.loadDesign(data);
        }
        handleChangeGeneral=(e)=>{

          this.setState({
          [e.target.name]:e.target.value
          })
          }
          handleChangeCategoria=(e)=>{

            this.setState({
              CatSelect  :e.target.value,
              SubCatSelect:""
            })
            }
            deleteImg=(img)=>{

              let newimg = this.state.urlImg.filter(x=> x !=img)
              this.setState({urlImg:newimg})
                   }
    render () {
      console.log(this.state)
      let CatRender = []
      let subCatRender=[]
      
      let viewSubCats= false
      let PubCats = this.props.state.RegContableReducer.Categorias.filter(x=> x.tipocat == "Publicacion")
      let imgpreview =""
      if(PubCats.length > 0){
        CatRender  = PubCats
      
        let getPubCat = PubCats.find(x=>{
          
          return(x.idCat == this.state.CatSelect)
          })
       
      
        if(getPubCat != undefined ){
          if(getPubCat.subCategoria.length >  0){
            viewSubCats = true
            subCatRender =getPubCat.subCategoria
          }
      
        }
      }
      if(this.state.urlImg.length > 0){
        imgpreview = this.state.urlImg.map((imagen, i)=>{
          return(
           <div className='contimg'>
             <img  src={imagen} style={{width:"80%", maxWidth:"250px", margin:"10px"}}/>
            <button className=" btn btn-danger botoneditArt" onClick={()=>{this.deleteImg(imagen)}}>
      
      x
      
      </button>
           </div>
            )
        })
      }

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
<div className='ContDual'> 
<div className='custombuttons'>

<div className='ContGruposDatos'>
  <div className='jwFlex'>
  <label >Nombre de la Publicación:</label>
  <input
 
 
     name="nombreSelect"
     type="text"
  value={this.state.nombreSelect}
    

     onChange={this.handleChangeGeneral}
 /> 
    
  </div>
<div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Categorias  </p>
            
              </div>
              <div className={`cDc2  `} >
              <select name="CatSelect"   className={`customCantidad  `}  value={this.state.CatSelect}onChange={this.handleChangeCategoria} >
              <option value=""> </option>
              {CatRender.map((cat=>{
                return(
                  <option value={cat.idCat}>{cat.nombreCat} </option>
                )
              }))}
          

</select>




            
              </div>
              </div>
              <Animate show={viewSubCats}>
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Sub-Categorias  </p>
            
              </div>
              <div className={`cDc2  `} >
              <select name="SubCatSelect"   className={`customCantidad  `}  value={this.state.SubCatSelect}onChange={this.handleChangeGeneral} >
              <option value=""> </option>
              {subCatRender.map((subcat=>{
                return(
                  <option value={subcat}>{subcat} </option>
                )
              }))}
          

</select>




            
              </div>
              </div>
              </Animate>
              </div>
              <div className='jwFlex jwWrap'>
              

<div className='jwFlex jwWrap'>
                {this.state.urlImg.length == 0 && <DropFileInput
                onFileChange={(files) => this.onFileChange(files)}
            />}

                {imgpreview}

            </div>

            </div>
              </div>
<div className='custombuttons'>
<div className="contBotonPago">
                    <Animate show={this.state.loading}>
                    <CircularProgress />
</Animate>
<Animate show={this.state.loading}>
                    <CircularProgress />
</Animate>
<Animate show={!this.state.loading}>
<Animate show={!this.state.editMode}>
                    <button   className={` btn btn-primary botonedit2 `}  onClick={this.comprobadorGenArt}>
<p>Guardar</p>
<i className="material-icons">
edit
</i>
</button>
</Animate>
<Animate show={this.state.editMode}>
                    <button onClick={this.comprobadorGenArt}  className={` btn btn-primary botonedit2 `} >
<p>Actualizar</p>
<i className="material-icons">
update
</i>
</button>
</Animate>

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
        </div>
<Animate show={this.state.templates}>

  <ModalTemplates  SendDesing={this.SendDesing} userdata={this.props.state.userReducer.update.usuario}Flecharetro={()=>{this.setState({templates:false})}}/>
</Animate>

          <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
  <style jsx >{`
        .contimg{
          border:1px solid darkblue;
          border-radius:15px;
          max-width: 250px;
          margin: 6px;
          display:flex;
          justify-content: space-between;
            align-items: center;
        }
        .botoneditArt{
          height: 15px;
           width: 15px;
           padding:1px;
           border-radius:10px;
           margin:3px;
         }
        .customLandscape{

        }
.custombuttons{
  display: flex;
  justify-content: space-around;
  width: 50%;
  align-items: center;
}
.cont50{
  width: 50%;
}
.ContGruposDatos{
  display: flex;
  justify-content: space-around;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  min-height: 165px;
}
.grupoDatos{
  margin:20px;
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
            .ContDual{
              width: 100%;
              display: flex; 
              justify-content: space-around;
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


const mapStateToProps = (state, props) =>  {
 
  return {
  
 state
  }
};

export default connect(mapStateToProps, null)(HtmlDescip);
