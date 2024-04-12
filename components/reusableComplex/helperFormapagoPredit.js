import React, { Component } from 'react'
import {connect} from 'react-redux';
import Switch from '@material-ui/core/Switch';
import ModalEditFormapago from "./modal-editFormaPago"
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autosuggest from '../suggesters/jwsuggest-general';
import FormasdePagoList from "./formasPagoRender"
import { Animate } from 'react-animate-mount/lib/Animate';
import ModalFormapago from "./modal-addFormaPagolim"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ThreeSixtyTwoTone } from '@material-ui/icons';
import {addDistri, updateDistri} from "../../reduxstore/actions/regcont"

class HelperFormapago extends Component {
    state={
        codpunto:this.props.preData.infoTributaria[0].estab[0],
        codemision:this.props.preData.infoTributaria[0].ptoEmi[0],
        numeroFact:this.props.preData.infoTributaria[0].secuencial[0],
        distriDisplay:true,
        loading:false,
        Fpago:[],
        Ruc:"",
        usuario:"",
        direccion:"" ,
        correoDistri:"",
        proveedor:"",
        idCompra:"",

        addFact:true,
        UserSelect:true,

        Alert:{Estado:false},
        addFormaPago:false,
        adduser:false,
     
        userEditMode:false,
        readOnly:true,
        Vendedor:{  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
            Id:this.props.state.userReducer.update.usuario.user._id,
            Tipo:this.props.state.userReducer.update.usuario.user.Tipo, 
           },
    }

        componentDidMount(){
         
            ValidatorForm.addValidationRule('requerido', (value) => {
                if (value === "") {
                    return false;
                }
                return true;
            });
            ValidatorForm.addValidationRule('correoval', (value) => {
               
              const regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/
              var regex2 = /^([a-zA-Z0-9_\.\-])+\@([a-zA-Z\-]{3,8}\.)+[a-zA-Z]{2,4}$/;
             
                if (regex2.test(value)) {
                    return true;
                }
                return false;
              });


              if(this.props.state.RegContableReducer.Distribuidores){
                let distrifind = this.props.state.RegContableReducer.Distribuidores.filter(
                  x=>x.Usuario == this.props.preData.infoTributaria[0].nombreComercial[0]
                  )

                  if(distrifind.length > 0){
                    console.log(distrifind)
                  }else{
                    this.setState({
                 Ruc:this.props.preData.infoTributaria[0].ruc[0],
        usuario:this.props.preData.infoTributaria[0].nombreComercial[0],
        direccion:this.props.preData.infoTributaria[0].dirMatriz[0] ,
                    })
                    setTimeout(()=>{this.props.setuserData(this.state)})

                  }
              }else{
                this.setState({
             Ruc:this.props.preData.infoTributaria[0].ruc[0],
    usuario:this.props.preData.infoTributaria[0].nombreComercial[0],
    direccion:this.props.preData.infoTributaria[0].dirMatriz[0] ,
                })
                setTimeout(()=>{this.props.setuserData(this.state)})
              }

        }

  addNewUser=()=>{
        this.setState({readOnly:false, adduser:true, distriDisplay:true})
    }

    editDistri=()=>{
 
        
      var url = '/users/edit-distri';
    
                
     var lol = this.state
   
   lol.Userdata = {DBname:this.props.state.userReducer.update.usuario.user.DBname} 

      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(lol), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.state.userReducer.update.usuario.token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
       console.log('Success Register User:', response)
       if(response.message=="error al registrar"){
           let add = {
             Estado:true,
             Tipo:"error",
             Mensaje:"Error en el sistema, porfavor intente en unos minutos"
         }
         this.setState({Alert: add, loading:false,}) 
         }
   
         else if(response.message=="El correo ya esta registrado"){
           let add = {
               Estado:true,
               Tipo:"error",
               Mensaje:"El correo ya esta registrado"
           }
           this.setState({Alert: add, loading:false,}) 
         }
         else{    
   
          this.setState({ UserSelect:true, 
            readOnly:true,
            userEditMode:false,
            })
            this.props.onChange({ UserSelect:true, 
                readOnly:true,
                userEditMode:false,
                })

            
   
               }     
      })
   
       }

    
    regisDistri=()=>{
 
      
            if( this.state.Ruc != "" && 
            this.state.usuario != ""    ){ 
                
                var url = '/users/register-distri';
    
                
     var lol = this.state
   
   lol.Userdata = {DBname:this.props.state.userReducer.update.usuario.user.DBname} 

      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(lol), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.state.userReducer.update.usuario.token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
       console.log('Success Register User:', response)
       if(response.message=="error al registrar"){
           let add = {
             Estado:true,
             Tipo:"error",
             Mensaje:"Error en el sistema, porfavor intente en unos minutos"
         }
         this.setState({Alert: add, loading:false,}) 
         }
   
         else if(response.message=="El correo ya esta registrado"){
           let add = {
               Estado:true,
               Tipo:"error",
               Mensaje:"El correo ya esta registrado"
           }
           this.setState({Alert: add, loading:false,}) 
         }
         else{
    
   
       this.setState({ UserSelect:true, 
                       readOnly:true,
                       adduser:false,
                       id:response.nuevoDistribuidor[0]._id,
                       loading:false
                   })
                   this.props.onChange({ UserSelect:true, 
                    readOnly:true,
                    adduser:false,
                    id:response.nuevoDistribuidor[0]._id,
                    loading:false
                })

                this.props.dispatch(addDistri(response.nuevoDistribuidor[0]));
   
               }     
      })}else{
        let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Ingrese los datos requeridos"
        }
        this.setState({Alert: add, loading:false,}) 
      }
   
       }

       handleChangeGeneralSend=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
            })
            this.props.onChange({
                [e.target.name]:e.target.value
                })
       }
       handleChangeGeneral=(e)=>{

        this.setState({
            [e.target.name]:e.target.value
            })
        }

        createFormaPago=(e)=>{

            let ramdon = Math.floor(Math.random() * 1000);
    
            let newid = "FP-" +ramdon 
    
            let DatatoAdd=  {Tipo:e.formaPagoAdd, Cantidad:e.Cantidad, Cuenta:e.CuentaSelect, Id:newid,Detalles:e.Detalles}
            let newstate = [...this.state.Fpago, DatatoAdd]
    
            this.setState({Fpago:newstate})
            this.props.onChange({Fpago:newstate})
        }
        editFormaPagoState=(e)=>{
           
          let testFind =  this.state.Fpago.find(x => x.Id == e.Id) 
    
    
          let newIndex = this.state.Fpago.indexOf(testFind) 
    
          let newArr = this.state.Fpago
          let dataGenerate ={
              Cantidad:e.Cantidad,
              Cuenta:e.CuentaSelect,
              Detalles:e.Detalles,
              Id:e.Id,
              Tipo:e.formaPagoAdd
          }
          newArr[newIndex] = dataGenerate
          this.setState({Fpago:newArr}) 
          this.props.onChange({Fpago:newArr})
    
         }
         setPreciosPago=(e)=>{
          
          let testFind =  this.state.Fpago.find(x => x.Id == e.Id)  
      
          let newIndex = this.state.Fpago.indexOf(testFind)
          let newArr = this.state.Fpago
          newArr[newIndex].Cantidad = e.Cantidad
          this.setState({Fpago:newArr}) 
          this.props.onChange({Fpago:newArr}) 
         }
         
         editFormaPago=(e)=>{
             this.setState({editFormaPago:true, SelectFormaPago:e})
         }
         setUserData=(e)=>{
      

            let setData = {
                distriDisplay:true,
                id:e._id,
                adduser:false,
                UserSelect:true,
                usuario:e.Usuario,
                correoDistri:e.Email,
                telefono:e.Telefono,
                ciudad:e.Ciudad,
                direccion:e.Direccion,
                Ruc:e.Ruc,
                idcuenta:e.IDcuenta,
              
            }

          this.setState(setData)

          this.props.onChange(setData)
      }
      resetUserData=(e)=>{
     let data = {
        distriDisplay:false,
        readOnly:true,
        userEditMode:false,
        UserSelect:false,
        id:"",
        usuario:"",
        correoDistri:"",
        telefono:"",
        ciudad:"",
        direccion:"",
        Ruc:"",
       
    }
        
          this.setState(data)

          this.props.onChange(data)
          
      }
      handleChangeFact=(e)=>{  
        this.setState({addFact:!this.state.addFact})
        this.props.onChange({addFact:!this.state.addFact})
      }  
render(){
    let TotalPago = 0
    if(this.state.Fpago.length > 0){
        

        for(let i = 0; i<this.state.Fpago.length;i++){
        
            TotalPago = TotalPago + parseFloat(this.state.Fpago[i].Cantidad)
        }
        
    }
    let CheckReadOnly = this.state.readOnly?true:false
    let activeadd= this.state.adduser? "articeadd":""
     
    let editadd= this.state.userEditMode? "editadd":""
    console.log(this.state) 
    
    const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} className="uper" />;
      }


      let generadorFormasdepago= this.state.Fpago.map((item, i)=>(<FormasdePagoList
        key={item.Id}
        datos={item}  
        index={i}
        sendPrecio={(e)=>{this.setPreciosPago(e)}}
        editFormPago={(e)=>{this.editFormaPago(e)}}
        deleteForma={(e)=>{
       
          let nuevoarr = this.state.Fpago.filter(x => x.Id != e.Id)
          this.setState({Fpago:nuevoarr, })

      }}
      />))
  
  

    return ( 
        <div  className="contTotal">

<div className="contAddCompra">
      <div className="contContado">
                    <div className="contContadoButtons">
                    <div className="contBotones">
                    <button className=" btn btn-success botonAddCrom" onClick={(e)=>{e.preventDefault();this.setState({addFormaPago:true})}}>
         
         <span className="material-icons">
       add
       </span>
       </button>
                    </div>
<div className="contFact">
                    <FormControlLabel
        control={
          <Switch
            checked={this.state.addFact}
         
            name="addFact"
            color="primary"
          />
        }
        label="Factura"
      />
</div>
                    </div>
                      <div className="contContadoLista">
                          <div className="contTitulos2 ">
                      <div className="Numeral ">
                #
                        </div> 
                        <div className="Artic100Fpago ">
                            Forma de Pago
                        </div>
                        <div className="Artic100Fpago ">
                            Cuenta
                        </div>
                        <div className="Artic100Fpago ">
                            Cantidad
                        </div>
                        <div className="accClass ">
                            Acc
                        </div>
                        </div>
                        <div className="ContListaPagos">
                        {generadorFormasdepago} 
                        </div>
                          </div>   
                          <div className="grupoDatos totalcontPagos">
                    <div className="cDc1">
              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Total Pago: </p>
            
              </div>
              <div className={`cDc2 inputDes `}>
                <p className="totalp">${TotalPago.toFixed(2)}</p>
            
              </div>
                    </div> 
                          </div>
                          <div className="contAnimacion"> 
                          <Animate show={!this.state.addFact}>
                             <div className="ContProveedor">
                             <div className="jwminilogo">
    <span className="material-icons">
    local_convenience_store
</span>
</div>
         <div className="customInput">
     
      <input
      placeholder='Distribuidor'
       onChange={this.handleChangeGeneral}
       name="proveedor"
       type="text"
     className="proveedorInput"
       value={this.state.proveedor}
     
   />
   
   
   </div>
         </div>
         </Animate>
         <Animate show={this.state.addFact}>
         <div className="contaddFact">
         <div className="contSuggester">
                        <div className="jwseccionCard buttoncont">

  

<Animate show={!this.state.UserSelect}>  
 <button className=" btn btn-success botoneditadd" onClick={(e)=>{e.preventDefault();this.addNewUser()}}>
<p>Agregar</p>
<span className="material-icons">
add
</span>

</button>
</Animate> 

</div>
                       
 
                       
                        </div>
                        <div className={  `contUsuario ${activeadd} ${editadd} `}>
                        <Animate show={this.state.distriDisplay}>
                        <ValidatorForm
   
   onSubmit={()=>{console.log("submit")}}
   onError={errors => console.log(errors)}
>
<div className="contenidoFormAddC">
<div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    perm_identity
</span>
</div>
      <TextValidator
      label="RUC"
      
       name="Ruc"
       type="number"
       validators={[]}
       errorMessages={[] }
       value={this.state.Ruc}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>
    <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
account_circle
</span>
</div>
      <TextValidator
      label="Nombre"
       onChange={this.handleChangeGeneral}
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
    house
</span>
</div>
      <TextValidator
      label="Direccion"
       onChange={this.handleChangeGeneral}
       name="direccion"
       type="text"
       validators={[]}
       errorMessages={[] }
       value={this.state.direccion}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>
   
 
  

   </div>
   <div className="contb">
      <Animate show={this.state.adduser}>
      <div className="contbregis">

      <button className=" btn btn-success botonflex" onClick={(e)=>{
        e.preventDefault();
        this.regisDistri()
      }}>
<p>Registrar</p>
<span className="material-icons">
done
</span>

</button>

<button className=" btn btn-danger botonflex" onClick={()=>{
    this.resetUserData();
    this.setState({adduser:false, readOnly:true,distriDisplay:false})}}>
<p>Cancelar</p>
<span className="material-icons">
cancel
</span>

</button>
</div>
      </Animate>

      <Animate show={this.state.userEditMode}>
      <div className="contbregis">

      <button type='button' className=" btn btn-primary botonflex" onClick={(e)=>{
        e.preventDefault();
        this.editDistri()
      }}>
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
      <div className="contFacturaNumero">
        <p className='subtituloArt'>Número de Factura</p>
      <div className="customInput2">
      <input
      placeholder=''
       onChange={this.handleChangeGeneralSend}
       name="codpunto"
       type="text"
       maxLength={3}
     className="miniinput"
       value={this.state.codpunto}
     
   />
    
   -
   <input
      placeholder=''
       onChange={this.handleChangeGeneralSend}
       name="codemision"
       type="text"
       maxLength={3}
     className="miniinput"
       value={this.state.codemision}
     
   /> 
   -
     <input
      placeholder=''  
       name="numeroFact"
       type="text"
       maxLength={9}
     className="proveedorInput"
       value={this.state.numeroFact}
     
   />
   
   </div>
      </div>

                        </div>
         </Animate>
         </div>
                          </div>

<Animate show={this.state.addFormaPago}>
                    <ModalFormapago sendFormaPago={this.createFormaPago} 
                    tipoDeForma="Contado"
                    Flecharetro={()=>{this.setState({addFormaPago:false})}} />
                    </Animate >
                    
                    <Animate show={this.state.editFormaPago}>
                    <ModalEditFormapago 
                    data={this.state.SelectFormaPago} 
                    sendEditFormaPago={(e)=>{this.editFormaPagoState(e)}} 
                    tipoDeForma="Contado"
                    Flecharetro={()=>{this.setState({editFormaPago:false})}} />
                    
                    </Animate >
                    <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
            <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
        
        </Alert>
      </Snackbar>
      <style>{
    `
    .accClass{
        width:10%;
        display: flex;
    justify-content: center;
    }
    .contTitulos2{
        display:flex;
       
        font-size: 15px;
        font-weight: bolder;
        justify-content: space-around;
      
        width: 100%;
    }
    .proveedorInput{
        border-radius: 20px;
        text-align: center;
       }
    .miniinput{
        text-align: center;
          width: 56px;
          padding: 3px;
          margin: 5px;
          border-radius: 26px;
      }
    .contFact{
        margin-left: 31px;
       }
      .contFacturaNumero{
        margin-top: 12px;
        border: 5px double grey;
    padding: 8px;
    border-radius: 48px;
      }
    .contaddFact{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
      }
    .contSuggester {
        display: flex;
        align-items: center;
        flex-flow: row;
       
            }
            .botoneditadd{
                display: flex;
                justify-content: space-between;
                width: 100px;
                padding: 4px;
            }
            
            .botonAddCrom {
                display:flex;
            }
            p{
                margin-bottom:0px;
            }
            .customInput {
              display: flex;
              align-items: center;
              margin: 15px 0px;
              justify-content: center;
              max-width: 183px;
          }
          .customInput2 {
            display: flex;
            align-items: center;
            margin: 15px 0px;
            justify-content: center;
          
        }
        .articeadd{
            background: #d2ffd2;
            border-bottom: 5px solid black;
          }
          .editadd{
            background: #bbd8f7;
            border-bottom: 5px solid black;
          }
          .contbregis{
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        }
          .ContProveedor{
            display: flex;
            justify-content: space-around;
          }
          .contAddCompra{
            display:flex;
            width: 100%;
            justify-content: space-around;
            flex-wrap: wrap;
            align-items: center;
          }
          .contTotal{
            width: 100%;
            max-width: 900px;
          }
          .contContadoButtons{
            display: flex;
           }
           .contContado{
            padding: 5px 10px;
            margin-top: 20px;
            border: 2px solid black;
            border-radius: 10px;
            background: aliceblue;
            max-width: 380px;

           }
           .Artic100Fpago {
            width: 18%;
            min-width: 80px;
            max-width: 100px;
            align-items: center;
            text-align: center;
        }
           .contAnimacion{
         
            padding: 5px 10px;
            margin-top: 20px;
         
            border-radius: 10px;
          
            max-width: 500px;
            width: 100%;
        
         }
         .contenidoFormAddC {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
          }
         .totalcontPagos{
            background: #aecef4;
            align-items: center;
            border-radius: 12px;
            padding: 5px;
            width: 94%;
            display: flex;
            border-bottom: 2px solid black;
            margin-top: 20px;
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
  
  export default connect(mapStateToProps, null)(HelperFormapago);