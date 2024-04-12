import React, { Component } from 'react'


class ListVenta extends Component {

    state={
      
      
    }
    componentDidMount(){
   





    }
    componentWillReceiveProps(){
  
    }
    componentWillUnmount() {
        // remove rule when it is not needed
     
    }
    facturar=()=>{
        if(this.props.datos.Facturacion){
        return <span className="material-icons " style={{color:"green"}}>
       done
        </span>
    }else{
        return(
<span className="material-icons">
error
</span>)
    }

    }
   
render(){
    

 
 
    return (   
    
                
                <div className="contSellers">

         
         <div className=" valCampo">  
                    
                    <div className=" "> <p className=""> {this.props.datos.Usuario}  </p></div>
                    
                 
                    </div>
                    <div className=" valCampo setOverflowx">  
                    
                    <div className=" "> <p className=""> {this.props.datos.Correo}  </p></div>
                    
                 
                    </div>
                    <div className=" valCampo ">  
                    
                    <div className=" "> <p className=""> {this.props.datos.Tipo}  </p></div>
                    
                 
                    </div>
                    <div className=" valCampo">  
                    
                    
                        {this.facturar()}
                 
                    </div>
                 
              
               
              
                   
                    <div className=" valCampo accClass ">
        
<button  className="btn btn-info mybtn " onClick={()=>{this.props.edititem(this.props.datos)}}><span className="material-icons">
edit
</span></button>
<button  className="btn btn-danger mybtn " onClick={()=>{this.props.deleteitem(this.props.datos)}}><span className="material-icons">
delete
</span></button>

         </div>     
  
    
      
       
       
         
           
               <style jsx>{`
              
            .newstyle{
                font-size:20px;
            }
               .tipoprecio{
                   border-radius:10px;
               }
               .moneycont{
                   display:flex;
                   font-size:20px;
                   align-items: center;
               }
               .moneycont input{
              
                font-size:20px;
                margin-left:5px;
            }
               .miscien{
                width: 80%;

 
            }
            .Numeral{
                width: 15px;  
          
            }
          
            .docientos{
                width: 90%;
                margin-right:0px; 
                border-radius: 10px;
            padding: 5px;
            font-size: 15px;
     
            }
            .titulo2Artic{
                width: 50%;  
                max-width: 300px;
                text-align:center;
                min-width: 250px; 
      
            }
            .botoneralist{
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                margin: 10px 0px;
                width: 10%;
               }
             
                      .valCampo{
                  display:flex;
                        width: 10%;  
            align-items: center;
            max-width:150px;
            min-width: 100px;
    
            justify-content: center;
        
            padding: 5px;
         
                      }
                      
                        .tituloD{
                      
                            font-weight:bolder;
                        margin-right:10px
                       
                        }
                    
                   .mybtn{
                    font-size: 20px;
                    padding: 4px;
                    margin: 3px;
                    height: 35px;
                   }
                  .accClass{
                     
                  }
                   .valorD{
                   
                    width: 100%;
                    display: flex;
 justify-content: center;
 align-items: center;
  
}
                   }
        .firstcont{
            width:100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
        .contSellers{
       display:flex;
width:100%;
  
    margin: 5px 0px;
    border-radius: 6px;
  border-bottom: 2px solid black;
 
  justify-content: space-between;
    

}
        .parrafoD {
            margin-bottom:1px;
            word-break: break-all;
        }

       form{
        width: 100%;
       }
        
       .ArticRes{
   
        width: 10%;  
        align-items: center;
        max-width:150px;
        min-width: 100px;
        justify-content: center;
    
    }
    .ArticResPrecio{
        width: 15%;  
     
        max-width:150px;
        min-width: 100px;
        justify-content: center;
   
    }
        .mains{
            display: flex;
            color: black;
           
            font-size: 20px;
          
           
        }
        .contImagen img{
            height: 250px;
       
   
    margin: auto;
       
      
        }
        .setOverflowx{
            overflow-x: scroll;
            justify-content: start
           }
     
     `}</style>
        </div>
       
    )
}

}

export default ListVenta
