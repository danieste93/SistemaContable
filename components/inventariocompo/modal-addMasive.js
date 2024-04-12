import React, { Component } from 'react'
import Papa  from "papaparse";
import {connect} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {Animate} from "react-animate-mount"
import Pagination from "../Pagination";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import ArticuloRenderListMasive from "./articuloRenderListViewMasive"
import {paginationPipe} from "../../reduxstore/pipes/paginationFilter";
import { addRegs,addCompra } from '../../reduxstore/actions/regcont';
import HelperFormapago from "../reusableComplex/helperFormapago"
class Contacto extends Component {
   
  state={
  
    codpunto:"001",
        codemision:"001",
        numeroFact:"",
    idReg:"",
  proveedor:"",
  idCompra:"",
  tiempo: new Date().getTime(),
    dataToAdd:[],
    Alert:{Estado:false},
    urlMasive:"",
    ContData:false,
    perPage: 9,
    Vendedor:{  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
      Id:this.props.state.userReducer.update.usuario.user._id,
      Tipo:this.props.state.userReducer.update.usuario.user.Tipo, 
     },
        currentPage: 1,
        pagesToShow: 5,
        gridValue: 3,
        Fpago:[],
        loading:false,
        waiting:false,
  }
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainAddMasive').classList.add("entradaaddc")

       }, 500);
        
     this.getid()

      }
      setHeperdata=(e)=>{
     
        this.setState(e)
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
                   
              Router.push("/")
            }else{
              this.setState({idCompra:response.cont.ContCompras,idReg:response.cont.ContRegs})
            }
      
       
        
        });
      
      }

      obtenerextension = (articulos )=>{
        if(articulos === undefined) return 0
        const numero = articulos.length
        return numero
    }
   
 
      Onsalida=()=>{
        document.getElementById('mainAddMasive').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }  
        comprobadorGenCompra=( TotalPago, TotalValorCompra)=>{
   
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
          if(parseFloat(TotalValorCompra).toFixed(2) < parseFloat(TotalPago).toFixed(2)){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Revice el pago total "
          }
          this.setState({Alert: add, loading:false,})
          }
         else if(parseFloat(TotalValorCompra).toFixed(2) >  parseFloat(TotalPago).toFixed(2)){
            let add = {
              Estado:true,
              Tipo:"warning",
              Mensaje:"El pago es mayor, al valor de compra "
          }
          this.setState({Alert: add, loading:false,})
          }
          else  if(parseFloat(TotalValorCompra).toFixed(2) == parseFloat(TotalPago).toFixed(2) && parseFloat(TotalValorCompra).toFixed(2) > 0 ){
             
      this.setState({waiting:true})
      var url = '/public/generate-compra-masiva';
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

        if(response != undefined){
    
        if(response.message=="error al registrar"){
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Error en el sistema, porfavor intente en unos minutos"
        }
        this.setState({Alert: add, loading:false, waiting:false}) 
        }else  if(response.estado=="data error"){
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:response.message
        }
        this.setState({Alert: add, loading:false, waiting:false}) 
        } else{
            
        let add = {
          Estado:true,
          Tipo:"success",
          Mensaje:"Compra Masiva Ingresada"
      }
      this.setState({Alert: add, waiting:false})
      
     setTimeout(()=>{this.props.updateArt(), 
      
      this.props.dispatch(addRegs(response.Regs));
      this.props.dispatch(addCompra(response.Compra));
      
      this.Onsalida()},1200) 
      
 
        }
            }else{
              let add = {
                Estado:true,
                Tipo:"warning",
                Mensaje:"El proceso tardara mas de lo esperado, actualizar manualmente al finalizar"
            }
            this.setState({Alert: add})
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
          console.log("cargando transaccion")
        }


      } //asd
        comprobadorAddMasive=()=>{
     
      
          if(this.state.urlMasive == ""){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Ingrese una URL"
          }
          this.setState({Alert: add}) 
      
          }else if(this.state.urlMasive != "" ){
            Papa.parse(this.state.urlMasive, {
              download: true,
              header: true,
              error:(err)=>{
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Error al cargar datos"
              }
              this.setState({Alert: add}) 
            
              },
              complete: (results) => {
              
                  const data = results.data
                let dataAdd = []
             
                  if(results.meta.fields.length == 29){
                    for(let i=0; i < data.length; i++){
                 
                    let edit = data[i].Imagen.replace(/['"]+/g, '').replace(/[\[\]]/g,'').split(",")
                      
                   let oldData = data[i]
               
                   oldData.Imagen = edit,
                   oldData.Precio_Compra= data[i].Precio_Compra,
                   oldData.CantidadCompra= parseFloat(data[i].Cantidad_Compra)
                   oldData.Iva=  data[i].Iva.trim() 
                   oldData.Tipo=  data[i].Tipo.trim()
                   oldData.Medida=  data[i].Medida.trim()
                   oldData.Eqid=  data[i].Eqid.trim()
                   oldData.Categoria=  data[i].Categoria.trim()

                       dataAdd.push(oldData)
                    }
               
                 
                   this.setState({ContData:true, dataToAdd:dataAdd})
                
                  }else{
                    let add = {
                      Estado:true,
                      Tipo:"error",
                      Mensaje:"Plantilla Incorrecta"
                  }
                  this.setState({Alert: add}) 
                  }
                
              }
          });
          }
        }
        setPreciosPago=(e)=>{
        
          let testFind =  this.state.Fpago.find(x => x.Id == e.Id)  
      
          let newIndex = this.state.Fpago.indexOf(testFind)
          let newArr = this.state.Fpago
          newArr[newIndex].Cantidad = e.Cantidad
          this.setState({Fpago:newArr})  
         }

         onPrev = () => {
          const updatedState = {...this.state};
          updatedState.currentPage = this.state.currentPage - 1;
          this.setState(updatedState);
      };
  
  
      onNext = () => {
          this.setState({
              ...this.state,
              currentPage: this.state.currentPage + 1
          });
         
      };
  
      goPage = (n) => {
          this.setState({
              ...this.state,
              currentPage: n
          });
      };
    render () {


const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Actualice Manualmente</div>;
  }

  return (
    <div className="timer">
      <div className="text">Aproximado</div>
      <div className="value">{remainingTime}</div>
      <div className="text">segundos</div>
      <style >{`
        .timer {
          font-family: "Montserrat";
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .text {
          color: #aaa;
        }
        
        .value {
          font-size: 18px;
        }
        
       
      `}</style >

    </div>
  );
};
      let TotalPago = 0
      if(this.state.Fpago.length > 0){


        for(let i = 0; i<this.state.Fpago.length;i++){
        
            TotalPago = TotalPago + this.state.Fpago[i].Cantidad
        }
        
    }
      

      let TotalValorCompra=0
      let  generadorArticulosListMasive = []    
      if(this.state.dataToAdd){
        if(this.state.dataToAdd.length > 0){
          let incrementador=0
          for(let i = 0;i<this.state.dataToAdd.length;i++){
            let cantTotal = 0
            console.log(this.state.dataToAdd[i])
              if(this.state.dataToAdd[i].Precio_Compra &&  this.state.dataToAdd[i].CantidadCompra){
                 cantTotal = parseFloat(this.state.dataToAdd[i].Precio_Compra.replace(",",".")) *  parseInt(this.state.dataToAdd[i].CantidadCompra)
            }
            incrementador += parseFloat(cantTotal.toFixed(2))
          }
          TotalValorCompra = parseFloat(incrementador)
     
        }
       

       

        generadorArticulosListMasive = paginationPipe(this.state.dataToAdd, this.state).map((item, i) => ( <ArticuloRenderListMasive
          key={i}
          datos={item} 
        
          onDelete={()=>{this.handleDelete(item)}}  
       
          /> 
          ));
      }

     

      let contData = this.state.ContData?"ContData":""
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

<div className="maincontacto" id="mainAddMasive" >
            <div className={`contcontacto ${contData}`}  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p onClick={()=>{this.setState({waiting:!this.state.waiting})}}> Adición Masiva </p>
           
        </div>
     
        </div>
        <div className=" centrar ">
        <div className="  contPlantilla">
        <a style ={{display:"flex", justifyContent:"space-evenly"}}href="https://docs.google.com/spreadsheets/d/15nB5GRS9JdCJlKxgLDB0R3CkauzMmuGNSkcJZCivqgg/edit?usp=sharing" target="_blank">
          <div className="">Plantilla</div>
          <i className="material-icons">
system_update
</i>   </a>
        </div>
     
        </div>
        <div className=" centrar contColun">
          <div className="centrar">Inserta la URL de Google Spreed Sheets</div>
        <div className="contAddurl">
        <input type="text" name="urlMasive" className='inputUrl' value={this.state.urlMasive} onChange={this.handleChangeGeneral }/>
        <button className=" btn btn-success botonedit" onClick={this.comprobadorAddMasive}>

<span className="material-icons">
send
</span>

</button>
</div>
        </div>

<Animate show={this.state.ContData}>
  <div className="contDataScroll">
<div className="contenedorArticulos">
<div className="contTitulosArt">
<div className="eqIdart">
<div className="textPrint"> ID </div>
</div>
<div className="tituloArtic">
<div className="textPrint">   Nombre</div>
</div>
<div className="precioArtic">
<div className="textPrint">    Precio Compra</div>
  </div>
  <div className="existenciaArtic">
 <div className="textPrint">     Cantidad </div>
 </div>
 <div className="existenciaArtic">
 <div className="textPrint">     Valor Final </div>
 </div>
 <div className="existenciaArtic centerti">
                            Img
                        </div>
                        
</div>
<div className="contListaArt">
{generadorArticulosListMasive} 
</div>

</div>
<div className="jwFlexEnd">
               
               <Pagination
                       totalItemsCount={this.obtenerextension(this.state.dataToAdd)}
                       currentPage={this.state.currentPage}
                       perPage={this.state.perPage}
                       pagesToShow={this.state.pagesToShow}
                       onGoPage={this.goPage}
                       onPrevPage={this.onPrev}
                       onNextPage={this.onNext}
                   />
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
               <HelperFormapago  
               valorSugerido={parseFloat(TotalValorCompra).toFixed(2)}
               
               onChange={this.setHeperdata}/>
                    <div className="contBotonPago">
                  

<Animate show={this.state.waiting}>
<CountdownCircleTimer
          isPlaying
          size={190}
          duration={(this.state.dataToAdd.length * 0.3)+2}
          colors={["#A30000","#ffb608","#019ff7","#A6FB4"]}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => ({ shouldRepeat: false, delay:0 })}
        >
          {renderTime}
        </CountdownCircleTimer>
     
   </Animate>
   <Animate show={this.state.waiting == false}>
   <button className={` btn btn-success botonedit2 `} onClick={()=>{this.comprobadorGenCompra(TotalPago, TotalValorCompra)}}>
<p>Comprar</p>
<i className="material-icons">
shopping_cart
</i>

</button>
    </Animate>
                    </div>
                    </div>
</Animate>

        </div>
        </div>
        <Snackbar open={this.state.Alert.Estado}  onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>

                    
           <style jsx>{`
            .contBotonPago{
              flex-flow: column;
              margin-top:20px;
              display: flex;
      justify-content: center;
      margin-bottom: 24px;
          }
           p{margin-bottom:0px}
                .cDc2{
                  margin-left:10px;
                }
           .cDc1{
            width:30%;
            text-align: right;
            
          }
          .proveedorInput{
            border-radius: 20px;
            text-align: center;
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
              .contTitulos2{
                display:flex;
               
                font-size: 15px;
                font-weight: bolder;
                justify-content: space-around;
              
                width: 100%;
            }
            .contDataScroll{
              height: 70vh;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
            }
            .Artic100Fpago{
              width: 18%;  
              min-width:80px;
              max-width:100px;
              align-items: center;
              text-align:center;
          }
                    .contMainContado{
                      display:flex;
                      width: 100%;
                      justify-content: flex-end;
                      flex-flow: column;
                    }
             .contenedorArticulos{
              overflow-x: scroll;
              min-height: 235px;
              background: #ffffff7a;
              padding: 15px;
              border-radius: 10px;
              max-width: 800px;
              margin: 8px;
              width: 100%;
              height: 40vh;
      }
      .botonAddCrom {
        display:flex;
    }
      .contContado{
        padding: 5px 10px;
        margin-top: 20px;
        border: 2px solid black;
        border-radius: 10px;
        background: aliceblue;
        max-width: 600px;
        width: 100%;
       }
       .totalp{
        text-align: center;
        font-size: 28px;
        font-weight: bolder;
        margin-bottom: 0px;
    }
           .inputUrl{
            width: 80%;
            border: 2px solid black;
            margin: 10px;
            padding: 5px;
            border-radius: 13px;
            max-width: 500px;
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
           .contColun{
            flex-flow: column;
           }
           .MuiSnackbar-anchorOriginBottomCenter{
            z-index:999999999
           }
             .contAddurl{
              display: flex;
              margin-bottom: 20px;
              width: 100%;
              justify-content: center;
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
 
           .cDc2{
     margin-left:10px;
   }
   .centerti{
    justify-content: center;
}
.contTitulosArt{
    display:inline-flex;
 
    font-size: 20px;
    font-weight: bolder;
}
  .eqIdart{
        width: 85px;  

        display: flex;
    }
    .tituloArtic{
        width: 250px;  
        display: flex;
    }
    .precioArtic{
        width: 100px; 
        display: flex;
    }
    .existenciaArtic{
        display: flex;
        width: 100px; 
        margin-right:10px;
    }

   .contDatosC{
     display:flex;
     width: 100%;
   }

.cDc1{
  width:30%;
  text-align: right;
  
}
            


           .headercontact {

            display:flex;
            justify-content: space-around;

           }


           .contPlantilla{
            display: flex;
            border-bottom: 2px solid black;
            min-width: 155px;
            background-color: aliceblue;
            border-radius: 15px;
            justify-content: space-evenly;
            padding: 6px;
            font-weight: bold;
            margin: 15px;
        }
           

      
            
       
             
        
        .maincontacto{
          z-index: 1001;
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
     
         width: 98%;
         background-color: white;
         min-height: 20vh;
         transition: 1s;
       }
      
   
      
       .ContData{
        min-height:95vh;
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
              width: 85%;
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

