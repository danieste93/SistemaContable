import React, { Component } from 'react'

import ArticuloRenderList from "./inventariocompo/articuloRenderListView"
import CircularProgress from '@material-ui/core/CircularProgress';
import { Animate } from "react-animate-mount";


import {paginationPipe} from "../reduxstore/pipes/paginationFilter";
import Pagination from "./Pagination";

import {Filtervalue,Searcher} from "./filtros/filtroeqid"
import ModalAddCompra from './inventariocompo/modal-addCompra';
import {connect} from 'react-redux';

import postal from 'postal';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import ModalListadoCompras from './inventariocompo/modal-listadoCompras'
import ModalListadoVentas from "./inventariocompo/modal-listadoVentas"
import ModalAddFact from "./inventariocompo/modal-addfact"
import ModalResearch from "./inventariocompo/modal-research"
import ModalAddMasive from "./inventariocompo/modal-addMasive"
import ModalAddIndividual from "./inventariocompo/modal-addArtIndividual"
import ModalAddCombo from "./inventariocompo/modal-addCombo"
import ModalEditCombo from "./inventariocompo/modal-editCombo"
import ModalAddServ from "./inventariocompo/modal-addServicio"
import EditArt from"./inventariocompo/modal-editArt"
import EditServ from"./inventariocompo/modal-editServicio"
import ModalDeleteArt from "./inventariocompo/modal-delete-art"
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import GenRepArt from "./inventariocompo/generadorReporteArticulos"
import HookLoader from "../components/cuentascompo/newHooks/hookmodelRedux"
import {getDistribuidor,getAllcuentas,getCompras,getVentas, getCounter,getArts,getcuentas,addRegs, addFirstRegs } from "../reduxstore/actions/regcont";
import ModalReportInv from './inventariocompo/modal-reportInv';
import Dropdown from 'react-bootstrap/Dropdown';
import CodigoBarras from "./inventariocompo/modal-barrcode"
class accessREMO extends Component {
  
    state={
        vista:"listmode",
        artResearch:{},
        loadingData:false,
        modalReportInv:false,
        modalBarras:false,
        Alert:{Estado:false},
        misarts:this.props.state.RegContableReducer.Articulos,
        listadoCompras:false,
        listadoVentas:false,
        data:{Articulos:[]},
        pickmode:false,
        listmode:true,
        getLoaderinv:false,
        edicion:false,
        itemPoreditar:{Grupo:"",Marca:""},
        perPage: 9,
        currentPage: 1,
        pagesToShow: 5,
        gridValue: 3,
        inputval:"",
        filterid:1,
        NombreFilter:1,
        filterprecio:1,
        filterexistemcia:1,
        addMasive:false,
        addIndividual:false,
        addComb:false,
        DeleteArt:false,
        data:[],
        searcherIn:"",
        addCompraFact:false,
        modalResearch:false,
    }
    channel1 = null;
    onPrev = () => {
        const updatedState = {...this.state};
        if(updatedState.currentPage >= 1){
          updatedState.currentPage = this.state.currentPage - 1;
          this.setState(updatedState);
        }
      
    };
  
    

    componentDidMount() {
     
      let titple = "Nueces L2"
      let sinSubCode = titple.replace("L2", "")

  
      this.startArmorData()

          this.channel1 = postal.channel();
          this.channel1.subscribe('update-Arts', (data) => {
         
              this.getdata();
               
             });
      let datasep= this.props.state.RegContableReducer.Articulos

     

      let acc = 0
/*
      datasep.forEach((x)=>{
let valdata = x.Precio_Compra * x.Existencia
acc+=valdata

      })
     
      */
      
      
  
      }

      updateData = ()=>{
          
        this.setState({loadingData:true})
        this.getdata()
      }
      
      startArmorData =()=>{
        if(!this.props.state.RegContableReducer.Articulos){
            this.getdata()
          }
         if(!this.props.state.RegContableReducer.Distribuidores  ||!this.props.state.RegContableReducer.Cuentas){
            this.getArmoextraData()
          }
    }

    comprobadorfact =()=>{
      if(this.props.state.userReducer.update.usuario.user.Factura.validateFact && this.props.state.userReducer.update.usuario.user.Firmdata.valiteFirma){   
        this.setState({ addCompraFact:true })
      }else{
        let add = {
          Estado:true,
          Tipo:"info",
          Mensaje:"Se sugiere configurar facturación electrónica, antes de agregar facturas"
      }
      this.setState({Alert: add, addCompraFact:true })
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
    handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value,
        currentPage:1
        })
        }
        getArmoextraData=()=>{
            console.log("en getdata")
              let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                  Tipo: this.props.state.userReducer.update.usuario.user.Tipo
                }}
              let lol = JSON.stringify(datos)
              fetch("/cuentas/getarmoextradata", {
                method: 'POST', // or 'PUT'
                body: lol, // data can be `string` or {object}!
                headers:{
                  'Content-Type': 'application/json',
                  "x-access-token": this.props.state.userReducer.update.usuario.token
                }
              }).then(res => res.json())
              .catch(error => {console.error('Error:', error);
                     })
              .then(response => {  
               console.log(response)
                  if(response.status == 'error'){
                
                    if(response.message == "error al decodificar el token"){
                      this.props.dispatch(logOut());
                      this.props.dispatch(cleanData());
                      alert("Session expirada, vuelva a iniciar sesion para continuar");
                  
                   
                      Router.push("/")
                         
                    }
                  }else if(response.status == 'Ok'){             
      
                    this.props.dispatch(getDistribuidor(response.distriHabiles)); 
                    this.props.dispatch(getcuentas(response.allCuentasHabiles)); 
                  }
              });
      
      
            }
      
    getdata=()=>{
      console.log("en getdata")
        let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
            Tipo: this.props.state.userReducer.update.usuario.user.Tipo
          }}
        let lol = JSON.stringify(datos)
        fetch("/public/engine/art", {
          method: 'POST', // or 'PUT'
          body: lol, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => {console.error('Error:', error);
               })
        .then(response => {  
         console.log(response)
            if(response.status == 'error'){
          
              if(response.message == "error al decodificar el token"){
                this.props.dispatch(logOut());
                this.props.dispatch(cleanData());
                alert("Session expirada, vuelva a iniciar sesion para continuar");
            
             
                Router.push("/")
                   
              }
            }else if(response.status == 'Ok'){             

                this.props.dispatch(getArts(response.articulosHabiles));
                this.setState({loadingData:false})
            }
        });


      }


getDataUser=()=>{
    if(this.props.state.userReducer != ""){
        return (this.props.state.userReducer.update.usuario)
    }else {
        return {}
    }
}

getClick=()=>{
  
var field = document.createElement('input');
field.setAttribute('type', 'text');
document.body.appendChild(field);

setTimeout(()=> {
field.focus();
setTimeout(()=> {
field.setAttribute('style', 'display:none;');
}, 50);
}, 50);
  }
handleEdit=(item)=>{
   
  
   if(item.Tipo == "Producto"){
    this.setState({edicion:true,  itemPoreditar:item})
   }else if(item.Tipo == "Servicio"){
    this.setState({edicionServ:true,  itemPoreditar:item})
   }else if(item.Tipo == "Combo"){
    this.setState({editComb:true,  itemPoreditar:item})
   }



}


handleDelete=(item)=>{

  
this.setState({dataArtDel:item, DeleteArt:true})

    }

 

sendMasive=()=>{
    const formData = new FormData();
  
    if(document.getElementById('rfile').files.length > 0){
        const doc = document.getElementById('rfile').files[0]
        formData.append("uploadfile", doc );

        const options = {
            method: 'POST',
            body: formData,
            // If you add this, upload won't work
            // headers: {
            //   'Content-Type': 'multipart/form-data',
            // }
            };

            fetch('/admin/upload-database', options).then(response => response.json())
.then(success => {


})
.catch(error => {

}
);
    }
    else{
   
    }
    

}



obtenerextension = (articulos )=>{
    if(articulos === undefined) return 0
    const numero = articulos.length
    return numero
}

getAutoValue=(valor)=>{
      
  
  let toset =[]
  const valorfiltrado = Filtervalue(this.props.state.RegContableReducer.Articulos, valor)
  const valortTitulo = Searcher(this.props.state.RegContableReducer.Articulos, valor)

console.log(valorfiltrado)

  if(valorfiltrado.length > valortTitulo.length){
    toset = {Articulos:valorfiltrado}
  }
  else{
    toset = {Articulos:valortTitulo}
  }

 return toset

     
     }

     filteridfunc=()=>{
        
       let nuevoval = this.state.filterid + 1
      
       if(nuevoval ==4){
        let regs = this.props.state.RegContableReducer.Articulos
        let order = regs.sort((a, b) =>a.Eqid  - b.Eqid)
           this.setState({filterid:2})
       }else if(nuevoval ==2){
        
        let regs = this.props.state.RegContableReducer.Articulos
        let order = regs.sort((a, b) =>a.Eqid  - b.Eqid)
      
        this.setState({filterid:nuevoval})
       }else if(nuevoval ==3){
        let regs = this.props.state.RegContableReducer.Articulos
        let order = regs.sort((a, b) =>b.Eqid - a.Eqid )
        
        this.setState({filterid:nuevoval})
       }
      
     }
   
     filterprecio=()=>{
        let nuevoval = this.state.filterprecio + 1
        if(nuevoval ==4){
            let regs = this.props.state.RegContableReducer.Articulos
            let order = regs.sort((a, b) =>b.Precio_Venta - a.Precio_Venta )
               this.setState({filterprecio:2})
           }else if(nuevoval ==2){
         
            let regs = this.props.state.RegContableReducer.Articulos
            let order = regs.sort((a, b) =>b.Precio_Venta - a.Precio_Venta )
          
          
            this.setState({filterprecio:nuevoval})
           }else if(nuevoval ==3){
            let regs = this.props.state.RegContableReducer.Articulos
            let order = regs.sort((a, b) =>a.Precio_Venta  - b.Precio_Venta)
            
            this.setState({filterprecio:nuevoval})
           }
     }
     filterexistemcia=()=>{
        let nuevoval = this.state.filterexistemcia + 1
        if(nuevoval ==4){
            let regs = this.props.state.RegContableReducer.Articulos
            let order = regs.sort((a, b) =>b.Existencia - a.Existencia)
               this.setState({filterexistemcia:2})
           }else if(nuevoval ==2){
         
            let regs = this.props.state.RegContableReducer.Articulos
            let order = regs.sort((a, b) =>b.Existencia - a.Existencia )
          
          
            this.setState({filterexistemcia:nuevoval})
           }else if(nuevoval ==3){
            let regs = this.props.state.RegContableReducer.Articulos
            let order = regs.sort((a, b) =>a.Existencia  - b.Existencia)
            
            this.setState({filterexistemcia:nuevoval})
           }
     }

     filternombrefunc=()=>{
        
        let nuevoval = this.state.NombreFilter + 1
       if(nuevoval ==2){
            
            function SortArray(x, y){
                if (x.Titulo < y.Titulo) {return -1;}
                if (x.Titulo > y.Titulo) {return 1;}
                return 0;
            }
            let regs = this.props.state.RegContableReducer.Articulos
            let order = regs.sort(SortArray)
         
            this.setState({NombreFilter:nuevoval})
           }else if(nuevoval ==3){
          
            function SortArraydec(x, y){
                if (x.Titulo > y.Titulo) {return -1;}
                if (x.Titulo < y.Titulo) {return 1;}
                return 0;
            }
            let regs = this.props.state.RegContableReducer.Articulos
            let order = regs.sort(SortArraydec)
    
            this.setState({NombreFilter:nuevoval})
           }else if(nuevoval ==4){
            function SortArray(x, y){
                if (x.Titulo < y.Titulo) {return -1;}
                if (x.Titulo > y.Titulo) {return 1;}
                return 0;
            }
            let regs = this.props.state.RegContableReducer.Articulos
            let order = regs.sort(SortArray)
            this.setState({NombreFilter:2})
           }
     }
     jsonToCsv=(items)=> {
      const header = ["Eqid", 'Titulo', 'Tipo','Medida','Iva','Existencia','Precio_Compra','Precio_Venta','Precio_Alt','Grupo','Departamento','Categoria','SubCategoria','Marca','Calidad','Descripcion','Color','Garantia','MiniDescrip','Imagen','Caduca','TiempoReq','Producs','Diid',"Barcode"];
      const tring = header.join(',');
      // handle null or undefined values here
      const replacer = (key, value) => value ?? '';
      const rowItems = items.map((row) =>
        header
          .map((fieldName) => {
            if(fieldName == 'Precio_Compra'){
              return parseFloat(row[fieldName])
            }
            else if(fieldName == 'Titulo'){
              var regex = new RegExp("\"", "g");
              let sinbackslash = row[fieldName].replace(/\\/g, "/").replace(regex, "'");
            
              return JSON.stringify(sinbackslash, replacer)
            }
            
            
            else{
              
            
              return JSON.stringify(row[fieldName], replacer)
            }



          })
          .join('~')
      );
      // join header and body, and break into separate lines
      const csv = [tring, ...rowItems].join('\r\n');
      return csv;
    }

    researchdata=()=>{
      this.setState({getLoaderinv:false})

        let dataart= this.props.state.RegContableReducer.Articulos
        let compras = this.props.state.RegContableReducer.Compras
        let ventas = this.props.state.RegContableReducer.Ventas
        let registrosGasto = this.props.state.RegContableReducer.Regs.filter(x=>x.Accion =="Gasto"  && x.CatSelect.nombreCat =="Salida Inventario")
        let artError = []
        dataart.forEach(art => {
          
  //let comprasarr = compras.filter((x)=>  x.ArtComprados)
  
  let cantidadArtComprados =0
  let cantidadArtVendidos =0
  let cantidadArtEliminados =0
          for (let i = 0; i<compras.length;i++){
          
            for (let x = 0; x< compras[i].ArtComprados.length;x++){
              if(compras[i].ArtComprados[x]._id == art._id){
                cantidadArtComprados += compras[i].ArtComprados[x].CantidadCompra
               
              } 
  
            }
  
          }
          for (let i = 0; i<ventas.length;i++){
     
            for (let x = 0; x< ventas[i].articulosVendidos.length;x++){
              if(ventas[i].articulosVendidos[x]._id == art._id){
                cantidadArtVendidos += ventas[i].articulosVendidos[x].CantidadCompra
              
              } 
  
            }
  
          }
          for (let i = 0; i<registrosGasto.length;i++){
     
            if(registrosGasto[i].Descripcion2){
            for (let x = 0; x< registrosGasto[i].Descripcion2.articulosVendidos.length;x++){
            if(registrosGasto[i].Descripcion2.articulosVendidos[x]._id == art._id){
              cantidadArtEliminados += registrosGasto[i].Descripcion2.articulosVendidos[x].CantidadCompra
          }
        }}else {
          console.log(registrosGasto[i])
        }
        }
          let Total =cantidadArtComprados-cantidadArtVendidos - cantidadArtEliminados
  
          if(art.Existencia !== Total){
            artError.push({art:art.Titulo,Eqid:art.Eqid,Diferencia:Total - art.Existencia})
          }
  
  console.log(art.Titulo + "-->C-" +cantidadArtComprados+"-->V-"+cantidadArtVendidos+"-->E-"+cantidadArtEliminados+"--TOTAL--// "+ Total  )
        });
  
  if(artError.length > 0){
    let message = artError.map(x=>`Error en ${x.art} con id:${x.Eqid} y una diferencia de ${x.Diferencia} \n `)
    alert(message)
    
  
  }else{
    alert("Todo BIEN!!!")
    

  }





      


    }

     donwloaddata=()=>{
     
      let dataart= this.props.state.RegContableReducer.Articulos
      GenRepArt(dataart)

     }

    render() {
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
      

let resultadoAdmin = false

if(this.props.state.userReducer != ""){

    if(this.props.state.userReducer.update.usuario.user.Tipo == "administrador" || this.props.state.userReducer.update.usuario.Tipo == "tesorero"){
        resultadoAdmin = true
    }
}

      let checkAdmin=()=>{

         
        }
let listActive = this.state.vista=="listmode"?"listActive":""
let imageActive = this.state.vista=="pickmode"?"listActive":""


       // console.log(this.filterdata())

        let generadorArticulos = []    
        let generadorArticulosList = <CircularProgress />    
       

    
       
        if(this.props.state.RegContableReducer.Articulos){
         
let renderArts = [] 
            let arts = this.props.state.RegContableReducer.Articulos
         
            if(this.state.searcherIn ==""){
                renderArts=  arts 
            }else{
              
                let filtrados = Searcher(arts, this.state.searcherIn)
                let valorfiltrado = Filtervalue(arts, this.state.searcherIn)
               
               
                    renderArts=  valorfiltrado.concat(filtrados) 
               
            }
          

        


        generadorArticulosList = paginationPipe(renderArts, this.state).map((item, i) => ( <ArticuloRenderList
                                                                                    key={i}
                                                                                    datos={item} 
                                                                                    onEdicion={()=>{this.handleEdit(item)}}   
                                                                                    onDelete={()=>{this.handleDelete(item)}}  
                                                                                    userReducer={this.props.state.userReducer}
                                                                                    onResearch={()=>{ this.setState({artResearch:item,modalResearch:true})}}
                                                                                   
                                                                                    /> 
                                                                                    ));
    }
 



const { itemPoreditar }= this.state

        return (
            <div className="mainREMO">
       
       <div className="acciones">
       <div className="ContPrimerGrupo">
       <p className="subtituloArt"> Compra</p>
       <ButtonGroup variant="contained" color="secondary" aria-label="outlined primary button group">
       <Button className=" btn btn-warning botonedit" onClick={()=>{this.setState({addCompra:true})}}>
       <div className="buttonGroupStyle">
<p> Individual</p>
<span className="material-icons">
add_circle
</span>
</div>
</Button>

<Button className=" btn btn-success botonedit" onClick={()=>{this.setState({addMasive:true})}}>
<div className="buttonGroupStyle">
<p> Masiva</p>
<span className="material-icons">
add_shopping_cart
</span>
</div>
</Button>
<Button className=" btn btn-warning botonedit" onClick={this.comprobadorfact}>
       <div className="buttonGroupStyle">
<p> Factura</p>
<span className="material-icons">
add_box
</span>
</div>
</Button>
</ButtonGroup>
</div>
<div className="ContPrimerGrupo">
       <p className="subtituloArt">Crear </p>
       <ButtonGroup variant="contained" color="primary" aria-label="outlined primary button group">
       <Button className=" btn btn-warning botonedit" onClick={()=>{this.setState({addIndividual:true})}}>
       <div className="buttonGroupStyle">
<p> Articulo</p>
<span className="material-icons">
art_track
</span>
</div>
</Button>

<Button  onClick={()=>{this.setState({addServ:true})}}>
<div className="buttonGroupStyle">
<p> Servicio</p>
<span className="material-icons">
supervised_user_circle 
</span>
</div>
</Button>

</ButtonGroup>
</div>
<div className="ContPrimerGrupo">
<p className="subtituloArt">Listado </p>
<ButtonGroup variant="contained" color="secondary" aria-label="outlined primary button group">
<Button className=" btn btn-info botonedit" onClick={()=>{this.setState({listadoVentas:true})}} >
<div className="buttonGroupStyle">
<p> Ventas</p>
<span className="material-icons">
featured_play_list
</span>
</div>  
</Button>
<Button className=" btn btn-info botonedit" onClick={()=>{this.setState({listadoCompras:true})}} >
<div className="buttonGroupStyle">
<p> Compras</p>
<span className="material-icons">
list
</span>
</div>  
</Button>

</ButtonGroup>
</div>
       </div>
                <div className="visualization">
                <div className="react-autosuggest__container">
                <input name="searcherIn" className="react-autosuggest__input" onChange={this.handleChangeGeneral} placeholder="Busca Productos o Servicios" />  
                </div>     
                <div className="contbotones">
                <Dropdown>
        
        <Dropdown.Toggle variant="primary" className="contDropdown" id="dropdownm" style={{marginRight:"15px"}}>
        <span className="material-icons">
          more_vert
          </span>
    </Dropdown.Toggle>
  
     <Dropdown.Menu>
     <Dropdown.Item>
     <button className=" btn btn-dark btnDropDowm" onClick={this.donwloaddata}>
            <span className="material-icons">
            download
          </span>
          <p>Descargar</p>
          </button>
     </Dropdown.Item>   
     <Dropdown.Item>
     <button className=" btn btn-primary btnDropDowm" onClick={()=>{this.setState({modalBarras:true})}}>
            <span className="material-icons">
            view_week
          </span>
          <p>C.Barras</p>
          </button>
     </Dropdown.Item>   
     <Dropdown.Item>
     <button className=" btn btn-warning btnDropDowm" onClick={this.updateData}>
            <span className="material-icons">
            update
          </span>
          <p>Actualiar</p>
          </button>
     </Dropdown.Item>  
     <Dropdown.Item>
     <button className=" btn btn-secondary btnDropDowm" onClick={()=>{this.setState({getLoaderinv:true})}}>
            <span className="material-icons">
            pageview
          </span>
          <p>Analizar Inv</p>
          </button>
     </Dropdown.Item>  
     <Dropdown.Item>
     <button className=" btn btn-info btnDropDowm" onClick={()=>{this.setState({modalReportInv:true})}}>
            <span className="material-icons">
            summarize
          </span>
          <p>Reporte Inv</p>
          </button>
     </Dropdown.Item>  
     </Dropdown.Menu>
          
           </Dropdown>
                </div>
</div>
<div className="contScroller">

              
               
                  <Animate show={this.state.listmode}>
                      <div className="centrar">
                  <div className="contenedorArticulos">
                  <div className="contTitulosArt">
                        
                        <div className="eqIdart">
                           <div className="textPrint"> ID </div>
                           <div className="contFlechaFiltro">
                         
                            <Animate show={this.state.filterid == 1}>
              <i className="material-icons filtroini"  onClick={this.filteridfunc}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.filterid == 2}>
              <i className="material-icons"  onClick={this.filteridfunc}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.filterid == 3}>
              <i className="material-icons"  onClick={this.filteridfunc}>  arrow_drop_down</i>
              </Animate>
                           </div>
                        </div>
                        <div className="tituloArtic">
                        <div className="textPrint">   Nombre</div>
                            <div className="contFlechaFiltro">
                         
                         <Animate show={this.state.NombreFilter == 1}>
           <i className="material-icons filtroini"  onClick={this.filternombrefunc}>      panorama_fish_eye</i>
           </Animate>
           <Animate show={this.state.NombreFilter == 2}>
           <i className="material-icons"  onClick={this.filternombrefunc}>  arrow_drop_up</i>
           </Animate>
           <Animate show={this.state.NombreFilter == 3}>
           <i className="material-icons"  onClick={this.filternombrefunc}>  arrow_drop_down</i>
           </Animate>
                        </div>
                        </div>
                        <div className="precioArtic">
                        <div className="textPrint">        Precio </div>
                        <div className="contFlechaFiltro">
                         
                         <Animate show={this.state.filterprecio == 1}>
           <i className="material-icons filtroini"  onClick={this.filterprecio}>      panorama_fish_eye</i>
           </Animate>
           <Animate show={this.state.filterprecio == 2}>
           <i className="material-icons"  onClick={this.filterprecio}>  arrow_drop_up</i>
           </Animate>
           <Animate show={this.state.filterprecio == 3}>
           <i className="material-icons"  onClick={this.filterprecio}>  arrow_drop_down</i>
           </Animate>
                        </div>
                        </div>
                        <div className="existenciaArtic">
                        <div className="textPrint">     Existencia </div>
                        <div className="contFlechaFiltro">
                         
                         <Animate show={this.state.filterexistemcia == 1}>
           <i className="material-icons filtroini"  onClick={this.filterexistemcia}>      panorama_fish_eye</i>
           </Animate>
           <Animate show={this.state.filterexistemcia == 2}>
           <i className="material-icons"  onClick={this.filterexistemcia}>  arrow_drop_up</i>
           </Animate>
           <Animate show={this.state.filterexistemcia == 3}>
           <i className="material-icons"  onClick={this.filterexistemcia}>  arrow_drop_down</i>
           </Animate>
                        </div>
                        </div>
                        <div className="existenciaArtic centerti">
                            Img
                        </div>
                        <div className="existenciaArtic centerti">
                            Acc
                        </div>
                    </div>
                      {generadorArticulosList} 
                          </div>
                          </div>
                  </Animate>
                  </div>
                  <div className="jwFlexEnd">
               
                <Pagination
                        totalItemsCount={this.obtenerextension(this.props.state.RegContableReducer.Articulos)}
                        currentPage={this.state.currentPage}
                        perPage={this.state.perPage}
                        pagesToShow={this.state.pagesToShow}
                        onGoPage={this.goPage}
                        onPrevPage={this.onPrev}
                        onNextPage={this.onNext}
                    />
                </div>
                  <Animate show={this.state.edicion}>
        <EditArt 
        data={this.state.itemPoreditar}
         Flecharetro={()=>{this.setState({edicion:false})}}
         updateArt={()=>{ this.getdata()}} 
         User={this.getDataUser()} 
          /> 
      </Animate>
      <Animate show={this.state.editComb}>
                        <ModalEditCombo
                          Articulos={this.props.state.RegContableReducer.Articulos} 
                          data={this.state.itemPoreditar}
                          updateArt={()=>{ this.getdata()}} 
                          User={this.getDataUser()} 
                           Flecharetro={()=>{this.setState({editComb:false})}}    
                        />

                    </Animate >
                  <Animate show={this.state.edicionServ}>
        <EditServ
        data={this.state.itemPoreditar}
     
         Flecharetro={()=>{this.setState({edicionServ:false})}}
         updateArt={()=>{ this.getdata()}} 
         User={this.getDataUser()} 
 
         
         />
     

                  </Animate>
 <Animate show={this.state.addCompraFact}>
 <ModalAddFact
 
 updateArt={()=>{ this.getdata()}} 
 Flecharetro={()=>{this.setState({addCompraFact:false})}} 
 />
</Animate>
                  <Animate show={this.state.addCompra}>
                    <ModalAddCompra 
                                    User={this.getDataUser()} 
                                    Articulos={this.props.state.RegContableReducer.Articulos} 
                                    updateArt={()=>{ this.getdata()}} 
                                    Flecharetro={()=>{this.setState({addCompra:false})}} />
                    </Animate >
                    <Animate show={this.state.listadoCompras}>
                        <ModalListadoCompras 
                           Flecharetro={()=>{this.setState({listadoCompras:false})}}  
                           updateArt={()=>{ this.getdata()}}   
                        />

                    </Animate >
                    <Animate show={this.state.listadoVentas}>
                      
                    <ModalListadoVentas
                           Flecharetro={()=>{this.setState({listadoVentas:false})}}    
                           updateArt={()=>{ this.getdata()}}   
                       />
                    </Animate >
                    <Animate show={this.state.addMasive}>
                        <ModalAddMasive
                          updateArt={()=>{ this.getdata()}} 
                          User={this.getDataUser()} 
                           Flecharetro={()=>{this.setState({addMasive:false})}}    
                        />

                    </Animate >
                    <Animate show={this.state.addIndividual}>
                        <ModalAddIndividual
                          updateArt={()=>{ this.getdata()}} 
                          User={this.getDataUser()} 
                           Flecharetro={()=>{this.setState({addIndividual:false})}}    
                        />

                    </Animate >
                    <Animate show={this.state.addServ}>
                        <ModalAddServ
                          updateArt={()=>{ this.getdata()}} 
                          User={this.getDataUser()} 
                           Flecharetro={()=>{this.setState({addServ:false})}}    
                        />
                      </Animate >
                    <Animate show={this.state.DeleteArt}>
                    <ModalDeleteArt 
                    dataArtDel={this.state.dataArtDel}
                    Flecharetro={()=>{this.setState({DeleteArt:false})}} 
                    
                    />
                    </Animate >
                    <Animate show={this.state.addComb}>
                        <ModalAddCombo
                         Articulos={this.props.state.RegContableReducer.Articulos} 
                          updateArt={()=>{ this.getdata()}} 
                          User={this.getDataUser()} 
                           Flecharetro={()=>{this.setState({addComb:false})}}    
                        />

                    </Animate >
                    <Animate show={this.state.modalResearch}> 
                    <ModalResearch art={this.state.artResearch}  Flecharetro={()=>{this.setState({modalResearch:false})}}/>
                    </Animate >  
                    <Animate show={this.state.modalBarras}  >
<CodigoBarras Flecharetro={()=>{this.setState({modalBarras:false})}} />
                    </Animate>
                    <Animate show={this.state.modalReportInv}>
          <ModalReportInv  Flecharetro={()=>{this.setState({modalReportInv:false})}}/>
                    </Animate >  
                    <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
                    
    <style jsx >{`
    .MuiButtonGroup-contained {
      box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
  }
.buttonGroupStyle{
    display: flex;
    flex-flow: column;
}
.buttonGroupStyle p{
    margin-bottom:3px;
}
    i{
        cursor:pointer; 
    }
  .filtroini{
      font-size:15px;
      cursor:pointer;
  }

  .btnDropDowm p{
    margin-bottom:0px;
    margin-left:5px
  }
  .contbotones{
    display:flex;
    flex-wrap: wrap;
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
        font-size: 15px;
        display: flex;
    }
    .tituloArtic{
        width: 260px;  
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
    .contenedorArticulos{
        overflow-x: scroll;
        height: 580px;
        background: #ffffff7a;
        padding: 15px;
        border-radius: 10px;
        max-width: 800px;
}
    
   .contScroller{
    width: 100%;
    margin: 5px 0px;
   }
    .botonVisualite{
        padding: 6px;
        border-radius: 36px;
        display: flex;
        box-shadow: 0px 0px 0px 0px #1e214c;
        transition: 1s
      }
      .listActive{
        box-shadow: -1px -1px 2px 4px #1e214c;
    }
    .visualization{
        display: flex;
        width: 100%;
        
        justify-content: space-around;
    margin: 17px 0px;
    max-width: 800px;

    }
    .contBotonesgestion{
        display: flex;
        width: 100%;
        
        justify-content: space-around;
    
        flex-wrap: wrap;
    }

      
      .react-autosuggest__input:focus {
        outline: none;
      }
        .accion button{
            width: 30%;
            margin: 10px;
        }
        .accion input{
            width: 100%;
         
        }
        .accion{
            display: flex;
    flex-flow: column;
    width: 250px;
    /* border: 4px solid black; */
    padding: 10px;
    border-radius: 20px;
    background: white;
    align-items: center;
        }
        .acciones{
            margin: 10px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
        }
      
        .botonedit{
            display:flex;
            padding:4px;
            margin: 4px;
        }
        .botonedit p{
            margin:0px
        }
.mainREMO{
    margin-top: 10vh;
    display: flex;
    flex-flow: column;
  
    align-items: center;
}
.contedicion{
    margin-top:100px;

     
}
.imgFile{
           width:150px
         }
         .imgContenedor{
           display:flex;
           width:100%
         }
         .imgContenedor img{
           margin:5px;
         }
.parrafoD{margin: 0}
.maincontDetalles{
    display: flex;
    color: black;
    flex-flow: column;
    font-size: 20px;
    border:5px outset blue;
}
.contdetalle {
    display: flex;
}
.tituloD{
    width: 30%;
  
}
.valorD{
    width: 60%;

}
.ContPrimerGrupo{
    padding: 5px;
    margin: 8px;
    border-radius: 10px;
    box-shadow: 0px 2px 3px black;
}
.react-autosuggest__container{
    position: relative;
  border-radius: 6px;
  border: 2px solid #ffffff;
  box-shadow: -1px 5px 9px #418fe2;
  margin: 0px;
  margin-right: 20px;
  width: 20%;
  min-width: 254px;
  display: flex;
  justify-content: center;
  align-items: center;

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
  
  export default connect(mapStateToProps, null)(accessREMO);