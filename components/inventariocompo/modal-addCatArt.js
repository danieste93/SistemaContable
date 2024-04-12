import React, { Component } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Animate } from "react-animate-mount";
import FilledInput from '@material-ui/core/FilledInput';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {connect} from 'react-redux';
import SelectIcons from "../cuentascompo/modal-select-icons"
import {addcat} from "../../reduxstore/actions/regcont"
class Contacto extends Component {
   state={
   
   loading:false,
    subArr : [],
    tipocat:"Articulo",
    newcat:"",
    nombreCat:"",
    errSub:false,
    urlIcono:"/iconscuentas/bolsa.png",
    selectIcon:false,
   }

    componentDidMount(){
  

     
      setTimeout(function(){ 

        document.getElementById('mainaddc').classList.add("entradaaddc")
  
       }, 200);

 
 

      
      }
   


      
    
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }
        
        comprobador=()=>{
          if(this.state.loading == false){
            this.setState({loading:true})
            let vals = {...this.state}
            if(this.state.newcat.trim() != ""){
              let minicat = this.state.newcat.trim()
              vals.subArr.push(minicat)
            }
          if(this.state.nombreCat != ""){
            this.setState({err1:false})
            let datos = {
              valores:vals,
              Usuario:{DBname:this.props.state.userReducer.update.usuario.user.DBname}         
            }
            let lol = JSON.stringify(datos)
            
            let url = "/cuentas/addcat"   
        fetch(url, {
          method: 'PUT', // or 'PUT'
          body: lol, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          console.log('AddCat:', response)
          if(response.message=="error al registrar"){
            alert("Error en el sistema, vuelva a intentarlo en unos minutos ")
          }
          else{
          const categoria = response.categoria
    this.props.dispatch(addcat({categoria}))
         
          
          this.Onsalida()  
        }
        });
          }
          else{
            this.setState({err1:true})
          
          }
       
        }
      
        }

        Onsalida=()=>{
          document.getElementById('mainaddc').classList.remove("entradaaddc")
          setTimeout(()=>{ 
            this.props.Flecharetro4()
          }, 500);
        }
        handlerepChange=(e)=>{
   
          this.setState({tipocat:e.target.value})
        
        }
     AgregarNuevaSub =(e)=>{
      console.log(this.state)
       if(this.state.newcat != "" &&this.state.newcat != " " && this.state.newcat != "  "){
       let statearr = this.state.subArr

    statearr.push(this.state.newcat.trim())

    this.setState({subArr: statearr,newcat: "",errSub:false})
  }else{
    this.setState({errSub:true})
  }
     }
     removesubcat=(e)=>{
      let statearr = this.state.subArr
      var index = statearr.indexOf(e);
        statearr.splice(index, 1);
      this.setState({subArr: statearr})
     }

    render () {




      let generadorsub = this.state.subArr.map((sub,i)=>{

        return(<div key={i} className="mincat">
          {sub}
          <i className="material-icons" onClick={()=>{
            this.removesubcat(sub)
 
}}>  close</i>
    <style>{`
           .mincat{
            margin: 5px;
            border: 2px solid #1673ff;
            border-radius: 23px;
            padding: 7px;
            display: flex;
           }

           .mincat i{
            font-size: 20px;
            margin-left: 12px;
            color: red;
           }



           `}
        

</style >


        </div> )
      })
 
console.log(this.state)
   
        return ( 

         <div >

<div id="mainaddc"className="maincontacto" >
            <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Agregar Nueva Categoria de Articulo</p>
           
        </div>
     
        </div>


<div className="contPrin">


          <div className="contDatosX">    
          <div className="grupoDatos">
        <div className="cDc1x">
              <p style={{fontWeight:"bolder"}}>  Tipo de Categoria  </p>
            
              </div>
              <div id =""className="cDc2" >
        
              <select className="selectin" value={this.state.tipocat}  onChange={this.handlerepChange} > 
     <option value="Ingreso" > Articulo </option>

          </select>
            
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}> Nombre  </p>
            
              </div>
              <div id =""className="cDc2" >
            
        
        
              <TextField
               error={this.state.err1}
                fullWidth name="nombreCat" onChange={this.handleChangeGeneral} id="standard-basic" label="" />
            
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1 ">
              <p style={{fontWeight:"bolder"}}>  Icono  </p>
            
              </div>
              <div id =""className="cDc2 customcd2 " >
              <div id =""className="contIcono " onClick={()=>{this.setState({selectIcon:true})}} >
                
           <img className='iconoCuenta jwPointer' src={this.state.urlIcono} />
            
              </div>
              </div>
              </div>
           </div>
     
           <div className="contDatosX">    
           <p className="tituloArt" >Subcategorias</p>
        
       <div className="contaddtipe">
        <TextField  
        error={this.state.errSub}
        fullWidth 
        name="newcat" 
        onChange={this.handleChangeGeneral}
         id="standard-basic" 
         label="Agrega una Subcategoria"
    value={this.state.newcat}
          />

       <div className="borderok">
        <i className="material-icons jwPointer" onClick={this.AgregarNuevaSub}>  add</i>
        </div>
        </div>

        <div className="contsubs">
      
          {  generadorsub}
        </div>

           </div>

     
           <div className="jwContCenter">
  <button  onClick={this.comprobador} id="botonadd"  className="botoncontact ">Agregar</button>
</div>
</div>
        </div>
    
    
    
        </div>
        <Animate show={this.state.selectIcon}>
<SelectIcons 
 Flecharetro={()=>{this.setState({selectIcon:false})}} 
 sendUrl={(url)=>{this.setState({urlIcono:url,selectIcon:false })}} 
/>
    </Animate>
           <style jsx>{`
           .selectin{
            width: 100%;
            padding:5px;
           }
           .mincat{
            margin: 5px;
            border: 2px solid #1673ff;
            border-radius: 23px;
            padding: 7px;
            display: flex;
           }
           .contsubs{
            margin-top: 20px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
           }
               .contaddtipe{
                display: flex;
                align-items: flex-end;
               }
            .borderok{
              box-shadow: inset 0px 3px 5px green;
              border-radius: 50%;
              padding: 7px;
              text-align: center;
              display: flex;
          
              margin-left: 20px;
            }

          .contPrin{
            margin-top:5%;
         
    display: flex;
    flex-flow: column;
    justify-content: space-around;
          }

           .botoncontact{
      
            height: 100%;
            margin-left: 15px;
          
            font-size: 2vmax;
            padding: 0 16px;
            border-radius: 10px;
            background-color: #0267ffeb;
            box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
              0 2px 2px 0 rgba(0, 0, 0, 0.14),
              0 1px 5px 0 rgba(0, 0, 0, 0.12);
            color: white;
            transition: background-color 15ms linear,
              box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
          
            line-height: 2.25rem;
            font-family: Roboto, sans-serif;
           
            font-weight: 500;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            border: none;
            width: 60%;
          max-width:300px;
              box-shadow: -4px 6px 8px #635c5cc4;
          }
           .errequerido{
            border-color: red;

           }
           
         

.i3D{
  font-size: 35px;
    margin-left: 6px;
    /* border: 1px inset #212529; */
    border-radius: 50%;
    box-shadow: inset 1px 1px 3px;
    padding: 2px;
}
           .cDc1x{
            width: 75%;
            display: flex;
            align-items: center;
           }
             .grupoDatos{
              display: flex;
              justify-content: space-around;
              margin-top: 15px;
              width: 100%;
             }
          
             
         
   
 
   .cDc2{
    margin-left:10px;
    width:60%;
    border-bottom: 3px double grey;
   display: flex;
   align-items: flex-end;
   transition:1s  easy-out

  }
  
  
  .cDc2x{
    margin-left:10px;

    width:15%;
   display: flex;
   align-items: center;
   trasition:1s  easy-out
   flex-flow: column;
   flex-flow: column;
   justify-content: center;
  }

  .cdc2active2{
   border-bottom: 5px double green;
  }
  .cDc2 p{
   margin:0px;

 }
 .cDc2x p{
  margin:0px;

}   
.cDc1x p{
  margin:0px;

} 
  

 .contDatosC{
  display:flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  box-shadow: -3px 6px 8px #000000c4;
  padding:20px 10px;
  border-radius: 5px;
  font-size: 15px;
  flex-flow: column;
}
.contDatosX{
  margin-top:15px;
  display:flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  box-shadow: -3px 6px 8px #000000c4;
  padding:20px 10px;
  border-radius: 5px;
  font-size: 15px;
  flex-flow: column;
}

   .cDc1{

    width: 30%;
    display: flex;
    align-items: flex-end;
    
  }
  
 
  .cDc1 p{
  
  margin:0px;
    
  }
        
  .contIcono{
    background: whitesmoke;
    border-radius: 50%;
    padding: 5px;
    display: flex;
    justify-content: center;
    border-bottom: 4px solid black;
    height: 80px;
    margin-top: 10px;
   } 
.iconoCuenta{
  width: 95%;
    border-radius: 50%;
}
           .headercontact {

            display:flex;
            justify-content: space-around;

           }

           .customcd2{
            border-bottom: none;
            justify-content: center;
          }

      
  
        
        .maincontacto{
          z-index: 1301;
         width: 100vw;
         height: 100vh;
         background: #00f1e6;
         left: -100%;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         transition: 0.5s;
         
       }

       .entradaaddc{
        left: 0%;
       }


       .contcontacto{
        border-radius: 30px;
        height: 98%;
        width: 96%;
         background-color: white;
         padding: 15px;
         overflow: scroll;
         overflow-x: hidden;
       }
     
   
      
       .alinemiento{
        align-items: center;
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

       
      
        
             @media only screen and (max-width: 320px) { 
            
           
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

const mapStateToProps = (state, props) =>  {
 

  const usuario = state.userReducer

  return {
  
 state
  }
};

export default connect(mapStateToProps, null)(Contacto);
