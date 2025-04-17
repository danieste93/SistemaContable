import React,{useEffect,useRef, useState} from 'react'
import {Animate} from "react-animate-mount"
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';



const ArtRender = ({onResearch,datos, onEdicion, onDelete,userReducer}) => {
   
    let [value, setValue] = useState(1);
    let [verRastreador, setverRastreador] = useState(true);
    
    useEffect(() => {
console.log(datos)
        if(datos.Tipo !== "Producto"){
            setverRastreador(false)
        }

    })

    function isInt(value) {
        if (isNaN(value)) {
          return false;
        }
        var x = parseFloat(value);
        return (x | 0) === x;
      }
    let medida = datos.Medida == "Unidad"?"u":"g"
    let combProd =()=>{
        if(isInt(datos.Existencia)){
            return datos.Existencia +medida
        }else{
            return (datos.Existencia).toFixed(2) +medida
        }

        
    }
    let compPrecio =()=>{
        if(isInt(datos.Precio_Venta)){
            return datos.Precio_Venta
        }else{
            return (datos.Precio_Venta).toFixed(2) 
        }

        
    }
   


   let resultadoAdmin = false
   const printRef = useRef(null);
   const componentRef = useRef(null);

let resultadoTipo = datos.Tipo =="Producto"?combProd():<p style={{fontSize:"40px"}}>∞</p>;

    if(userReducer != ""){

      if(userReducer.update.usuario.user.Tipo == "administrador" || userReducer.update.usuario.user.Tipo == "tesorero"){
        resultadoAdmin = true
    }
    }

   
const printData =()=>{

}

let imgrender;
    if(datos.Imagen.length > 0){
        imgrender =   datos.Imagen[0]
    }
    else {
        imgrender = "./static/profile.jpg"
    }



    return (   
                 
                <div className="contRepuesto">
      
<div className="firstcont">
<div className={`maincontDetalles   `} >
         
         <div className="contdetalle eqIdart">
                    
                    <div className="valorD "> <p className="parrafoD eqIdart"> {datos.Eqid}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                   
                   <div className="valorD "> <p className="parrafoD doscincuenta"> {datos.Titulo}  </p></div>
                   
                
                   </div>
                   
         <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> ${compPrecio()}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {resultadoTipo}</p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> 
      
                    <img src={datos.Imagen[0]} className="miniimg" />
                     </p></div>
                    
                 
                    </div>
                    <div className="botoneralist ">
                    <ButtonGroup vertical >
                    <DropdownButton
        as={ButtonGroup}
        title=""
        id="bg-vertical-dropdown-1"
      >
        <Dropdown.Item eventKey="1" onClick={onEdicion}>
        <div  className=" btn-primary innerbutton" >
        Editar
            <span className="material-icons">
edit
</span></div></Dropdown.Item>

        <Dropdown.Item eventKey="3"  onClick={onDelete}>
            <div  className=" btn-danger innerbutton" >
        Borrar  <span className="material-icons">
delete
</span>
</div>
</Dropdown.Item>
<Animate show={verRastreador}>
<Dropdown.Item eventKey="4" onClick={onResearch}>
        <div  className=" btn-info innerbutton" >
        Rastrear
            <span className="material-icons">
manage_search
</span></div></Dropdown.Item>
</Animate>
      </DropdownButton>
      </ButtonGroup>
                    <Animate show={resultadoAdmin}>
                     
         </Animate>         
         </div>
  
         </div>
    </div>
    
               <style >{`
              
               
           
          
            
                .eqIdart{
                    width: 85px;  
            
                    display: flex;
                }
               .miniimg{
                width: 80px;
               }
                  .botoneralist{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    margin: 10px 0px;
                    width: 100px;
                   }

                .eqIdart{
                    width: 85px;  
                    word-break: break-all;
                }
                 .miscien{
                    width: 100px;   
                }
                  .contRepuesto{
                    display: inline-flex;
            padding: 5px;
           

            border-radius: 6px;
          border-bottom: 2px solid black;
            flex-wrap: wrap;
            justify-content: center;
        }
              
                          .contdetalle {
                            display: flex;
                            flex-wrap: wrap;
                    justify-content: space-between;
                    margin: 10px 0px;
                    border-right: 1px solid #3535352e;
                        }
                        .parrafoD{margin: 0}
                        .tituloD{
                      
                            font-weight:bolder;
                        margin-right:10px
                       
                        }
                        .valorD{
                        
                            word-break: break-all;
                           
                          
                        }
                   .mybtn{
                    padding: 4px;
                    margin: 3px;
                    height: 35px;
                   }
                   .botonera{
                       margin-top:15px;
                   }
                  
        .firstcont{
            width:100%;
            display: flex;
            flex-wrap: wrap;
    justify-content: space-around;
        }
        .ItemListView{
            display: inline-flex;
            padding: 5px;
            overflow: hidden;
            margin: 5px 10px;
            border-radius: 6px;
          border-bottom: 2px solid black;
            flex-wrap: wrap;
            justify-content: center;
}
        
.innerbutton{
    width: 90%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 6px;
    border-radius: 7px;
}
        .doscincuenta{
            width: 230px;  
            margin-right:30px; 
            word-break: break-word;
        }
        

        .maincontDetalles{
            display: flex;
            color: black;
         
            font-size: 20px;
       
           
        }
        .contImagen img{
            height: 250px;
       
   
    margin: auto;
       
      
        }
        .barrcont{
            display: flex;  
        }
        .contImagen {
            display: flex;
            align-items: center;
   margin-bottom:10px;
    border: 2px solid black;
    overflow: hidden;
      max-height: 500px;
    border-radius: 15px;
    max-width:300px;
    justify-content: center;
        }
     .Numcopias{
        width: 46px;
    margin-right: 23px;
    border-radius: 10px;
     }
     `}</style>
        </div>
  
    )
}

export default ArtRender
