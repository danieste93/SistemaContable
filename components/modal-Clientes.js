import React, { Component } from 'react'
import Papa  from "papaparse";
import {connect} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {Animate} from "react-animate-mount"
import {paginationPipe} from "../reduxstore/pipes/paginationFilter";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import ClientRender from "./ClienteRenderListView"

import Pagination from "./Pagination";
import { getClients } from '../reduxstore/actions/regcont';
import fetchData from './funciones/fetchdata';
import CircularProgress from '@material-ui/core/CircularProgress';
import exportarClienteExcel from './generadorClientes';
class Contacto extends Component {
  state={
    perPage: 9,
    currentPage: 1,
    pagesToShow: 5,
    gridValue: 3,
    loading:false,
    loadingClient:false,
    waiting:false,
    Fpago:[],
    dataToAdd:[],
    urlMasive:"",
    Alert:{Estado:false},
  }

    async componentDidMount(){
      if(!this.props.state.RegContableReducer.Clients){
        this.setState({loadingClient:true})
        let data = await fetchData(this.props.state.userReducer, 
          "/public/getAllClients", {});
       console.log(data)
       if (data.status == "Ok"){
        this.setState({loadingClient:false})
        this.props.dispatch(getClients(data.clientesHabiles))
       }
      }
      setTimeout(function(){ 
        
        document.getElementById('mainxx').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
      comprobadorMasiveClient=()=>{
        if(this.state.loading == false){
          this.setState({loading:true})
          var url = '/public/upload-masive-clientes';
          
    
let newstate = this.state
      newstate.Userdata ={DBname:this.props.state.userReducer.update.usuario.user.DBname}
  
      


  
      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(newstate), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.state.userReducer.update.usuario.token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        console.log('Success addClientes:', response)
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
          Mensaje:"Clientes Ingresados"
      }
      this.setState({Alert: add,loading:false})
      setTimeout(()=>{this.Onsalida()},1000)

      
 
        }
            
    
    })



        }
      }
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
    onPrev = () => {
        const updatedState = {...this.state};
        if(updatedState.currentPage >= 1){
          updatedState.currentPage = this.state.currentPage - 1;
          this.setState(updatedState);
        }
      
    };
      obtenerextension = (articulos )=>{
        if(articulos === undefined) return 0
        const numero = articulos.length
        return numero
    }
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
              console.log(results)
                if(results.meta.fields.length == 7){
                  for(let i=0; i < data.length; i++){
               

                    
                 let oldData = data[i]
              
              

                     dataAdd.push(oldData)
                  }
             
               
                 this.setState({ContData:true, dataToAdd:dataAdd})
                 console.log(dataAdd)
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
      genClientes=()=>{

        let data = this.props.state.RegContableReducer.Clients

        exportarClienteExcel(data)
      }

      Onsalida=()=>{
        document.getElementById('mainxx').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }  
      

    render () {
      const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
          return <div className="timer">OK</div>;
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
                margin-bottom: 90px;
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
      let  generadorArticulosListMasive = [] 
      if(this.state.dataToAdd){
      generadorArticulosListMasive = paginationPipe(this.state.dataToAdd, this.state).map((item, i) => ( <ClientRender
        key={i}
        datos={item} 
     
     
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

<div className="maincontacto" id="mainxx" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Agregador Masivo Clientes


</div>



</div> 
<div className="Scrolled">
<div className=" centrar ">
        <div className="  contPlantilla">
        <a style ={{display:"flex", justifyContent:"space-evenly"}}href="https://docs.google.com/spreadsheets/d/1bYJYKtc18aK-RTNiBpm23mbf3jlSPMbF9Brw66Erdmo/edit?usp=sharing" target="_blank">
          <div className="">Plantilla</div>
          <i className="material-icons">
system_update
</i>   </a>
        </div>
        <div className="  contdescarga">
          <Animate show={this.state.loadingClient}>
          <CircularProgress/>
          </Animate>
          <Animate show={!this.state.loadingClient}>
        <div className='contPlantilla' onClick={this.genClientes}>
          <div className="">Clientes</div>
          <i className="material-icons">
download
</i>   
</div>
          </Animate>
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


<div className="precioArtic">
<div className="textPrint">    Nombre</div>
  </div>
  <div className="existenciaArtic">
 <div className="textPrint">     Tipo ID </div>
 </div>
 <div className="existenciaArtic doscincuenta">
 <div className="textPrint">     Identificacion</div>
 </div>
 <div className="existenciaArtic">
 <div className="textPrint">     Correo </div>
 </div>
 <div className="existenciaArtic">
 <div className="textPrint">     Telefono</div>
 </div>
 <div className="existenciaArtic">
 <div className="textPrint">     Direccion</div>
 </div>
 <div className="existenciaArtic">
 <div className="textPrint">     Ciudad</div>
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
             
             
                    <div className="contBotonPago">
                  

<Animate show={this.state.loading}>
<CircularProgress/>
     
   </Animate>
   <Animate show={this.state.loading == false}>
   <button className={` btn btn-success botonedit2 `} onClick={()=>{this.comprobadorMasiveClient()}}>
<p>Agregar</p>
<i className="material-icons">
add
</i>

</button>
    </Animate>
                    </div>
                    </div>
</Animate>
</div>
</div>
        </div>
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
        <style jsx >{`
        .inputUrl{
          width: 80%;
          border: 2px solid black;
          margin: 10px;
          padding: 5px;
          border-radius: 13px;
          max-width: 500px;
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
                  cursor:pointer;
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
                     
                 
                      padding: 5px;
                     
                     }
                     .contColun{
                      flex-flow: column;
                     }
                     .contAddurl{
                      display: flex;
                      margin-bottom: 20px;
                      width: 100%;
                      justify-content: center;
                     }
                     .contTitulosArt{
                      display:inline-flex;
                   
                      font-size: 20px;
                      font-weight: bolder;
                  }
                  .precioArtic{
                    width: 100px; 
                    display: flex;
                } .existenciaArtic{
                  display: flex;
                  width: 100px; 
                  margin-right:10px;
              }.contDataScroll{
                height: 70vh;
      overflow-y: scroll;
      overflow-x: hidden;
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: center;
              }


              .contenedorArticulos{
                overflow-x: scroll;
                min-height: 235px;
                background: #ffffff7a;
                padding: 15px;
                border-radius: 10px;
                max-width: 800px;
                margin: 8px;
                width: 90%;
                height: 40vh;
        }

            .doscincuenta{
            width: 230px;  
            margin-right:30px; 
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