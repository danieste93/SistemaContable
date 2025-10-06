import React, { Component} from 'react'
import { Animate } from "react-animate-mount";
import {connect} from 'react-redux';
import ModalDeleteCat from "../cuentascompo/modal-delete-cat"
import postal from 'postal';
import Edditcat from "./modal-editcatArt"
import Addcat from "./modal-addCatArt"
import "../../styles/autosugest.css"
class Contacto extends Component {
   
  state={
    categoriasSearcher:"",
    firstload:false,
    editmode:false,
    Edditcat:false,
    Addcat:false,
    subCategoria:[],
    ModalDeleteCat:false,
    Catdel:"",
    subcatCont:false,
    Buscador:false,
    catSelect:{
      nombreCat:""
    }
  }

channel1 = null;
  async  componentDidMount(){
 
     setTimeout(()=>{ 
        
        this.setState({Buscador:true})

       }, 800);
    this.channel1 = postal.channel();
    this.channel1.subscribe('desdeingreso', (data) => {
       
      this.setState({subCategoria:[]})
             
           });

     
      setTimeout(function(){ 
        
        document.getElementById('maincontcat').classList.add("entrada")
  
       }, 50);
        
        }

        handleKeyDown = (event) => {
          // Si el buscador ya está activo, no hace falta reactivarlo
          if (!this.state.Buscador) {
            this.setState({ Buscador: true });
          }
        };
        componentWillUnmount() {
        
        }
         
        onEditmode=()=>{
          
        }
        handleChangeSearcher=(e)=>{
         
          this.setState({
            categoriasSearcher:e.target.value
            })
        
      }   
      
            
      
      filtroCategorias=(e)=>{
       
        if(this.state.categoriasSearcher ==""){
          return(e)
        }else{
          let catFind = e.filter(cat => cat.nombreCat.toLowerCase()
          .includes(this.state.categoriasSearcher.toLowerCase()) )
          return(catFind)
        }
      }
     
          render () {

  
            let generadorDeCategorias =""
            let generadorDeSubCategorias
      
            let subCatActive  = this.state.subcatCont?"subCatActive":""
          let cuentactive= this.state.editmode?"bordeazul":""
          let lapizctive= this.state.editmode?"lapizctive":""
          if(this.state.subCategoria.length > 0){
            generadorDeSubCategorias = this.state.subCategoria.map((subc, i)=>(
             <div key={i} className="minisub"
             onClick={()=>{
              document.getElementById('maincontcat').classList.remove("entrada")
                 let data={
                   estado:this.state,
                   subcat:subc
                 }
              setTimeout(()=>{        this.props.sendsubCatSelect(data)},500)
              
             }}
             
             >
          {subc}
            </div>))
           }
          
          
           if(this.props.state.RegContableReducer.Categorias){
            if(this.props.state.RegContableReducer.Categorias.length > 0){
          
              let catFiltradas = this.props.state.RegContableReducer.Categorias.filter(x=> {
console.log(x)
return(x.sistemCat == false && x.tipocat == "Articulo")

              })
              
                generadorDeCategorias = this.filtroCategorias(catFiltradas).map((cat,i)=>{
          
                  let getid = "butonmapper-"+i
                  return(<div   id={getid} key={i} className={`catRender ${cuentactive}`}     
                                       >
                    <Animate show={this.state.editmode}>
                    <div className="contx" >
          <i className="material-icons close " onClick={()=>{
            
            this.setState({ModalDeleteCat:true, Catdel:cat})
          
          }}>  close</i>
          </div>
          </Animate>
          <div className="contlist" onClick={(e)=>{
                  if(this.state.editmode == false){
                   
                    setTimeout(()=>{        this.props.sendCatSelect(cat)},300)
                    if(document.getElementById('maincontcat')){
                    document.getElementById('maincontcat').classList.remove("entrada")
                  }
                    
                  }         
                    else{
                      this.setState({editmode:false,
                        catSelect:{
                          nombreCat:""
                        }})
                        this.setState({EditCat:true, catEditar:cat})
                    }
                  }
                  }>
                  
                      <img src={cat.urlIcono} className='imgicono'  />
                  <p className="nombrem">{cat.nombreCat}      </p>
             
                 
                  </div>
                  {cat.subCategoria.length > 0?<div className="barr" onClick={()=>{
                      this.setState({subcatCont:true, subCategoria:cat.subCategoria, catSelect:cat})
                      
                  }}> {'>'}</div>:""}
                </div>)
               
              
             
              
              
              })
              }
                else{
             
                  generadorDeCategorias =   <div>Aun no tienes categorias creadas</div>
               
                        }
                 
                      }
                 

       
  
   
        return ( 

         <div >

<div id="maincontcat" className="maincontcat" >
            <div className="contcontactoCA"  >
        
                <div className="headercontact cuentasheader">
             
              <div className="tituloventa">
                
              <p> Art & Serv </p>
           
        </div>

        <div className="conticonos">
        <i className="material-icons" onClick={()=>{this.setState({Addcat:true})}}>  add</i>
     <i className={`material-icons ${lapizctive}`}  onClick={()=>{this.setState({editmode:!this.state.editmode,subCategoria:[]})}}>  edit</i>
     <i className="material-icons" onClick={()=>{
      this.setState({Buscador:!this.state.Buscador})
   
      }}>
       search
       </i>
     <i className="material-icons" onClick={()=>{
   setTimeout(()=>{   this.props.Flecharetro3()},500)
    
       
       document.getElementById('maincontcat').classList.remove("entrada")
       }}>  close</i>
    
     </div>
        </div>
        <div className="contcuentasCx">
           <div>
        <Animate show={this.state.Buscador}>
     <div className="buscadorCuentas">
     <div className="react-autosuggest__container">
    <input autoFocus name="cuentasSearcher" className="react-autosuggest__input" onChange={this.handleChangeSearcher}
    
    placeholder="Busca tus Categorias" /> 
    
      </div>
     </div>
     </Animate>
     </div>
<div className="contcuentas">
{generadorDeCategorias}
</div>
</div>
<div className={`subcatCont ${subCatActive}`}>
<div className=" contcontactoCASub">
<div className="headercontact cuentasheader">
<div className="tituloventa">
                
                <p> SubCategorias  </p>
               
            </div>
            <div className="conticonos">
            <i className="material-icons" onClick={()=>{
this.setState({subcatCont:false})

       
      
       }}>  close</i>
            </div>
            </div>
            <div className='contSubCate'>
{generadorDeSubCategorias}
</div>
</div>
</div>
     
        </div>
        </div>
        <Animate show={this.state.ModalDeleteCat}>
         <ModalDeleteCat catDelete={this.state.Catdel} Flecharetro={()=>{this.setState({ModalDeleteCat:false})}}/>
          </Animate>
          <Animate show={this.state.Addcat}>
        < Addcat 
      
        
        Flecharetro4={
         
         ()=>{
          
          this.setState({Addcat:false})}
        } 
    
                />
        </Animate >


        <Animate show={this.state.EditCat}>
        < Edditcat   Flecharetro4={
              ()=>{
         
          this.setState({EditCat:false})}
        } 
          catToEdit={this.state.catEditar}
                />
        </Animate >
           <style>{`
          

          .buscadorCuentas{
            display: flex;
    justify-content: center;
    margin-bottom: 15px;
          }
           .lapizctive{
            color: white;
           }
           .close{
            color: red;
            border: 2px outset red;
            border-radius: 50%;
            margin-top: 5px;
            cursor:pointer;
            font-size: 15px;
           }

           .contx{
            display: flex;
          
            align-items: center;
            justify-content: flex-end;
            margin-right: 5px;
           }
         
           .cuentasheader{
            margin-bottom: 16px;
            background: #00f1e6;
            color: #1f0707;
            border-radius: 10px 10px 0px 0px;
           }
           .tipom{
            font-size: 12px;
     font-style: italic;
     margin-bottom: 0;
           }
           .tipomcont{
            background: #0061f1;
            color: white;
            border-radius:  0px 0px 11px 10px;
           }
           .contcuentas{
        
            display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    align-items: center;
           }

.nombrem{
     font-weight: bold;
    font-size: 13px;
    margin: 0px;
    width: 100%;
    display: flex;
    align-items: center;
    word-break: break-word;
    justify-content: space-around;
}



.catRender{
  box-shadow: 1px 0px 4px black;
  border-radius: 10px;
  width: 100%;
  display: flex;
  height: auto;
  text-align: center;
  /* flex-flow: column; */
  max-width: 150px;
  margin: 5px 0px;
  transition: 0.5s;
  justify-content: center;
  cursor: pointer;
  min-height: 100px;

}
.bordeazul{
  box-shadow: -8px 7px 8px #031552;
}
.conticonos i{
  cursor:pointer;
}
           .conticonos{
            display: flex;
            width: 60%;
            justify-content: space-around;
            align-items: center;
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
  


   .contDatosC{
     display:flex;
     width: 100%;
   }

.cDc1{
  width:30%;
  text-align: right;
  
}
             .contTituloCont1{
              margin-top:10px;
               display:flex;
               display: flex;
    font-size: 25px;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-align: center;
    border: 1px solid blue;
    border-radius: 20px;
             }
             .contTituloCont1 p{
               margin-top:5px;
               margin-bottom:5px;
             }


           .headercontact {

            display:flex;
            justify-content: space-between

           }


           .barr{
            width: 20%;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border-radius: 0px 9px 9px 0px;
            background: #87b1dd;
           }
             .contlist{
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 5px;
            flex-flow: column;
          
            width: 80%;
          }
      
          
.imgicono{
            max-width: 50px;
          }



        
        .maincontcat{
          z-index: 1300;
         width: 100vw;
         height: 50%;
         min-height: 350px;
         background-color: rgb(0 0 0 / 85%);
         left:0px;
         position: fixed;
         top: -50%;
         display: flex;
         justify-content: center;
         align-items: flex-start;
         transition: 0.6s ;
         overflow: hidden;
         border-bottom: 3px solid black
       }
       .contcontactoCA{
         margin-top:5px;
        border-radius: 15px;
        width: 98%;
         background-color: white;
         height: 100%;
       
         border-bottom: 5px solid black;
       }
          .contcontactoCASub{
         margin-top:5px;
        border-radius: 15px;
        width: 95%;
        paddding:5px;
               background-color: white;
         height: 100%;
       
     }
          .contcuentasCx{
            padding: 5px;
            display: flex;
            flex-flow:column;
    height: 78%;

           }
         .contSubCate{
         background-color: white;
         }
       .marginador{
         margin: 0px 35px 15px 35px;
         color: black;
         
         display: flex;
         flex-flow: column;
         align-items: center;
   
       }
   
      
       .cDc2x{


        display: flex;
        align-items: center;
        flex-flow: column;
        justify-content: center;
        width: 15px;
 

        cursor:pointer;
      } 

   
       .tituloventa{
         display: flex;
         align-items: center;
         font-size: 25px;
         font-weight: bolder;
         text-align: center;
         justify-content: space-around;
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
          .entrada{
            top:0%}
          .react-autosuggest__container {
            position: relative;
            border-radius: 6px;
            border: 2px solid #ffffff;
            box-shadow: -1px 5px 9px #418fe2;
            margin: 0px;
        
        }
                .minisub{
            text-align: center;
            border: 1px solid black;
            border-radius: 7px;
            padding: 4px;
            margin: 5px 0px;
            cursor:pointer;
           }
     
            .subcatCont {
              width: 100%;
              justify-content: center;
              display: flex;
         
            
              border-radius: 7px;
             
              overflow: scroll;
              position: absolute;
              top: -300%;
              left: 0px;
              height: 100%;
           
              margin-top: 62px;
         
              transition:1s
          
          }
               .subCatActive{
        top: -15px;
        transition:0.8s
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
         .contcontactoCA{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontactoCA{
       
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
    regC,
    state
  }
};

export default connect(mapStateToProps, null)(Contacto);