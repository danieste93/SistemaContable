import React, { Component } from 'react'
import {Animate} from "react-animate-mount"
import {connect} from 'react-redux';
import ModalDeleteSeller from "./cuentascompo/modal-delete-seller.js"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {updateUser2} from "../reduxstore/actions/myact"
import VendedorRender from "./vendedorRender"
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
class Contacto extends Component {
   state={
    Alert:{Estado:false},
    VendedoresRestantes:0,
    addSeller:false,
    Facturar:false,
    VUsuario:"",
    Vpass:"",
    Vcorreo:"",
    editSeller:false,
    sellerToEddit:{Facturacion:false},
    sellerToDel:{},
    newpass:"",
    workerType:"vendedor"
   }

    componentDidMount(){
      ValidatorForm.addValidationRule('correoval', (value) => {

        const regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/
        var regex2 = /^([a-zA-Z0-9_\.\-])+\@([a-zA-Z\-]{3,8}\.)+[a-zA-Z]{2,4}$/;
       
          if (regex2.test(value)) {
              return true;
          }
          return false;
        });
      ValidatorForm.addValidationRule('requerido', (value) => {
        if (value === "" || value === " ") {
            return false;
        }
        return true;
    });
      setTimeout(function(){ 
        
        document.getElementById('mainVendedores').classList.add("entradaaddc")

       }, 500);
        
     this.getid()

      
      }
      handlerepChange=(e)=>{       
      
            this.setState({workerType:e.target.value})
                
     }
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }
      Onsalida=()=>{
        document.getElementById('mainVendedores').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      
      getid=()=>{
        let datos = {User: this.props.state.userReducer.update.usuario.user}
        let lol = JSON.stringify(datos)
        var url = '/cuentas/rtyhgf456/getallCounters';
        
        fetch(url, {
          method: 'POST', // or 'PUT'
          body: lol,
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          console.log('response:', response)
            if(response.message == "error al decodificar el token"){
              this.props.dispatch(logOut());
              alert("Session expirada, vuelva a iniciar sesion para continuar");
                   
              Router.push("/ingreso")
            }
            
            
            else{
            this.setState({VendedoresRestantes:response.cont.ContVendedores})
           
          
          }
      
       
        
        });
      
      }
      editSellerfunc=(data)=>{ 
        console.log(data)
        this.setState({editSeller:true, sellerToEddit:data, addSeller:false})
      }
      deleteSeller=(data)=>{   
        this.setState({
          modalDeleteSeller:true,
          sellerToDel:data,
        })
      }

      makeEditSeller=(e)=>{ 
       
        let allData = this.state
        let sendfact = ""
        let sendFirm = ""
   
        if(this.state.sellerToEddit.Facturacion)  {
          sendFirm =this.props.state.userReducer.update.usuario.user.Firmdata
          sendfact= this.props.state.userReducer.update.usuario.user.Factura   
        }
        allData.Vcorreo = this.state.Vcorreo.toLowerCase()
        allData.idUser = this.props.state.userReducer.update.usuario.user._id
        allData.User = {DBname:this.props.state.userReducer.update.usuario.user.DBname}
        allData.Firmdata = sendFirm
        allData.Factura = sendfact
        
        fetch("/public/editseller", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(allData), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => {console.error('Error:', error);})
        .then(response => {

          console.log(response)
          if(response.status =="ok" ){

            const usuario= response.user
         this.props.dispatch(updateUser2({usuario}))
            this.getid()
            let add = {
              Estado:true,
              Tipo:"info",
              Mensaje:"Trabajador Editado"
          }   
            this.setState({
              Alert: add,
              addSeller:false,
              editSeller:false,
            })

          }
        })
      }

      uploadNewseller=(e)=>{   
        let allData = this.state
        allData.idUser = this.props.state.userReducer.update.usuario.user._id
        allData.User = {DBname:this.props.state.userReducer.update.usuario.user.DBname}

        let sendfact = ""
        let sendFirm = ""
        
        if(this.state.Facturar) {
          sendFirm =this.props.state.userReducer.update.usuario.user.Firmdata
          sendfact= this.props.state.userReducer.update.usuario.user.Factura   
        }  
        allData.Vcorreo = this.state.Vcorreo.toLowerCase()
        allData.Firmdata = sendFirm
        allData.Factura = sendfact
      
        fetch("/public/uploadnewseller", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(allData), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => {console.error('Error:', error);})
        .then(response => {

          console.log(response)
          if(response.status =="ok" ){

            const usuario= response.user
         this.props.dispatch(updateUser2({usuario}))
            this.getid()
            let add = {
              Estado:true,
              Tipo:"success",
              Mensaje:"Trabajador Agregado"
          }   
            this.setState({
              Alert: add,
              addSeller:false,
            })

          }else if(response.status =="error" ){
            if(response.message =="El correo o usuario ya esta registrado"){
              let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:"El correo o usuario ya esta registrado"
            }   
              this.setState({
                Alert: add,
             
              })
            }
          }
        })
      
    
    
    
    }


      handleChangeEdit=(e)=>{
        let att = e.target.name
        let newseller = {...this.state.sellerToEddit} 
        newseller[`${att}`] = e.target.value    
        this.setState({sellerToEddit:newseller})
  
      }
      handleChangeSwitchEdit=(e)=>{ 
    
        if(this.props.state.userReducer.update.usuario.user.Factura.validateFact && this.props.state.userReducer.update.usuario.user.Firmdata.valiteFirma){
           
    
          let newseller = {...this.state.sellerToEddit}       
          newseller.Facturacion = !this.state.sellerToEddit.Facturacion 
       
          this.setState({sellerToEddit:newseller})
        }else{
        
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Debe configurar y validar su firma electrónica, en el panel de Facturación"
        }   
          this.setState({
            Alert: add          
          })
        }

        
       }
      handleChangeSwitch=(e)=>{   
     
        if(this.props.state.userReducer.update.usuario.user.Factura.validateFact && this.props.state.userReducer.update.usuario.user.Firmdata.valiteFirma){
           
    
          let switchmame = e.target.name                    
          this.setState({[switchmame]:!this.state[switchmame]})
        }else{
         
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Debe configurar y validar su firma electrónica, en el panel de Facturación"
        }   
          this.setState({
            Alert: add          
          })
        }
          
   }
    render () {
console.log(this.state)
   let  generadorVendedores =""
      if(this.props.state.userReducer.update.usuario.user.Vendedores.length > 0){
         
        generadorVendedores = this.props.state.userReducer.update.usuario.user.Vendedores.map((item, i) => ( <VendedorRender
                                                                                key={i}
                                                                                datos={item} 
                                                                                deleteitem={this.deleteSeller}
                                                                                edititem={this.editSellerfunc}
                                                                                /> 
                                                                                ));
   
}

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

<div className="maincontacto" id="mainVendedores" >
            <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Vendedores </p>
           
        </div>
     
        </div>
        <div className="contVendedoresAgregados">
        <div className="VendoresRestantes">
        <span>Vendedores Restanantes:  </span>
<span>{this.state.VendedoresRestantes}</span>
        </div>
        <div className="VendoresAgregados">
        <div className="divtest">
        <div className="contTitulosArt">
                        <div className="valCampo">
                           Nombre
                        </div>
                        <div className="valCampo">
                           Correo
                        </div>
                        <div className="valCampo">
                           Tipo
                        </div>
                        <div className="valCampo">
                        Facturar
                        </div>
                        <div className="valCampo">
                           Acc
                        </div>
                     
                    </div>
                    <div className="contVendedores">
                      {generadorVendedores}
                    </div> 
                    </div>
        </div>


        <div className="contBotonesadd">
        <button className=" btn btn-success botonAddCrom" onClick={(e)=>{ 
          e.preventDefault();
          if(this.state.VendedoresRestantes > 0){
            this.setState({addSeller:true, editSeller:false})
          }else{
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Limite vendedores"
          }   
            this.setState({
              Alert: add})
          }
          
         
          
          
          
          }}>
         
         <span className="material-icons">
       add
       </span>
       </button>
        </div>
        <div className="ContAgregarNuevoV">
<Animate show={this.state.addSeller}>
<div className='datosGenerales '>
<ValidatorForm
   
   onSubmit={this.uploadNewseller}
   onError={errors => console.log(errors)}
>
<div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
person_pin_circle
</span>
</div>
      <TextValidator
      label="Usuario"
       onChange={this.handleChangeGeneral}
       name="VUsuario"
       type="string"
       validators={ ["requerido"]}  
       errorMessages={["Campo requerido"]}
       value={this.state.VUsuario}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
mail
</span>
</div>
      <TextValidator
      label="Correo"
       onChange={this.handleChangeGeneral}
       name="Vcorreo"
       type="string"
       validators={ ["requerido","correoval"]}  
       errorMessages={["Campo requerido","Agregar un correo valido"]}
       value={this.state.Vcorreo}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
lock
</span>
</div>
      <TextValidator
      label="Contraseña"
       onChange={this.handleChangeGeneral}
       name="Vpass"
       type="password"
       validators={ ["requerido"]}  
       errorMessages={["Campo requerido"]}
       value={this.state.Vpass}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
people_outline
</span>
</div>
   
<select className="doc" value={this.state.workerType} onChange={this.handlerepChange} >
          <option value="vendedor"> Vendedor</option>
    <option value="tesorero" > Tesorero</option>
         </select>
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
storage
</span>
</div>
<FormControlLabel
        control={
          <Switch
         
          onChange={this.handleChangeSwitch}
            name="Facturar"
            color="primary"
            checked={this.state.Facturar}
          />
        }
        label="Facturar"
      />
 
   
   </div> 
   <div className='centrar botoncontxD'>
       <button className="botoncontact botoupload rojo" onClick={()=>{this.setState({addSeller:false})} }>
                     Cancelar
                    </button> 
                    <button type='submit'  className="botoncontact botoupload verde"  >
                  Agregar
                    </button>  
                    </div>
</ValidatorForm>
 </div>


</Animate>
<Animate show={this.state.editSeller}>
<div className='datosGenerales centrar'>
<ValidatorForm
   
   onSubmit={this.makeEditSeller}
   onError={errors => console.log(errors)}
>
<div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
person_pin_circle
</span>
</div>
      <TextValidator
      label="Usuario"
       onChange={this.handleChangeEdit}
       name="Usuario"
       type="string"
       validators={ ["requerido"]}  
       errorMessages={["Campo requerido"]}
       value={this.state.sellerToEddit.Usuario}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
mail
</span>
</div>
      <TextValidator
      label="Correo"
       onChange={this.handleChangeEdit}
       name="Correo"
       type="string"
       validators={ ["requerido","correoval"]}  
       errorMessages={["Campo requerido","Agregar un correo valido"]}
       value={this.state.sellerToEddit.Correo}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
lock
</span>
</div>
      <TextValidator
      label="Contraseña"
       onChange={this.handleChangeGeneral}
       name="newpass"
       type="password"
       validators={ []}  
       errorMessages={[]}
       value={this.state.newpass}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
people_outline
</span>
</div>
   
<select className="doc" name="Tipo"  value={this.state.sellerToEddit.Tipo} onChange={this.handleChangeEdit} >
          <option value="vendedor"> Vendedor</option>
    <option value="tesorero" > Tesorero</option>
         </select>
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
storage
</span>
</div>
<FormControlLabel
        control={
          <Switch
         
          onChange={this.handleChangeSwitchEdit}
            name="Facturar"
            color="primary"
            checked={this.state.sellerToEddit.Facturacion}
          />
        }
        label="Facturar"
      />
 
   
   </div> 
   <div className='centrar botoncontxD'>
       <button className="botoncontact botoupload rojo" onClick={()=>{this.setState({addSeller:false})} }>
                     Cancelar
                    </button> 
                    <button type='submit'  className="botoncontact botoupload"  >
                 Editar
                    </button>  
                    </div>
</ValidatorForm>
 </div>


</Animate>
        </div>

        </div>

     
        </div>
        </div>
        <Animate show={this.state.modalDeleteSeller}>
                    <ModalDeleteSeller
                    dataDel={this.state.sellerToDel}
                    Flecharetro={()=>{this.setState({modalDeleteSeller:false}); this.getid()}} 
                    
                    />
                    </Animate >
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
           <style >{`
            .valCampo{
              display: flex;
            width: 10%;  
            align-items: center;
            max-width:150px;
            min-width: 100px;
            justify-content: center;
       
          }
              .jwminilogoEF{
                width: 20%;
                display: flex;
            
               }
               .MuiFormControlLabel-root{
                width: 50%;
               }
               .customInputEF{
                display: flex;
                align-items: center;
                margin: 15px 0px;
                width: 80%;
                justify-content: center;
                max-width: 400px;
             
                border-radius: 19px;
                padding: 5px;
                margin: 15px;
                box-shadow: 0px -8px 12px #0000007a;
              }
             
       .VendoresAgregados{
        display: flex;
        border: 2px solid black;
        margin: 5px;
        border-radius: 11px;
        padding:3px;
        background: #95f7f7;
        overflow-x: scroll;
        flex-flow: column;
        
       }   
      
 .VendoresRestantes{
  font-size: 21px;
    padding: 3px 13px;
    border-bottom: 2px solid blue;
    width: 80%;
    max-width: 338px;
    margin-bottom: 14px;
    display: flex;
    margin-left: 14px;
    border-radius: 23px;
    justify-content: space-around;
 }
     
 .contTitulosArt{
  display:flex;
  width: 100%;
  justify-content: space-between;

  font-size: 20px;
  font-weight: bolder;
}
           .headercontact {

            display:flex;
            justify-content: space-around;

           }


       
   
        
        .maincontacto{
          z-index: 1299;
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
       
      
       }
       .verde{
        background:green;
       }
       .rojo{
        background:red;
      }
       .botoncontxD{
        justify-content: space-around;
        flex-wrap: wrap;
        margin: 20px 0px;
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
     
       .flecharetro{
         height: 40px;
         width: 40px;
         padding: 5px;
       }
          
       body {
            height:100%

           }

           .botonAddCrom {
            display:flex;
        }

      form{
        display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    justify-content: space-around;
      }

       
          .entradaaddc{
            left: 0%;
           }
           .datosGenerales{
            height: 50vh;
            overflow-y: scroll;
            padding:10px;
           }
             @media only screen and (max-width: 320px) { 
               .subtituloArt{
                margin-top:2px;
                margin-bottom:2px;
               }
              
               .marginador{
                margin: 0px 2px 15px 2px;
               }
         .contcontacto{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontacto{
       
         width: 70%;
      
      
       }
          }
          @media only screen and (min-width: 950px) { 
           
      
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

export default connect(mapStateToProps, null)(Contacto);