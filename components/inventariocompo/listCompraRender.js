import React, { Component } from 'react'


class ListVenta extends Component {

    state={
        Precio_Compra:this.props.datos.Precio_Compra,
        Salida:false,
        cantidadCompra:1
    }
    channel2 = null;
    componentDidMount(){


       
    }
  

    handleChangeCantval=(e)=>{
  
       
        
    }

    handleChangePrecio=(e)=>{
        let item = this.props.datos
        this.setState({
        [e.target.name]:e.target.value
        }) 
        let newarr = {id:item.Eqid, value:parseFloat(e.target.value)}
        this.props.sendPrecio(newarr)
        }
        handleChangeCantidad=(e)=>{
            let item = this.props.datos
            this.setState({
            [e.target.name]:e.target.value
            })
            let newarr = {id:item.Eqid, cant:parseInt(e.target.value)}
            this.props.sendCantidad(newarr)
            }
render(){
 let cantidadErr= ""
 let precioErr= ""
if(this.props.Errorlist.length >0){
    for(let i = 0; i<this.props.Errorlist.length;i++){
        if(this.props.Errorlist[i].id == this.props.datos.Eqid && this.props.Errorlist[i].atri =="CantidadCompra" ){
            cantidadErr= "cantidadErr"
        }else if(this.props.Errorlist[i].id == this.props.datos.Eqid && this.props.Errorlist[i].atri =="Precio_Compra"){
            precioErr= "precioErr"
        }
    }
}

let item = this.props.datos
 let contSalida = this.state.Salida?"onSalida":""
console.log(item)
    return (   
         <div  id={this.props.datos.id}> 
               
                <div className={` contListaCompra ${contSalida}`}>
<div className="contTitulos2">

<div className="Articid">{item.Eqid} </div>
           <div className="Artic100Fpago">{item.Titulo} </div>
           <div className="Artic100Fpago">
           <input type="number" name="cantidadCompra" className={` inputCustom ${cantidadErr}`}placeholder={0} value={this.state.cantidadCompra} onChange={this.handleChangeCantidad}/>
             
             </div> 
             <div className="Artic100Fpago">
          $ <input type="number" name="Precio_Compra" className={` inputCustom ${precioErr}`}placeholder="0.00" value={this.state.Precio_Compra} onChange={this.handleChangePrecio  }/>
             
             </div>                
                    
  <div className="accClass">
  <button id={item.Eqid} name={item.Eqid}  className="btn btn-danger mybtn " onClick={(e)=>{
  

this.props.deleteItem(item.Eqid)
  }
      }><span className="material-icons">
delete
    </span>
    </button> 
    </div>
  
         </div>
       
         
           
               <style jsx>{`
               .cantidadErr{
                   border-bottom:1px solid red;
               }
               .precioErr{
                     border-bottom:1px solid red;
               }
               .contTitulos2{
                display:flex;
                font-size: 15px;
                justify-content: space-around;
                width: 100%;
            }
           
               .Artic100Fpago{
                width: 18%;  
                min-width:80px;
                max-width:100px;
                align-items: center;
                text-align:center;
            }
            .Articid{
                width: 10%;  
                min-width:20px;
                max-width:50px;
                align-items: center;
                text-align:center;
            }
            .contListaCompra{
                margin-top: 10px;
                border-top: 2px solid black;
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
      
     
     `}</style>
        </div>
        </div>
    )
}

}

export default ListVenta
