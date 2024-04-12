import React, { Component} from 'react'
import { Animate } from "react-animate-mount";
import {connect} from 'react-redux';
import ModalDeleteCat from "./modal-delete-cat"
import postal from 'postal';
import "../../styles/autosugest.css"
class Contacto extends Component {
   
state={
  categoriasSearcher:"",
  firstload:false,
  editmode:false,
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
catsearcher = React.createRef();
    componentDidMount(){
      this.channel1 = postal.channel();
  
      this.channel1.subscribe('desdeingreso', (data) => {
       
  this.setState({subCategoria:[]})
         
       });
      setTimeout(()=>{ 
        this.setState({firstload:true})
        document.getElementById('maincontcat').classList.add("entradaCat")
      
       }, 50);
        
        }
         
        onEditmode=()=>{
          
        }
        
        handleChangeSearcher=(e)=>{
         
            this.setState({
              [e.target.name]:e.target.value
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
       let data={
         estado:this.state,
         subcat:subc
       }
    setTimeout(()=>{        this.props.sendsubCatSelect(data)},500)
    document.getElementById('maincontcat').classList.remove("entradaCat")
   }}
   
   >
{subc}
  </div>))
 }


   if(this.props.Categorias){
    if(this.props.Categorias.length > 0){

      let catFiltradas = this.props.Categorias.filter(x=> x.sistemCat == false)
   
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
          document.getElementById('maincontcat').classList.remove("entradaCat")
        }
          
        }         
          else{
            this.setState({editmode:false,
              catSelect:{
                nombreCat:""
              }})
            this.props.editCat(cat)
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
       
  let searcherActive = this.state.Buscador?"searcherActive":
                  this.state.Buscador ==false && this.state.firstload?"entradaCat":""

   
        return ( 

         <div >

<div id="maincontcat" className={ `maincontactoCat ` } >
            <div className="contcontacto"  >
        
                <div className="headercontact cuentasheader">
             
              <div className="tituloventa">
                
            <p> Categorias  </p>
           
        </div>
     
     <div className="conticonos">
     <i className="material-icons" onClick={this.props.Addcat}>  add</i>
     <i className={`material-icons ${lapizctive}`}  onClick={()=>{this.setState({editmode:!this.state.editmode,subCategoria:[]})}}>  edit</i>
     <i className="material-icons" onClick={()=>{
      this.setState({Buscador:!this.state.Buscador})
      setTimeout(()=>{
       if( this.catsearcher.current){
        this.catsearcher.current.focus()
       }
       
      },500)
 
      }}>
       search
       </i>
     <i className="material-icons" onClick={()=>{
   setTimeout(()=>{   this.props.Flecharetro3()},500)
    
       
       document.getElementById('maincontcat').classList.remove("entradaCat")
       }}>  close</i>
    
     </div>
        </div>
<div className="generalContCats">
<Animate show={this.state.Buscador}>
     <div className="buscadorCats">
     <div className="react-autosuggest__container">
    <input autofocus ref={this.catsearcher} name="categoriasSearcher" className="react-autosuggest__input" onChange={this.handleChangeSearcher} placeholder="Busca tus Categorias" /> 
    
      </div>
     </div>
     </Animate>
     <div className="generalContData">
    
<div className="contcat">
 {generadorDeCategorias}
</div>

<div className={`subcatCont ${subCatActive}`}>
<div className=" contcontacto">
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
     
        </div>
        </div>
        <Animate show={this.state.ModalDeleteCat}>
         <ModalDeleteCat catDelete={this.state.Catdel} Flecharetro={()=>{this.setState({ModalDeleteCat:false})}}/>
          </Animate>
           <style>{`
         
           .barr{
            width: 20%;
            color: white;
       
            height: 100%;
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
            height: 100%;
            width: 80%;
          }
          .imgicono{
            max-width: 50px;
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
          .contcentrador{
            width: 100%;
            display: flex;
            flex-flow: column;
            background: #f1f1f1;
            max-width: 500px;
          }
          .contSubCate{
            margin-top:80px;
          }
        
       .subCatActive{
        top: 0px;
        transition:0.8s
       }
        
           .generalContCats{
            display: flex;
            justify-content: space-around;
            flex-flow: column;
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
        
           }
           .buscadorCats{
            display: flex;
    justify-content: center;

          }
           .contx{
            display: flex;
            justify-content: center;
            align-items: center;
           }
         
           .cuentasheader{
            margin-bottom: 16px;
            background: #00f1e6;
            color: #1f0707;
            border-radius: 10px 10px 0px 0px;
            position: fixed;
            width: 100%;
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
           .contcat{
            margin-top: 40px;
            width: 95%;
            padding: 5px;
            display: flex;
      
            flex-wrap: wrap;
            height: 100%;
            justify-content: space-around;
           
 
           }

.nombrem{
  font-weight: bold;
  font-size: 18px;
  margin: 0px;
  width: 100%;
  display: flex;
  align-items: center;
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
  align-items: center;
}
.bordeazul{
  box-shadow: -8px 7px 8px #031552;
  min-height: 35%;
}
.conticonos i{
  cursor:pointer;
}
           .conticonos{
            display: flex;
            width: 45%;
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
       .generalContData{
        margin-top:20px;
        display: flex;
    justify-content: space-around;

       }
          .option{
            width: 44%;
    box-shadow: 0px 3px 4px black;
    border-radius: 13px;
    padding-bottom: 5%;
    padding-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    height: 290px;
    word-break: break-word;
    cursor: pointer;
    flex-flow: column;
    display: flex;
    justify-content: space-around;
    margin: 14px 0px;
    border-bottom:2px inset blue;
    align-items: center;
          }
          .option img {
    width: 100%;
    max-width: 120px;
}
  
        .maincontactoCat{
          z-index: 1298;
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
       .contcontacto{
        margin-top:5px;
        border-radius: 15px;
        width: 98%;
         background-color: white;
         height: 100%;
         overflow: scroll;
         border-bottom: 5px solid black;
         overflow-x: hidden;
       }
       .marginador{
         margin: 0px 35px 15px 35px;
         color: black;
         
         display: flex;
         flex-flow: column;
         align-items: center;
   
       }
   
       .searcherActive{
        bottom:55%
       }  
    
     
   
       .tituloventa{
         display: flex;
         align-items: center;
         font-size: 30px;
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
          .entradaCat{
            top:0%
       
          }
          .catactive{
            color: #010306;
          transition: 0.5s;
            display: flex;
            justify-content: center;
            background-color: #c9fddb;
            min-height: 80px;
        }

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
       .cuentasheader{
       
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

const mapStateToProps = (state, props) =>  {
 

  const usuario = state.userReducer

  return {
  
 state
  }
};

export default connect(mapStateToProps, null)(Contacto);