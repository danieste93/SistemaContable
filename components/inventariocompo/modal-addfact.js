import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Autosuggestjw from '../suggesters/jwsuggest-autorender';
import DropFileInput from "../drop-file-input/DropFileInputp12"
import Xml2js from 'xml2js';
import ListCompraFact from "./listCompra2RenderFact";
import Animate from 'react-animate-mount/lib/Animate';
import {connect} from 'react-redux';
import HelperFormapagoPredit from '../reusableComplex/helperFormapagoPredit';
import Prevent from "../cuentascompo/modal-prevent" 
import CircularProgress from '@material-ui/core/CircularProgress';
class Contacto extends Component {
   state={
    Alert:{Estado:false},
    xmlData:{fechaAutorizacion:[""]},
    Errorlist:[],
    Fpago:[],
    Comprobante:"",
    loading:false,
    Vendedor:{  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
      Id:this.props.state.userReducer.update.usuario.user._id,
      Tipo:this.props.state.userReducer.update.usuario.user.Tipo, 
     },
     prevent1:false,
     validfact:false,
     waitingdata:false
   }
   componentRef = React.createRef(); 
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainAddFact').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
      comprobadorGenCompra=( TotalValorCompra, TotalPago)=>{
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
         
        
              var url = '/public/generate-factcompra';
              let newstate = this.state
              newstate.TotalValorCompra = parseFloat(TotalValorCompra).toFixed(2)
              newstate.TotalPago = parseFloat(TotalPago).toFixed(2)
              newstate.Userdata ={DBname:this.props.state.userReducer.update.usuario.user.DBname}
           
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
              console.log('Response addfact:', response)
              if(response.message=="error al registrar"){
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Error en el sistema, porfavor intente en unos minutos"
              }
              this.setState({Alert: add, loading:false}) 
            } else if(response.message=="Factura ya ingresada"){
              let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:"Factura ya ingresada"
            }
            this.setState({Alert: add, loading:false}) 
          }
          else if(response.message=="Diid Repetido"){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje: `Codigo del Distribuidor Repetido. Item encontrado:${response.art.Eqid}  `
          }
          this.setState({Alert: add, loading:false}) 
        }
            
            else {
                let add = {
                 Estado:true,
                 Tipo:"success",
                 Mensaje:"Factura Ingresada"
             }
             this.setState({Alert: add})
             setTimeout(()=>{this.props.updateArt(), this.Onsalida()},1200) 
      
         }
            })
           
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
       
      }
      }
      Onsalida=()=>{
        document.getElementById('mainAddFact').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      
      handleXml=(e)=>{
        
        let reader = new FileReader();
        reader.onload = function(e) {
          readXml=e.target.result;
        
          var parser = new DOMParser();
          var doc = parser.parseFromString(readXml, "application/xml");
         
      }
      }
      valFact=(e)=>{
       
             
        this.setState({waitingdata:true})
        fetch("/public/validate-compra-fact", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(this.state.Comprobante), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          console.log(response)
          if(response.status=="error"){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Error en validar la factura"
          }
          this.setState({Alert: add, waitingdata:false,validfact:false}) 
          }
          else if(response.status=="ok"){
            let add = {
              Estado:true,
              Tipo:"success",
              Mensaje:"Factura validada"
          }
          this.setState({validfact: true,  Alert: add,}) 
          }
        })

      }
      
      setChangeinput=(e)=>{
        this.setState({xmlData:{fechaAutorizacion:[""]},  Comprobante:"",})
        let selectedFile = this.componentRef.current.files[0];
        console.log(selectedFile)
        if(selectedFile.type=="text/xml") 
      {
        let readXml=null;

        let reader = new FileReader();
        reader.onload =  (e) => {
            readXml=e.target.result;
                  
            let parserX = new Xml2js.Parser();
        

            parserX.parseString(
              readXml,
              (err, result) =>{
                 
                 let getData = ""
                if(result["soap:Envelope"]){
                
                  getData = result["soap:Envelope"]["soap:Body"][0]["ns2:autorizacionComprobanteResponse"][0].RespuestaAutorizacionComprobante[0].autorizaciones[0].autorizacion[0]
                 
                  parserX.parseString(getData.comprobante[0],(err,xml)=>{
                    console.log(xml)
                    if(xml.factura.infoFactura[0].identificacionComprador[0] != this.props.state.userReducer.update.usuario.user.Factura.ruc ){
                      this.setState({prevent1:true, preventData1:xml, preventxmlData:getData})
                    }else{
                    this.setState({xmlData:getData,Comprobante:xml})
                  }
                   
                  })
                }else if(result["autorizacion"]){
                  
                  getData = result["autorizacion"]
                  parserX.parseString(getData.comprobante[0],(err,xml)=>{
                    console.log(xml)

                    if(xml.factura.infoFactura[0].identificacionComprador[0] != this.props.state.userReducer.update.usuario.user.Factura.ruc ){
                      this.setState({prevent1:true, preventData1:xml, preventxmlData:getData})
                    }else{
                    this.setState({xmlData:getData,Comprobante:xml})
                  }
                  })
                }else{
                  let add = {
                    Estado:true,
                    Tipo:"error",
                    Mensaje:"Archivo .XML incompatible, enviar el archivo al soporte tecnico para agregar compatibilidad"
                }
                this.setState({Alert: add}) 
                }


              })
            
        }
        reader.readAsText(selectedFile);
      }else{
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Solo son validos los archivos .xml"
        }
        this.setState({Alert: add}) 
        }
      }

      sendErrace=(data)=>{
        let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] === data.item.codigoPrincipal[0])  
        let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
        let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
     
        deepClone.factura.detalles[0].detalle[indexset].itemSelected = null 
        this.setState({Comprobante:deepClone})
      }

    sendSwich=(data)=>{
     

      let valinsumo = data.insumo? true:null
      let valiva = data.iva? true:null

      let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] === data.item.codigoPrincipal[0])  
      let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
      let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
   
      deepClone.factura.detalles[0].detalle[indexset].insumo = valinsumo 
      deepClone.factura.detalles[0].detalle[indexset].iva = valiva 
      this.setState({Comprobante:deepClone})
    
    }

    sendItem=(data)=>{
     
    
      setTimeout(()=>{
        let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] == data.item.codigoPrincipal[0])  
        let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
        let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
        deepClone.factura.detalles[0].detalle[indexset].itemSelected = data.itemselect
      
          this.setState({Comprobante:deepClone})
      },300)
 

    }

    setName=(data)=>{

      console.log(data)
      let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] == data.item.codigoPrincipal[0])  
      let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
      let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
  
      deepClone.factura.detalles[0].detalle[indexset].descripcion = data.tituloArts
      this.setState({Comprobante:deepClone})
    }

    SetExp=(data)=>{
     
      let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] == data.item.codigoPrincipal[0])  
      let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
      let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
      deepClone.factura.detalles[0].detalle[indexset].Caduca = {}
      deepClone.factura.detalles[0].detalle[indexset].Caduca.Estado = true  
      deepClone.factura.detalles[0].detalle[indexset].Caduca.FechaCaducidad = data.value 
        this.setState({Comprobante:deepClone})
      
    }
    setHeperdata=(e)=>{
     
      this.setState(e)
    }

    render () {
    console.log(this.state)
      let now = new Date(this.state.xmlData.fechaAutorizacion[0])
      let año = now.getFullYear()
      let dia = now.getDate()
      let mes = now.getMonth()
      
      let fecha =  `${dia} / ${mes} / ${año} ` 
      
      let TotalPago = 0
      if(this.state.Fpago.length > 0){


        for(let i = 0; i<this.state.Fpago.length;i++){
        
            TotalPago = TotalPago + this.state.Fpago[i].Cantidad
        }
        
    }
      
let TotalValorCompra = 0
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
      }
      const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
      let listaCompra =""
      let dataFact =""
      if(this.state.Comprobante !=""){
       
          listaCompra = this.state.Comprobante.factura.detalles[0].detalle.map((item, i)=>{
            return(<ListCompraFact 
              index={i} 
              key={item.codigoPrincipal[0]} 
              Errorlist={this.state.Errorlist} 
              datos={item}
              sendSwich={this.sendSwich}
              sendErrace={this.sendErrace}
              sendExp={(e)=>{this.SetExp(e)}} 
              sendItem={this.sendItem}
              sendNombre={this.setName}
              />
           )
          })

        TotalValorCompra = this.state.Comprobante.factura.infoFactura[0].importeTotal[0]
        dataFact= this.state.Comprobante.factura
      }
        return ( 

         <div >

<div className="maincontacto" id="mainAddFact" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Agregar Factura

</div>



</div> 
<div className="Contxml">
<label for="myfile">Seleccione un xml:</label>
<input    ref={this.componentRef} type="file" id="myXMLfile"  name="myXMLfile" 
onChange={this.setChangeinput}

/>

                    </div>
                    <div style={{width:"100%"}}> 
         <Animate  show={this.state.xmlData.fechaAutorizacion[0] != ""}>        
<div className="Scrolled">

<div className="fecha">
  Fecha: {fecha}
  </div>
  {/*  <div className="contValfact">
             
             
      <Animate show={!this.state.validfact}>
        <div className="ContFlex">
        <Animate show={!this.state.waitingdata}>
      <button className="botoncontact botoupload" onClick={this.valFact}>
                        Validar Factura
        </button>  
        </Animate>
                       
                       <Animate show={this.state.waitingdata}>
                       <CircularProgress />
                       </Animate>
     <div className='contVerified'>

      <span className="material-icons">
      error
      </span>
     
      <span>  Factura no validada</span>
     </div>
     </div>
      </Animate>
               
      <Animate show={this.state.validfact}>
      <div className="ContFlex">
     <div className='contVerified'>
     <span className="material-icons">
done
</span>
      <span> Factura Verificada</span>
     </div>
     </div>
      </Animate>       
                       </div>  */}



                    <Animate show={this.state.Comprobante != ""}>
                    <div className="contAgregadorCompras">
      <div className="contTitulosaddFact ">
                  
                        <div className="Articid">
                          ID
                        </div>  <div className="Articid">
                          DISTRI-ID
                        </div>
                        <div className="Artic100FpagoName">
                           Nombre
                        </div>
                        <div className="Artic100Fpago ">
                            Medida
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
                        <div className="Artic100Fpago ">
                            Insumo
                        </div>
                        <div className="Artic100Fpago ">
                            IVA
                        </div>
                        <div className="Artic100Fpago ">
                            Caduca
                        </div>
                        <div className="accClass ">
                            Item
                        </div>
                        <div className="Artic100Fpago ">
                            Selec
                        </div>
                      
                        </div>
                        <div className="maincontDetallesFact">
                        
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
      <HelperFormapagoPredit setuserData={(e)=>{this.setState(e)}}  preData={dataFact}onChange={this.setHeperdata}/>
     
      
      <Animate show={this.state.loading}>
      <CircularProgress />
      </Animate>
      <Animate show={!this.state.loading}>
      <div className="contBotonPago">
                    <button style={{width:"50%",maxWidth:"200px"}} className={` btn btn-success botonedit2 `} onClick={()=>{this.comprobadorGenCompra( TotalValorCompra, TotalPago)}}>
<p>Comprar</p>
<i className="material-icons">
add
</i>

</button>
</div>
</Animate>
                    
      </Animate>
</div>
</Animate>   
</div>
</div>




        </div>
        <Animate show={this.state.prevent1}>
<Prevent 
Mensaje={"Su RUC no coincide con el RUC del comprador de la factura. ¿Desea continuar?"}
Flecharetro={()=>{this.setState({prevent1:false})}}
SendAceptar={()=>{   this.setState({xmlData:this.state.preventxmlData, Comprobante:this.state.preventData1})}}
/>
        </Animate> 
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={20000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
        <style jsx >{`
        botonedit2{
          width: 50%;  
          min-width:200px;
          max-width:225px;
        }
        .contVerified{
          display: flex;
          align-items: center;
      
          margin-left: 20px;
          text-align: center;
        }
           .contBotonPago{
            margin-top:20px;
            display: flex;
    justify-content: center;
    flex-flow:column;
    align-items: center;
        }
        .maincontDetallesFact{
          
            margin-top: 10px;
          
            padding-top: 10px;   
            opacity:1;
            transition:1s;
            width: fit-content;
          
        }
        p{
          margin: 0px;
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
       .Contxml{
        display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid black;
    padding: 10px;
    border-radius: 15px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    width: 90%;
       }
      .botoncontact {
        margin-top:10px;
        height: 100%;
        margin-left: 15px;
        font-size: 15px;
        padding: 0 16px;
        border-radius: 10px;
        background-color: #0267ffeb;
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
        color: white;
        transition: background-color 15ms linear, box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
        line-height: 2.25rem;
        font-family: Roboto, sans-serif;
        font-weight: 500;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        border: none;
        transition: 0.5s;
    }
    .botoupload {
      text-transform: none;
      /* padding: 15px; */
      border-radius: 50px;
      box-shadow: 6px 1px 9px black;
      border: 1px solid black;
      /* width: 101px; */
      height: 37px;
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
.contValfact{
  display:flex;
  margin-bottom: 34px;
  justify-content: space-around;
  width: 100%;

  max-width: 360px;
  justify-content: center;
  align-items: center;
}
.ContFlex{
  display:flex;
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
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 67vh;
                      padding: 5px;
                     
                     }
                     
   .contTitulosaddFact{
    display:flex;
   
    font-size: 15px;
    font-weight: bolder;  
  
  
}
.contAgregadorCompras{
  display:flex;
  flex-flow: column;
  overflow-x: scroll;
}
}
.accClass{
  width: 10%;  
  min-width:50px;
  max-width:60px;
  align-items: center;
  text-align:center;
}
.Articid{
  width: 10%;  
  min-width:100px;
  max-width:120px;
  align-items: center;
  text-align:center;
  word-break: break-all;

}
   .Artic100Fpago{
    width: 18%;  
    min-width:100px;
    max-width:125px;
    align-items: center;
    text-align:center;
}
.Artic100FpagoName{
  width: 25%;  
  min-width:200px;
  max-width:225px;
  align-items: center;
  text-align:center;

}

.totalp{
  text-align: center;
  font-size: 25px;
  font-weight: bolder;
  margin-bottom: 0px;
  margin-left: 21px;
}  
            .fecha{
              font-size: 20px;
    margin: 10px;
            }      

            @media only screen and (min-width: 1440px) {  

             
              .maincontDetallesFact{
                width: 100%;  
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