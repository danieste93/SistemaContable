import React, { Component } from 'react'
import {Animate} from "react-animate-mount"
import {connect} from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';

class Contacto extends Component {
   
state={
  Ingreso:true,
  Gasto:false,
  checkedB:false,
 Categorias:[],
 subCategorias: [],
}
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainSelectCat').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
   
      Onsalida=()=>{
        document.getElementById('mainSelectCat').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      handleChan=(e)=>{
        console.log(e.target)
      }
     
      handleChangeCatMain = (event) => {
 
        if (this.state.Categorias.includes(event.target.name)){
          let elimnado = this.state.Categorias.filter(x => x !=event.target.name )
          this.setState({Categorias: elimnado });
        }
        else{
          let nuevoarr = this.state.Categorias.concat(event.target.name)
          this.setState({Categorias: nuevoarr });
        }
    
      };
      handleChangesubCatMain = (event) => {
        console.log(event.target)
        if (this.state.subCategorias.includes(event.target.name)){
          let elimnado = this.state.subCategorias.filter(x => x != event.target.name )
          console.log(elimnado)
          this.setState({subCategorias: elimnado });
        }
        else{
          let nuevoarr = this.state.subCategorias.concat(event.target.name)
          this.setState({subCategorias: nuevoarr });
        }
      };
    render () {
let misCating =[]
let misCatgas=[]
   console.log(this.state)
   if(this.props.regC.Categorias.length){
    misCating= this.props.regC.Categorias.filter(cat => cat.tipocat ==="Ingreso")
    misCatgas= this.props.regC.Categorias.filter(cat => cat.tipocat ==="Gasto")
    
    
   }
   let catingRender =""
   let catgasRender =""
   if(misCating.length >0){
     console.log("dentrodecating")
    
    catingRender = misCating.map((cat,i)=>{
let subarr = ""
if(cat.subCategoria.length > 0){
  subarr = cat.subCategoria.map((sub,i)=>(
    <div className="subarr" key={i}>
             <span>{sub}</span>
            <Checkbox
          name={sub}
          onChange={this.handleChangesubCatMain}
        color="primary"
      />
    </div>
  ))

}
      return(
        <div className="contCat" key={i}>
          <div className="subContCat">
            <span style={{fontWeight:"bolder"}}>{cat.nombreCat}</span>
            <Checkbox
      name={cat.nombreCat}
      onChange={this.handleChangeCatMain}
      color="primary"
      />
          </div>
          <div className="subCatCont">
            {subarr}
          </div>
        </div>
      )
    })
   }

   if(misCatgas.length >0){
  
   catgasRender = misCatgas.map((cat,i)=>{
let subarr = ""
if(cat.subCategoria.length > 0){
 subarr = cat.subCategoria.map((sub,i)=>(
   <div className="subarr" key={i}>
            <span>{sub}</span>
           <Checkbox
         name={sub}
      
       onChange={this.handleChangesubCatMain}
       color="secondary"
     />
   </div>
 ))

}
     return(
       <div className="contCat" key={i}>
         <div className="subContCat">
           <span style={{fontWeight:"bolder"}}>{cat.nombreCat}</span>
           <Checkbox
      name={cat.nombreCat}
 
        onChange={this.handleChangeCatMain}
        color="secondary"
      />
         </div>
         <div className="subCatCont">
           {subarr}
         </div>
       </div>
     )
   })
  }

   let ingActive = this.state.Ingreso?"ingActive":""
   let gasActive = this.state.Gasto?"gasActive":""
        return ( 

         <div >

<div className="maincontacto" id="mainSelectCat" >
            <div className="contcontactoSC"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Categorias </p>
           
        </div>
     
        </div>
<div className="inggasMainCont ">
  <div className="inggasCont">
          <span className={`base ${ingActive} `} onClick={()=>{this.setState({Ingreso:true, Gasto:false, Categorias:[], subCategorias:[]})}}>Ingreso</span>
          <span>|</span>
          <span className={`base ${gasActive} `} onClick={()=>{this.setState({Gasto:true, Ingreso:false, Categorias:[], subCategorias:[]})}} >Gasto</span>
  </div>
</div>

<div className="conCategorias">
  <Animate show={this.state.Ingreso}>

{catingRender}
  </Animate>
  <Animate show={this.state.Gasto}>

  { catgasRender}
  </Animate>

</div>

<div className="contBotonesDuales">
  <button className="botonesDuales btn-danger" onClick={ this.Onsalida }>
    Cancelar 
    </button>
    <button className="botonesDuales btn-success"onClick={()=>{
      this.Onsalida()
    this.props.setCat(this.state)
     
      
      }}>
    OK
    </button>
</div>


     
        </div>
        </div>
           <style >{`
           .conCategorias{
            overflow-y: scroll;
            height: 60vh;
           }
           .botonesDuales{border-radius: 15px;
            padding: 7px;
            border-bottom: 4px solid black;}
          
                        
          .contBotonesDuales{ display: flex;
            justify-content: space-around;
            width: 80%;
            margin: 20px;}
           .contCat{
            display: flex;
            margin: 10px 0px;
            flex-flow: column;
            align-items: center;
            width: 80%;
            margin-left: 10%;
            background: whitesmoke;
            padding: 10px;
            border-radius: 20px;
           }
           .subContCat{
            width: 80%;
            justify-content: space-between;
            display: flex;
            align-items: center;
            height: 30px;
           }
           .subarr{
            width: 80%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 20%;
            height: 25px;
           }
           .subCatCont{
            width: 80%;
            flex-flow: column;
            justify-content: space-between;
            display: flex;
            align-items: center;
            overflow: scroll;
           }
             .inggasMainCont{  display: flex;
              justify-content: center;
          
              align-items: center;} 
           
.inggasCont{
  display: flex;
    width: 63%;
    justify-content: space-around;
    padding: 5px;
    font-size: 24px;
    border-bottom: 2px solid grey;
    border-radius: 11px;
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
  
.ingActive{
  font-size:26px;
  color: #3f51b5;
    font-weight: bolder;
}
.gasActive{
  font-size:26px;
  color: red;
    font-weight: bolder;
}
.base{
  transition:1s
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
       .contcontactoSC{
        border-radius: 30px;
     
         width: 90%;
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
         .contcontactoSC{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontactoSC{
       
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
  let regC =   state.RegContableReducer
  return {
    regC
  }
};

export default connect(mapStateToProps, null)(Contacto);