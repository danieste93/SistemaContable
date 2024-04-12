import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Animate } from "react-animate-mount";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Autosuggest from '../../components/suggesters/jwsuggest-general-venta';

class purdata extends Component {
state={
    userDisplay:true,
    adduser:false,
  id:"",
                    usuario:this.props.data.compra.nombreCliente,
                    readOnly:false,
                    correo:this.props.data.compra.correoCliente,
                    telefono:this.props.data.compra.telefonoCliente,
                    ciudad:this.props.data.compra.ciudadCliente,
                    direccion:this.props.data.compra.direccionCliente,
                    cedula:this.props.data.compra.cedulaCliente,
                    idcuenta:"",
                     ClientID:"Cedula",
}

    componentDidMount(){
        console.log(this.props)
        ValidatorForm.addValidationRule('requerido', (value) => {
            if (value === "") {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('correoval', (value) => {
           
          const regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/
          var regex2 = /^([a-zA-Z0-9_\.\-])+\@([a-zA-Z\-]{3,20}\.)+[a-zA-Z]{2,4}$/;
         
            if (regex2.test(value)) {
                return true;
            }
            return false;
          });
    }
    resetUserData=(e)=>{
    
        this.setState({
            userDisplay:false,
            readOnly:true,
            userEditMode:false,
            UserSelect:false,
            id:"",
            usuario:"",
            correo:"",
            telefono:"",
            ciudad:"",
            direccion:"",
            cedula:"",
            tipopago:"Contado",
            creditLimit:0,
           
        })
    }
    handleChangeform=(e)=>{
        this.setState({
            [e.target.name] : e.target.value
        })
         }
         handleClientID=(e)=>{
       
            this.setState({ClientID:e.target.value})
            
        }

    render() {
        let activeadd= this.state.adduser? "articeadd":""
       
        let editadd= this.state.userEditMode? "editadd":""

        let SuggesterReady =    <CircularProgress  />   
        if(this.props.state.RegContableReducer.Clients){
  
            SuggesterReady =  <Autosuggest placeholder="Busca Clientes" sendClick={this.setUserData}   sugerencias={this.props.state.RegContableReducer.Clients} resetData={this.resetUserData}  />  
        }

        const handleClose = (event, reason) => {
            let AleEstado = this.state.Alert
            AleEstado.Estado = false
            this.setState({Alert:AleEstado})
           
        }
        const Alert=(props)=> {
            return <MuiAlert elevation={6} variant="filled" {...props} className="uper" />;
          }

          let CheckReadOnly = this.state.readOnly?true:false

          return(
            <div className='contPanelCuentas'>
 <div className=" userwrap">
                     
                        <div className="contSuggester">
                        <div className="jwseccionCard buttoncont">

   <Animate show={this.state.UserSelect}>                       
<div className="contButtonsUserSelect">
 <button type="button" className=" btn btn-primary botonedit" onClick={()=>{this.setState({readOnly:false, userEditMode:true})}}>
<p>Editar</p>

<span className="material-icons">
create
</span>

</button>
<button type="" className=" btn btn-danger botonedit" onClick={this.deleteUser}>
<p>Eliminar</p>

<span className="material-icons">
delete
</span>

</button>
</div>
</Animate> 


</div>
                       

                        </div>
                        
                     
                        <div className={  `contUsuario ${activeadd} ${editadd} `}>
                        <Animate show={this.state.userDisplay}>
                        <ValidatorForm
   
   onSubmit={this.regisUser}
   onError={errors => console.log(errors)}
>
<div className="contenidoForm">
    <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
account_circle
</span>
</div>
      <TextValidator
      label="Nombre"
       onChange={this.handleChangeform}
       name="usuario"
       type="text"         
       validators={['requerido']}
       errorMessages={['Ingresa un nombre'] }
       value={this.state.usuario}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
mail
</span>
</div>
      <TextValidator
      label="Correo"
       onChange={this.handleChangeform}
       name="correo"
       type="mail"
   
       validators={['requerido']}
       errorMessages={['Escribe un correo'] }
      
       value={this.state.correo}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>

   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    house
</span>
</div>
      <TextValidator
      label="Dirección"
       onChange={this.handleChangeform}
       name="direccion"
       type="text"
       validators={['requerido']}
       errorMessages={['Ingresa un nombre'] }
       value={this.state.direccion}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    perm_identity
</span>
</div>
<select className="ClieniDInput" value={this.state.ClientID} onChange={this.handleClientID} disabled= {CheckReadOnly} >
          <option value="Cedula"> Cédula</option>
    <option value="RUC" > RUC </option>
    <option value="Pasaporte" > Pasaporte </option>
         </select>
   
   </div>
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    perm_identity
</span>
</div>
      <TextValidator
      label="Número Identificación"
       onChange={this.handleChangeform}
       name="cedula"
       type="text"
       validators={['requerido']}
       errorMessages={['Ingresa '] }
       value={this.state.cedula}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
phone
</span>
</div>
      <TextValidator
      label="Teléfono"
       onChange={this.handleChangeform}
       name="telefono"
       type="number"
       validators={[]}
       errorMessages={[]}
       value={this.state.telefono}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>
 
  
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    location_city
</span>
</div>
      <TextValidator
      label="Ciudad"
       onChange={this.handleChangeform}
       name="ciudad"
       type="text"
       validators={[]}
       errorMessages={[] }
       value={this.state.ciudad}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>

   </div>
   <div className="contb">
      <Animate show={this.state.adduser}>
      <div className="contbregis">

      <button className=" btn btn-success botonflex" type='submit'>
<p>Registrar</p>
<span className="material-icons">
done
</span>

</button>

<button className=" btn btn-danger botonflex" onClick={()=>{
    this.resetUserData();
    this.setState({adduser:false, readOnly:true,userDisplay:false})}}>
<p>Cancelar</p>
<span className="material-icons">
cancel
</span>

</button>
</div>
      </Animate>

      <Animate show={this.state.userEditMode}>
      <div className="contbregis">

      <button type='button' className=" btn btn-primary botonflex" onClick={this.editUser}>
<p>Guardar</p>
<span className="material-icons">
done
</span>

</button>

<button className=" btn btn-danger botonflex" onClick={()=>{
    this.resetUserData();
    this.setState({userEditMode:false, readOnly:true})}}>
<p>Cancelar</p>
<span className="material-icons">
cancel
</span>

</button>
</div>
      </Animate>

      
      
      
                        </div>
</ValidatorForm>
</Animate>
                        </div>
                     
                    </div>
     <style jsx>    {`
     .contenidoForm {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .editadd{
        background: #bbd8f7;
        border-bottom: 5px solid black;
    }
    .customInput {
        display: flex;
        align-items: center;
        margin: 5px 10px;
        justify-content: center;
        width: 250px;
    }
     `}

     </style>
            </div>

          )

    }


}



const mapStateToProps = state => {


    return {state}
  };
  
  
  export default connect(mapStateToProps)(purdata)