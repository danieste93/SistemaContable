import React, { Component } from 'react'
import Autosuggestjw from '../suggesters/jwsuggest-autorender';
import ListCompra from "./listCompra2Render";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import HelperFormapago from "../reusableComplex/helperFormapago"
import {connect} from 'react-redux';
import {Animate} from "react-animate-mount"
import ModalAddIndividual from "./modal-addArtIndividual"
import CircularProgress from '@material-ui/core/CircularProgress';
import { addRegs,addCompra,updateCuentas, updateArts } from '../../reduxstore/actions/regcont';
class Contacto extends Component {
   
state={
 
  codpunto:"001",
  codemision:"001",
  numeroFact:"0000000000",
  nombreComercial:"",
  Ruc:"",
  loading:false,
  idReg:"",
  Fpago:[], 
  ciudad:"",
  ModalAddIndividual:false,
  ArtAdd:[],
  ArtAddCalc:[],
  Errorlist:[],
  Alert:{Estado:false},
  tiempo: new Date().getTime(),
  Vendedor:{  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
    Id:this.props.state.userReducer.update.usuario.user._id,
    Tipo:this.props.state.userReducer.update.usuario.user.Tipo, 
   },
            
            

}
  
setHeperdata=(e)=>{
  
  this.setState(e)
}

componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainaddCompra').classList.add("entradaaddc")

       }, 10);
       this.getid()
    
      }
    
       

      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
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
           
              if(response.message == "error al decodificar el token"){
                this.props.dispatch(logOut());
                alert("Session expirada, vuelva a iniciar sesion para continuar");
                     
                Router.push("/ingreso")
              }else{
                this.setState({idCompra:response.cont.ContCompras,idReg:response.cont.ContRegs,EqId:response.cont.ContArticulos})
              }
        
         
          
          });
        
        }
   
      Onsalida=()=>{
        document.getElementById('mainaddCompra').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 10);
      }
      
      resetArtData=()=>{
   
                
                   }
                   addArtToBuy=(e)=>{
                    console.log(e)
                    let findArt = this.state.ArtAdd.find(x => x._id == e._id)
           
                    if(findArt == undefined){
                      let   newData ={}
                  if(e.Tipo == "Producto" && e.Medida =="Peso"){
                       newData ={Tipo:e.Tipo,
                                  Titulo:e.Titulo,
                                  _id:e._id,
                                  Eqid:e.Eqid,                       
                                  Precio_Compra:e.Precio_Compra || 0,
                                  Precio_Compra:e.Precio_Compra|| 0,
                                  PrecioCompraTotal:e.Precio_Compra|| 0,
                                  CantidadCacl:1,   
                                  CantidadCompra:1,                           
                                  Medida:e.Medida,
                                  Caduca:e.Caduca,
                                  Unidad:"Gramos"
                    }}else if(e.Tipo == "Producto" && e.Medida =="Unidad"  ){
                      newData ={Tipo:e.Tipo,
                        Titulo:e.Titulo,
                        _id:e._id,
                        Eqid:e.Eqid,                       
                        Precio_Compra:e.Precio_Compra|| 0,
                        PrecioCompraTotal:e.Precio_Compra|| 0,
                        CantidadCompra:1,
                        Categoria:e.Categoria,
                        SubCategoria:e.SubCategoria,
                        CantidadCacl:1,
                        Medida:e.Medida,
                        Caduca:e.Caduca,
                        Unidad:"",
                        Bodega_Inv:e.Bodega_Inv,
                        Tipo:e.Tipo,
                        Marca:e.Marca,
                        Calidad:e.Calidad,
                        Color:e.Color,
                        Grupo:e.Grupo,
                        Departamento:e.Departamento,
                        Garantia:e.Garantia,
                        Iva:e.Iva,
          }
                    }
                  
          
                  let newarr = [...this.state.ArtAdd, newData]
                  let newarrCalc = [...this.state.ArtAddCalc, newData]
                  this.setState({ArtAdd:newarr,ArtAddCalc:newarrCalc})} else{
                
                  
                    let add = {
                      Estado:true,
                      Tipo:"info",
                      Mensaje:"Articulo ya ingresado"
                        
                  }
                  this.setState({Alert: add, loading:false}) 
                  }
                }

                  
       
        deleteItem=(e)=>{

          let newarr = this.state.ArtAdd.filter(x=>x.Eqid != e)
          this.setState({ArtAdd:newarr, ArtAddCalc:newarr})
        }
        SetAll=(e)=>{
          let itemfind =  this.state.ArtAddCalc.filter(x=>x.Eqid === e.item.Eqid)  
          let indexset = this.state.ArtAddCalc.indexOf(itemfind[0])
       

let deepClone = JSON.parse(JSON.stringify(this.state.ArtAddCalc));

deepClone[indexset].CantidadCacl = parseFloat(e.cant)
deepClone[indexset].PrecioCompraTotal =  parseFloat(e.value)

deepClone[indexset].CantidadCompra =  parseFloat(e.cantGramos)

this.setState({ArtAddCalc:deepClone})
        }
        SetExp=(e)=>{
          let itemfind =  this.state.ArtAddCalc.filter(x=>x.Eqid === e.item.Eqid)  
          let indexset = this.state.ArtAddCalc.indexOf(itemfind[0])
          let deepClone = JSON.parse(JSON.stringify(this.state.ArtAddCalc));
          deepClone[indexset].Caduca.FechaCaducidad = e.value   
          this.setState({ArtAddCalc:deepClone})
        }
        SetPreciosTotal=(e)=>{
       
          let itemfind =  this.state.ArtAddCalc.filter(x=>x.Eqid === e.item.Eqid)  
          let indexset = this.state.ArtAddCalc.indexOf(itemfind[0])
       

let deepClone = JSON.parse(JSON.stringify(this.state.ArtAddCalc));

deepClone[indexset].PrecioCompraTotal =  parseFloat(e.value)
deepClone[indexset].Precio_Compra = parseFloat(e.precioIndi) 
deepClone[indexset].Precio_Compra = parseFloat(e.precioIndi) 

this.setState({ArtAddCalc:deepClone})
        }
        SetPrecios=(e)=>{
      
          let itemfind =  this.state.ArtAddCalc.filter(x=>x.Eqid === e.item.Eqid)  
          let indexset = this.state.ArtAddCalc.indexOf(itemfind[0])
       

let deepClone = JSON.parse(JSON.stringify(this.state.ArtAddCalc));

deepClone[indexset].Precio_Compra = e.value


deepClone[indexset].PrecioCompraTotal = parseFloat(e.PrecioTotal)
this.setState({ArtAddCalc:deepClone})
   
        }



        SetCantidad=(e)=>{
         
          let itemfind = this.state.ArtAddCalc.filter(x=>x.Eqid == e.item.Eqid)  
                 
          let indexset = this.state.ArtAddCalc.indexOf(itemfind[0])
          let deepClone = JSON.parse(JSON.stringify(this.state.ArtAddCalc));
      
      deepClone[indexset].CantidadCacl = parseInt(e.value)
      deepClone[indexset].PrecioCompraTotal = deepClone[indexset].Precio_Compra * parseFloat(e.value)
      this.setState({ArtAddCalc:deepClone})
              }
        comprobadorGenCompra=( TotalValorCompra, TotalPago)=>{
       console.log(TotalValorCompra, TotalPago)
          if(this.state.loading == false){
            this.setState({loading:true})
          let arrErrCant=[]
          let auth = false
        if(this.state.addFact){
        
          if(this.state.codpunto != "" && 
          this.state.codemision != "" &&
          this.state.numeroFact != "" &&
          this.state.UserSelect     
          
          
          ){
            auth = true
          }else{
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Revice los datos del distribuidor y/o factura "
          }
          this.setState({Alert: add, loading:false,})
          }
        }else{
          auth = true
        }
        
        if(auth){
          if(parseFloat(TotalValorCompra).toFixed(2) > parseFloat(TotalPago).toFixed(2)){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Revice el pago total "
          }
          this.setState({Alert: add, loading:false,})
          }
         else if(parseFloat(TotalValorCompra).toFixed(2) < parseFloat(TotalPago).toFixed(2)){
            let add = {
              Estado:true,
              Tipo:"warning",
              Mensaje:"El pago es mayor, al valor de compra "
          }
          this.setState({Alert: add, loading:false,})
          }
          else  if(parseFloat(TotalValorCompra).toFixed(2) == parseFloat(TotalPago).toFixed(2) && parseFloat(TotalValorCompra).toFixed(2) > 0 ){
            if(this.state.ArtAddCalc.length > 0){
              for(let i =0; i<this.state.ArtAddCalc.length;i++){
                if(this.state.ArtAddCalc[i].Caduca.Estado){
                  if(this.state.ArtAddCalc[i].Caduca.FechaCaducidad == undefined || this.state.ArtAddCalc[i].Caduca.FechaCaducidad == "" || this.state.ArtAddCalc[i].Caduca.FechaCaducidad == " " ){
                    let arrErr ={id:this.state.ArtAddCalc[i].Eqid, atri:"fechaexp"}
                    arrErrCant.push(arrErr)
                  }
                }
                if(this.state.ArtAddCalc[i].CantidadCacl == undefined || this.state.ArtAddCalc[i].CantidadCacl <= 0 ){
                  let arrErr ={id:this.state.ArtAddCalc[i].Eqid, atri:"CantidadCacl"}
                  arrErrCant.push(arrErr)
                }
                if(this.state.ArtAddCalc[i].Precio_Compra == undefined || this.state.ArtAddCalc[i].Precio_Compra <= 0){
                  let arrErr ={id:this.state.ArtAddCalc[i].Eqid, atri:"Precio_Compra"}
                  arrErrCant.push(arrErr)
                }
              }
              if(arrErrCant.length >0){
                this.setState({Errorlist:arrErrCant})
              }else{
           
                let newstate = this.state
                newstate.TotalValorCompra = parseFloat(TotalValorCompra).toFixed(2)
                newstate.TotalPago = parseFloat(TotalPago).toFixed(2)
                newstate.Usuario ={DBname:this.props.state.userReducer.update.usuario.user.DBname}
             
               var lol = JSON.stringify(newstate)
               fetch('/public/generatecompra', {
                method: 'POST', // or 'PUT'
                body: lol, // data can be `string` or {object}!
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
                this.setState({Alert: add, loading:false}) 
              }  else {
                  let add = {
                   Estado:true,
                   Tipo:"success",
                   Mensaje:"Compra Ingresada"
               }
               this.setState({Alert: add})
               setTimeout(()=>{
                this.props.dispatch(updateArts(response.Articulos));
                this.props.dispatch(addRegs(response.Regs));
                this.props.dispatch(addCompra(response.Compra));
                this.props.dispatch(updateCuentas(response.Cuentas));
                this.Onsalida()},1200) 
        
           }
              })
            
              }}
              else{
                let add = {
                  Estado:true,
                  Tipo:"Error",
                  Mensaje:"Agregue o cree un producto"
              }
              this.setState({Alert: add, loading:false})
              }
          }
          else{
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Revise el valor de Compra y el valor de Pago "
          }
          this.setState({Alert: add, loading:false})
          }
        }
        
        }else{
          console.log("cargando transaccion")
        }


      } //asd
      getDataUser=()=>{
        if(this.props.state.userReducer != ""){
            return (this.props.state.userReducer.update.usuario)
        }else {
            return {}
        }
    }
      getSugerencias=()=>{
        let data = this.props.Articulos?this.props.Articulos.filter(x=> x.Tipo != "Servicio" && x.Tipo != "Combo" ):""
    
return (data)
       }
    render () {
console.log(this.state)
      let TotalPago = 0
      if(this.state.Fpago.length > 0){


        for(let i = 0; i<this.state.Fpago.length;i++){
        
            TotalPago += parseFloat(this.state.Fpago[i].Cantidad)
        }
        
    }
      console.log(this.state)
      let TotalValorCompra = 0
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} className="uper" />;
      }
      let listaCompra =""
   
      if(this.state.ArtAdd.length > 0){
     
        listaCompra = this.state.ArtAddCalc.map((item, i)=>{
          return(<ListCompra 
            index={i} 
            key={item.id} 
            Errorlist={this.state.Errorlist} 
            datos={item} sendCantidad={(e)=>{this.SetCantidad(e)}} 
            sendPrecio={(e)=>{this.SetPrecios(e)}} 
            sendPrecioTotal={(e)=>{this.SetPreciosTotal(e)}} 
            sendAll={(e)=>{this.SetAll(e)}} 
            sendExp={(e)=>{this.SetExp(e)}} 
            deleteItem={(e)=>{this.deleteItem(e)}} />
         )
        })
      }


  
    if(this.state.ArtAddCalc.length > 0){

      for(let i = 0; i<this.state.ArtAddCalc.length;i++){
        
        if(this.state.ArtAddCalc[i].Tipo == "Producto"){
          if(this.state.ArtAddCalc[i].Medida =="Unidad"){
      let res = this.state.ArtAddCalc[i].PrecioCompraTotal
    
    
      TotalValorCompra += res
 
    }else if(this.state.ArtAddCalc[i].Medida =="Peso"){
      let res = this.state.ArtAddCalc[i].PrecioCompraTotal 
     
  
      TotalValorCompra += res
    
    }
    }else if(this.state.ArtAddCalc[i].Tipo == "Servicio"){
    
      TotalValorCompra += this.state.ArtAddCalc[i].Precio_Compra 

    }
      
   
      }
      
  }
   
        return ( 
       
         <div >

<div className="maincontacto" id="mainaddCompra" >
            <div className="contcontacto"  >
        
                 <div className="headercontact">
                 <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida  }
                />
              <div className="tituloventa">
                
            <p> Generar una compra </p>
           
        </div>
     
        </div>

        <div className="contprods">
        <Autosuggestjw  sendClick={(e)=>{this.addArtToBuy(e)}} getvalue={(item)=>{console.log("")}} 
        sugerencias={this.getSugerencias()} resetData={this.resetArtData}   /> 
     
       <button className=" btn btn-success btnaddprod " onClick={(e)=>{this.setState({ModalAddIndividual:true})}}>
<p> Producto</p>
<i className="material-icons">
add
</i>

</button>
      
        </div>


         <div className="contPrincipal">
        


       
      <div className="contAgregadorCompras">
      <div className="contTitulos2 ">
                  
                        <div className="Articid">
                          ID
                        </div>
                        <div className="Artic100Fpago">
                           Nombre
                        </div>
                        <div className="Artic100Fpago ">
                            Cantidad
                        </div>
                        <div className="Artic100Fpago ">
                            P.Individual
                        </div>
                        <div className="Artic100Fpago ">
                            P.Total
                        </div>
                        <div className="accClass ">
                            Acc
                        </div>
                      
                        </div>
                        <div className="maincontDetalles">
                        <div className="contListaCompra ">
                         { listaCompra}
                          </div>
                        </div>
                        <div className="contAddCompra">
                        <div className="grupoDatos totalcont">
                    <div className="cDc1">
              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Total: </p>
                     </div>
              <div className={`cDc2 inputDes `}>
                <p className="totalp">${parseFloat(TotalValorCompra).toFixed(2)}</p>
            
              </div>
                    </div></div>
                       
      </div>
      

      <HelperFormapago   
         valorSugerido={parseFloat(TotalValorCompra).toFixed(2)}
 onChange={this.setHeperdata}/>
              

         </div>
      
      <div className="contBotonPago">
      <Animate show={this.state.loading}>
<CircularProgress />
</Animate>
<Animate show={!this.state.loading}>
<button className={` btn btn-success botonedit2 `} onClick={()=>{this.comprobadorGenCompra( TotalValorCompra, TotalPago)}}>
<p>Comprar</p>
<i className="material-icons">
shopping_cart
</i>

</button></Animate>



            
                    </div>
        </div>
        </div>
              <Animate show={this.state.ModalAddIndividual}>
                                <ModalAddIndividual
                                
                                  User={this.getDataUser()} 
                                   Flecharetro={()=>{this.setState({ModalAddIndividual:false})}}    
                                />
        
                            </Animate >
   
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
            <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
        
        </Alert>
      </Snackbar>
     
  
           <style >{`
          
           .contPrincipal{
    
            
             overflow: scroll;
             overflow-x: hidden;
             padding: 0px 10px;
           }
          
           .contprods{
            display:flex;
                justify-content: space-evenly;
                margin-bottom:10px;
           }
         
       
      .totalcont{
        display: flex;
        background: #ffc903;
        align-items: center;
        border-radius: 12px;
        padding: 5px;
        border-bottom: 5px solid black;
        margin: 10px;
        max-width: 600px;
        width: 100%;
        height: 35px;
      }
      .cDc1 p{
        margin-bottom:0px;
      }
        
           .MuiSnackbar-anchorOriginBottomCenter{
            z-index:999999999
           }
           .FechaInput p{
            margin-bottom:2px;
            font-size:15px;
           }
           .contBotonPago{
            margin-top:20px;
            display: flex;
    justify-content: center;
        }
            .contListaCompra{
              width: 100%;
          }
          .Articid{
            width: 10%;  
            min-width:20px;
            max-width:50px;
            align-items: center;
            text-align:center;
        }
             .Artic100Fpago{
              width: 18%;  
              min-width:80px;
              max-width:100px;
              align-items: center;
              text-align:center;
          }
             .contPfinal{
              display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
             }
           .imgventa{
            margin-top: 30px;
    height: 100px;
    width: 100px;
   }
   .botonedit2{
    display:flex;

    border-radius: 20px;
    box-shadow: -4px 5px 7px black;
    justify-content: space-around;
    width: 150px

}

.botonedit2 p{
    margin:0px
}
   .accClass{
    width:10%;
    display: flex;
justify-content: center;
}

           .cDc2{
     margin-left:10px;
   }
  
   .contTitulos2{
    display:flex;
   
    font-size: 15px;
    font-weight: bolder;
    justify-content: space-around;
  
    width: 100%;
}

   .contDatosC{
     display:flex;
     width: 100%;
   }

.cDc1{
  width:30%;
  text-align: right;
  
}
.totalp{
  text-align: center;
  font-size: 20px;
  font-weight: bolder;
  margin-bottom: 0px;
}         
.contUsuario{
  width: 90%;
  transition: 1s;
  border-radius: 12px;
  padding: 10px;
}

           .headercontact {

            display:flex;
            justify-content: space-around;

           }
        

        
       
      
            .botonventa{
            
              margin-top: 17px;
    border-radius: 10px;

    background-color: #048b0b;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12);
    color: #fff;
    transition: background-color 15ms linear, box-shadow 280ms cubic-bezier(0.4,0,0.2,1);
    height: 36px;
    line-height: 2.25rem;
    font-family: Roboto,sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    -webkit-letter-spacing: 0.06em;
    -moz-letter-spacing: 0.06em;
    -ms-letter-spacing: 0.06em;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: none;
    width: 40%;
             }
       
   
        
        .maincontacto{
        z-index: 999;
         width: 98.5vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.7);
         left: -100%;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         transition:0.5s;
         overflow-y: scroll;  
         
       }
       .contcontacto{
     border-radius: 9px;
    
        background-color: whitesmoke;
        padding: 5px 10px;
        position:absolute;
        top:0px;
        overflow: hidden;
          margin-top: 10vh;
          padding-bottom:25px
       }
      
      .btnaddprod{
          display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    padding: 5px;
    border-bottom: 1px solid black;
    border-radius: 15px;
    margin-top: 11px;}
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

           .contform{
            padding-bottom: 25px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
           }

      

          .titulocontactd{
            font-size:23px;
            font-weight:bolder;
            color:black;
            height: 35%;
          }
          .entradaaddc{
            left: 0%;
           }
          
                
             @media only screen and (max-width: 320px) { 
               .subtituloArt{
                margin-top:2px;
                margin-bottom:2px;
               }
               .comunicacionart{
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
           
              .imgventa{
            margin-top: 40px;
    height: 150px;
    width: 150px;
   }
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