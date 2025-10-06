import React, { Component } from 'react'
import Autosuggestjw from '../suggesters/jwsuggest-autorender';
import ListComb from './listCombRender';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {connect} from 'react-redux';

class Contacto extends Component {
   
state={
  loading:false,
  idArt:this.props.data._id,
  ArtAdd:this.props.data.Producs,
  ArtAddCalc:this.props.data.Producs,
  Errorlist:[],
  newImg:"",
  urlImg:"",
  Alert:{Estado:false},
  tiempo: new Date().getTime(),
  Vendedor:{  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
    Id:this.props.state.userReducer.update.usuario.user._id,
    Tipo:this.props.state.userReducer.update.usuario.user.Tipo, 
   },
            
             addFormaPago:false,
              Namecombo:this.props.data.Titulo

}
    componentDidMount(){
  
      setTimeout(function(){ 
        
        document.getElementById('mainaddCompra').classList.add("entradaaddc")

       }, 10);
       this.getid()
       ValidatorForm.addValidationRule('requerido', (value) => {
        if (value === "" || value === " ") {
            return false;
        }
        return true;
    });
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
            console.log('response:', response)
              if(response.message == "error al decodificar el token"){
                this.props.dispatch(logOut());
                alert("Session expirada, vuelva a iniciar sesion para continuar");
                     
                Router.push("/ingreso")
              }
              
              
              else{
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
        console.log("en reset")
                
                   }
        addArtToBuy=(e)=>{
          let findArt = this.state.ArtAdd.find(x => x._id == e._id)
       
          if(findArt == undefined){
            let   newData ={}
        if(e.Tipo == "Producto" && e.Medida =="Peso"){
             newData ={Tipo:e.Tipo,
                        Titulo:e.Titulo,
                        _id:e._id,
                        Eqid:e.Eqid,                       
                        PrecioVenta:e.Precio_Venta,
                        PrecioVentaAlt:e.Precio_Alt,
                        Medida:e.Medida,
                        Cantidad:1,
                        Unidad:"Gramos",
                        Caduca:e.Caduca
          }}else if(e.Tipo == "Producto" && e.Medida =="Unidad" ||e.Tipo == "Servicio" ){
            newData ={Tipo:e.Tipo,
              Titulo:e.Titulo,
              _id:e._id,
              Eqid:e.Eqid,                       
              PrecioVenta:e.Precio_Venta,
              PrecioVentaAlt:e.Precio_Alt,
              Medida:e.Medida,
              Cantidad:1,
              Unidad:"",
              Caduca:e.Caduca
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
          let newarrCalc = this.state.ArtAddCalc.filter(x=>x.Eqid != e)
          this.setState({ArtAdd:newarr,ArtAddCalc:newarrCalc})
        }
 
        SetAll=(e)=>{
          let itemfind =  this.state.ArtAddCalc.filter(x=>x.Eqid === e.item.Eqid)  
          let indexset = this.state.ArtAddCalc.indexOf(itemfind[0])
       

let deepClone = JSON.parse(JSON.stringify(this.state.ArtAddCalc));
deepClone[indexset].PrecioVenta = parseFloat(e.value)
deepClone[indexset].Cantidad = parseFloat(e.cant)
deepClone[indexset].PrecioVentaAlt = parseFloat(e.cantAlt)
deepClone[indexset].Unidad = e.unidad
this.setState({ArtAddCalc:deepClone})
        }
        SetPreciosAlt=(e)=>{
       
          let itemfind =  this.state.ArtAddCalc.filter(x=>x.Eqid === e.item.Eqid)  
          let indexset = this.state.ArtAddCalc.indexOf(itemfind[0])
       

let deepClone = JSON.parse(JSON.stringify(this.state.ArtAddCalc));

deepClone[indexset].PrecioVentaAlt = parseFloat(e.value)

this.setState({ArtAddCalc:deepClone})
        }
        SetPrecios=(e)=>{
      
          let itemfind =  this.state.ArtAddCalc.filter(x=>x.Eqid === e.item.Eqid)  
          let indexset = this.state.ArtAddCalc.indexOf(itemfind[0])
       

let deepClone = JSON.parse(JSON.stringify(this.state.ArtAddCalc));

deepClone[indexset].PrecioVenta = parseFloat(e.value)

this.setState({ArtAddCalc:deepClone})
   
        }
        SetCantidad=(e)=>{
         
    let itemfind = this.state.ArtAddCalc.filter(x=>x.Eqid == e.item.Eqid)  
           
    let indexset = this.state.ArtAddCalc.indexOf(itemfind[0])
    let deepClone = JSON.parse(JSON.stringify(this.state.ArtAddCalc));

deepClone[indexset].Cantidad = parseInt(e.value)
this.setState({ArtAddCalc:deepClone})
        }
     

        comprobadorAddCombo=(TotalValorCompra, TotalValorCompraAlt)=>{
       
          if(this.state.loading == false){
            this.setState({loading:true})
          let arrErrCant=[]
       
            if(this.state.ArtAddCalc.length > 1){
              for(let i =0; i<this.state.ArtAddCalc.length;i++){
               if(this.state.ArtAddCalc[i].Tipo =="Producto"  ){
                if(this.state.ArtAddCalc[i].PrecioVenta == undefined || 
                  this.state.ArtAddCalc[i].PrecioVentaAlt == NaN || 
                  this.state.ArtAddCalc[i].PrecioVenta <= 0 ||
                   this.state.ArtAddCalc[i].PrecioVenta == ""|| 
                   this.state.ArtAddCalc[i].PrecioVenta == " " ){
                  let arrErr ={id:this.state.ArtAddCalc[i].Eqid, atri:"PrecioVenta"}
                  arrErrCant.push(arrErr)
                }
                if(this.state.ArtAddCalc[i].PrecioVentaAlt == undefined || 
                  this.state.ArtAddCalc[i].PrecioVentaAlt == NaN || 
                  this.state.ArtAddCalc[i].PrecioVentaAlt <= 0 ||
                   this.state.ArtAddCalc[i].PrecioVentaAlt == ""|| 
                   this.state.ArtAddCalc[i].PrecioVentaAlt == " " ){
                  let arrErr ={id:this.state.ArtAddCalc[i].Eqid, atri:"PrecioVentaAlt"}
                  arrErrCant.push(arrErr)
                }
                if(this.state.ArtAddCalc[i].Cantidad == undefined || 
                  this.state.ArtAddCalc[i].Cantidad == NaN || 
                  this.state.ArtAddCalc[i].Cantidad <= 0 ||
                   this.state.ArtAddCalc[i].Cantidad == ""|| 
                   this.state.ArtAddCalc[i].Cantidad == " " ){
                  let arrErr ={id:this.state.ArtAddCalc[i].Eqid, atri:"Cantidad"}
                  arrErrCant.push(arrErr)
                }

               }else if(this.state.ArtAddCalc[i].Tipo =="Servicio"){
                if(this.state.ArtAddCalc[i].PrecioVenta == undefined || 
                  this.state.ArtAddCalc[i].PrecioVentaAlt == NaN || 
                  this.state.ArtAddCalc[i].PrecioVenta <= 0 ||
                   this.state.ArtAddCalc[i].PrecioVenta == ""|| 
                   this.state.ArtAddCalc[i].PrecioVenta == " " ){
                  let arrErr ={id:this.state.ArtAddCalc[i].Eqid, atri:"PrecioVenta"}
                  arrErrCant.push(arrErr)
                }
                if(this.state.ArtAddCalc[i].PrecioVentaAlt == undefined || 
                  this.state.ArtAddCalc[i].PrecioVentaAlt == NaN || 
                  this.state.ArtAddCalc[i].PrecioVentaAlt <= 0 ||
                   this.state.ArtAddCalc[i].PrecioVentaAlt == ""|| 
                   this.state.ArtAddCalc[i].PrecioVentaAlt == " " ){
                  let arrErr ={id:this.state.ArtAddCalc[i].Eqid, atri:"PrecioVentaAlt"}
                  arrErrCant.push(arrErr)
                }
               }
              }
              if(arrErrCant.length >0){
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Revice los campos en rojo"
              }
              this.setState({Alert: add, loading:false, Errorlist:arrErrCant}) 
   
              }else{
                var url = '/public/edit-combo';
                let newstate = this.state
                newstate.TotalValorCompra = parseFloat(TotalValorCompra).toFixed(2)
                newstate.TotalValorCompraAlt = parseFloat(TotalValorCompraAlt).toFixed(2)
                newstate.Usuario ={DBname:this.props.state.userReducer.update.usuario.user.DBname}
             
               var lol = JSON.stringify(newstate)
               fetch(url, {
                method: 'POST', // or 'PUT'
                body: lol, // data can be `string` or {object}!
                headers:{
                  'Content-Type': 'application/json',
                  "x-access-token": this.props.state.userReducer.update.usuario.token
                }
              }).then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(response => {
                console.log('Response adddcombo:', response)
                if(response.message=="error al registrar"){
                  let add = {
                    Estado:true,
                    Tipo:"error",
                    Mensaje:"Error en el sistema, porfavor intente en unos minutos"
                }
                this.setState({Alert: add, loading:false}) 
              } else if(response.message=="Nombre ya existente"){
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Nombre ya existente, modifícalo"
              }
              this.setState({Alert: add, loading:false}) 
              } else {
                  let add = {
                   Estado:true,
                   Tipo:"success",
                   Mensaje:"Combo Ingresado"
               }
               this.setState({Alert: add})
               setTimeout(()=>{this.props.updateArt(), this.Onsalida()},1200) 
   
           }
              })
            
              }
            }
              else{
                let add = {
                  Estado:true,
                  Tipo:"info",
                  Mensaje:"Agregue mínimo 2 productos"
              }
              this.setState({Alert: add, loading:false})
              }
          }
       
       
      } //asd
    
     
      
      
    render () {

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
     
        listaCompra = this.state.ArtAdd.map((item, i)=>{
          return(<ListComb index={i}
             key={item.id}
              Errorlist={this.state.Errorlist}
               datos={item} sendCantidad={(e)=>{this.SetCantidad(e)}}
                sendPrecio={(e)=>{this.SetPrecios(e)}} 
                sendPrecioAlt={(e)=>{this.SetPreciosAlt(e)}} 
                sendAll={(e)=>{this.SetAll(e)}} 
                deleteItem={(e)=>{this.deleteItem(e)}} />
         )
        })
      }


   
      let TotalPago = 0
  
    let TotalValorCompra = 0
    let TotalValorCompraAlt= 0
      if(this.state.ArtAddCalc.length > 0){

        for(let i = 0; i<this.state.ArtAddCalc.length;i++){
          
          if(this.state.ArtAddCalc[i].Tipo == "Producto"){
            if(this.state.ArtAddCalc[i].Medida =="Unidad"){
        let res = this.state.ArtAddCalc[i].PrecioVenta 
        let resAlt = this.state.ArtAddCalc[i].PrecioVentaAlt
  
        TotalValorCompra += res
        TotalValorCompraAlt += resAlt
      }else if(this.state.ArtAddCalc[i].Medida =="Peso"){
        let res = this.state.ArtAddCalc[i].PrecioVenta 
        let resAlt = this.state.ArtAddCalc[i].PrecioVentaAlt
   
        TotalValorCompra += res
        TotalValorCompraAlt += resAlt
      }
      }else if(this.state.ArtAddCalc[i].Tipo == "Servicio"){
        let resAlt = this.state.ArtAddCalc[i].PrecioVentaAlt
        TotalValorCompra += this.state.ArtAddCalc[i].PrecioVenta 
        TotalValorCompraAlt += resAlt
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
                
            <p> Editar Combo </p>
           
        </div>
     
        </div>
         <div className="contPrincipal">
        

        <Autosuggestjw  sendClick={(e)=>{this.addArtToBuy(e)}} getvalue={(item)=>{console.log("")}} 
        sugerencias={this.props.Articulos.filter(x =>x.Tipo != "Combo")} 
        
        
        
        resetData={this.resetArtData}   /> 
       
      <div className="contAgregadorCompras">
      <div className="contTitulos2 ">
                  
                        <div className="Articid">
                          ID
                        </div>
                        <div className="Artic100Fpago">
                           Nombre
                        </div>
                        <div className="Artic100Fpago ">
                            C.Requerida
                        </div>
                        <div className="Artic100Fpago ">
                            P.Venta
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
                        <div className="contMainContado">
                        <div className="grupoDatos totalcont">
                    <div className="cDc1">
              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Total: </p>
                     </div>
              <div className={`cDc2 inputDes `}>
                <p className="totalp">${TotalValorCompra.toFixed(2)}</p>
            
              </div>
                    </div></div>
                    <div className="contMainContado">
                        <div className="grupoDatos totalcont totalalt">
                    <div className="cDc1">
              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Total Alt: </p>
                     </div>
              <div className={`cDc2 inputDes `}>
                <p className="totalp">${TotalValorCompraAlt.toFixed(2)}</p>
            
              </div>
                    </div></div>
                       
      </div>
      <ValidatorForm

onSubmit={()=>this.comprobadorAddCombo(TotalValorCompra, TotalValorCompraAlt )}
onError={errors => {this.errorsSub(errors)}}
><div className={`centrar `}>
<div className={`contName `}>
<TextValidator
 label="Nombre del Combo"
  onChange={this.handleChangeGeneral}
  name="Namecombo"
  type="text"
  placeholder={0}
value={this.state.Namecombo}
  validators={['requerido']}
  errorMessages={['Ingresa un Nombre'] }
 
/> 
</div>
</div>
   <div className="contBotonPago">
                 <button className={` btn btn-primary botonedit2 `} >
<p>Editar</p>
<i className="material-icons">
edit
</i>

</button>
                 </div>
                 </ValidatorForm>
      
         </div>
       
        </div>
        </div>
   
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
            <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
        
        </Alert>
      </Snackbar>
  
  
           <style jsx>{`
           .proveedorInput{
            border-radius: 20px;
            text-align: center;
           }
           .contPrincipal{
    
             height: 80vh;
             overflow: scroll;
             overflow-x: hidden;
             padding: 0px 10px;
             padding-bottom: 20px;
           }
          
          
      .totalcont{
        display: flex;
        background: #ffc903;
        align-items: center;
        border-radius: 10px;
        padding: 5px;
        border-bottom: 2px solid black;
        margin-bottom: 10px;
        max-width: 300px;
        width: 50%;

      }
      .maincontDetalles{
        margin-bottom: 30px;
      }
      .totalalt{
      background: #6ac1ff;
    }
      .cDc1 p{
        margin-bottom:0px;
      }
           .contMainContado{
            display:flex;
            width: 100%;
            justify-content: flex-end;
          }
           .MuiSnackbar-anchorOriginBottomCenter{
            z-index:999999999
           }
           .uper{
            
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
        .contName{
          padding: 14px;
          box-shadow: inset 1px -3px 8px green;
          border-radius: 10px;
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
    box-shadow: -9px 9px 10px black;
    justify-content: space-around;
    width: 30%;
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
  font-size: 28px;
  font-weight: bolder;
  margin-bottom: 0px;
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
          z-index: 9999;
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
        padding: 29px 10px;
        height: 98%;
         width: 98%;
         background-color: white;
      
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