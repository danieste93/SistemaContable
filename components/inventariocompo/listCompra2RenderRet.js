import React, { Component } from 'react'
import {Animate} from "react-animate-mount" 

class ListVenta extends Component {

    state={
      
    }
    channel2 = null;
    componentDidMount(){
  
    }
  
   
            
render(){
    
 let cantidadErr= ""
 let precioErr= ""
 let precioAltErr= ""
 let fechaexpErr= ""


let item = this.props.datos
console.log(item)
 let contSalida = this.state.Salida?"onSalida":""

    return (  
         
         <div  id={this.props.datos.id}> 
              <div  className="contlist"> 
                <div className={` contListaCompra `}>
<div className="contTitulos2">

           <div className="Artic100Fpago">{item.baseImponible[0]} </div>
              <div className="Artic100Fpago">{item.codigo[0]} </div>
                 <div className="Artic100Fpago">{item.porcentajeRetener[0]} </div>
                     <div className="Artic100Fpago">{item.valorRetenido[0]} </div>
       
  
         </div>
       
         
           
        
        </div>
        <div className="caducablecont">
     
        </div>
        </div>
        <style jsx>{`
               
               .precioErr{
                     border-bottom:2px solid red;
               }
               .contTitulos2{
                display:flex;
                font-size: 15px;
                justify-content: space-around;
                width: 100%;
            }
           
               .Artic100Fpago{
                width: 120px;
                align-items: center;
                text-align:center;
            }
            .Articid{
                width: 10%;  
                min-width:20px;
                max-width:50px;
                align-items: center;
                text-align:center;
                word-break: break-all;
            }
            .contListaCompra{
             
                padding-top: 10px;   
                opacity:1;
                transition:1s
            }
            .onSalida{
                opacity:0;
            }
               .inputCustom{   
                   width: 60%;           
                border-radius: 11px;
                transition:1s;
                padding: 4px;}
               .moneycont{
                   display:flex;
               }
               .miscien{
                width: 80%;
                margin-left:10%; 
 
            }
            .Numeral{
                width: 20px;  
            }
          
            .tituloFpago{
                width: 23%;    
            }
            .accClass{
                width:10%;
                display: flex;
    justify-content: center;
            }
          
                          .contdetalle {
                            display: flex;
                            flex-wrap: wrap;
                    justify-content: space-between;
                    margin: 10px 0px;
                        }
                      
                        .tituloD{
                      
                            font-weight:bolder;
                        margin-right:10px
                       
                        }
                 
                        .buttonTotal{ 
                            padding: 9px;
                     border-radius: 20px;
                     background: white;
                     transition:1s;
                            }
                            .buttonactive{
                             background: lightskyblue;
                            }
                   .mybtn{
                    padding: 4px;
                    margin: 3px;
                    height: 35px;
                 
                   }
                 

                   }
                   .ArticRes{
                    width: 23%;  
                    min-width:95px;
                    max-width:150px;
                    justify-content: center;
                    word-break: break-all;
                }
        .firstcont{
            width:100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
        .FlexCenter{
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-bottom: 3px;
        }
        .contLista{
            display: inline-flex;
 
    overflow: hidden;
  
    border-radius: 6px;
  border-bottom: 2px solid black;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
}
        .parrafoD {
            margin-bottom:1px;
        }
  

        .maincontDetalles{
            display: flex;
            color: black;
           
            font-size: 20px;
            width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
}
       
           
        }
        .contImagen img{
            height: 250px;
       
   
    margin: auto;
       
      
        }
        .cantidadErr{
            border-bottom:2px solid red;
        }
        .caducablecont{
            width: 100%;
    max-width: 300px;
        }
        .FechaInput{
            border: 1px solid;
            padding: 10px;
            border-radius: 15px;
            text-align: center;
            margin-top: 13px;
        }
        .contlist{
            display: flex;
            flex-flow: column;
            align-items: center;
        }
     
     `}</style>
        </div>
    )
}

}

export default ListVenta
