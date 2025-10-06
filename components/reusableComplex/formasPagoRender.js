import React, { Component } from 'react'
import postal from 'postal';

class ListVenta extends Component {

    state={
        tipoPrecio:"Venta",
        CantidadArts:1,
        precioRender:0
    }
    channel2 = null;
    componentDidMount(){
       
        this.channel2 = postal.channel();

        if(this.props.datos.Cantidad){
            this.setState({Cantidadval:  this.props.datos.Cantidad})
        }
    }
   componentWillReceiveProps(){
        if(this.props.datos.Cantidad){
            this.setState({Cantidadval:  this.props.datos.Cantidad})
        }
    }


  

    handleChangeCantval=(e)=>{
  
        this.setState({Cantidadval:e.target.value})
       
        let dataKey = {Cantidad:e.target.value, Id:this.props.datos.Id}
        this.props.sendPrecio(dataKey)
        
    }

    handleDeleteforma=()=>{

        this.props.deleteForma(this.props.datos)
    }
   
render(){
 

 
 
    return (   
         <div > 
                
                <div className="contRepuesto">
<div className="firstcont">

         <div className="maincontDetalles">
         
         <div className="contdetalle ">
                    
                    <div className="valorD "> <p className="parrafoD Numeral"> {this.props.index + 1}  </p></div>
                    
                 
                    </div>

                 <div className="contdetalle ArticRes">
                   
                   <div className="valorD "> <p className="parrafoD "> {this.props.datos.Tipo}  </p></div>
                   
                
                   </div>
              <div className="contdetalle ArticRes">
                    
                    <div className="valorD "> <p className="parrafoD "> 
                    
            {this.props.datos.Cuenta.NombreC}
                      </p></div>
                    
                 
                    </div>  
         <div className="contdetalle ArticRes">
                    
                    <div className="valorD "> <p className="parrafoD "> 
                    <span> $
                 <input type='number' className='customValDin' name="Cantidadval" value={this.state.Cantidadval} onChange={this.handleChangeCantval} />
                 </span>
              
                      </p></div>
                    
                 
                    </div>
    
                    <div className="botoneralist ">
                    <button  className="btn btn-primary mybtn " onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        let arr={datos:this.props.datos,Id:this.props.datos.Id }
                        this.props.editFormPago(arr)
 
                        }}><span className="material-icons">
edit
</span></button>
        <button  className="btn btn-danger mybtn " onClick={this.handleDeleteforma}><span className="material-icons">
delete
</span></button>

         </div>     
  
         </div>
  
         </div>
       
         
           
               <style jsx>{`
               .customValDin{    width: 65%;
           
                border-radius: 11px;
                padding: 4px;
              
                margin-left: 5px; 
            }
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
                   .botoneralist{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    margin: 10px 0px;
                    width: 10%;
                   }
                   .valorD{
                       
                       display: flex;
    justify-content: center;
    align-items: center;
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
        .contRepuesto{
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
