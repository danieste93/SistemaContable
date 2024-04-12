import React, { Component } from 'react'



class ModalSelectIcon extends Component {
   

    componentDidMount(){
     
      setTimeout(function(){ 
        
        document.getElementById('mainSelectIcons').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
   
      Onsalida=()=>{
        document.getElementById('mainSelectIcons').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      

    render () {

   let matrizIcons = [
    "/fondoscuentas/amex1.png",
    "/fondoscuentas/amex2.png",
    "/fondoscuentas/amex3.png",
    "/fondoscuentas/amex4.png",
    "/fondoscuentas/mc01.png",
    "/fondoscuentas/mc02.png",
    "/fondoscuentas/visa01.png",
    "/fondoscuentas/visa04.png",
    "/fondoscuentas/visa05.png",
    "/fondoscuentas/visa06.png",
    "/fondoscuentas/visa07.png",
    "/fondoscuentas/visa08.png",
    "/fondoscuentas/bp.png",
    "/fondoscuentas/bpro.png",
  
  ]

let iconosRender = matrizIcons.map((x,i)=> <div key={i}>
  <div className="contIconoFondo " onClick={()=>{this.props.sendUrl(x)}} >
                
                <img className='fondoCuentaSe jwPointer' src={x} />
                 
                   </div>
</div>)

        return ( 

         <div >

<div className="maincontactoSelecticons" id="mainSelectIcons" >
<div className="contcontactoSIcons"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Selecciona un Fondo

</div>



</div> 
<div className="Scrolled">
  <div className='ContenedorFondos'>
  {iconosRender}
  </div>

</div>
</div>
        </div>
        <style >{`
          .fondoCuentaSe{
            width: 100%;
            margin: 10px;
            max-width: 331px;
        
          }
        .ContenedorFondos{
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        
        }
           .maincontactoSelecticons{
            z-index: 1302;
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
          
            .contcontactoSIcons{
              border-radius: 30px;
              
              width: 90%;
              background-color: white;
              display: flex;
              flex-flow: column;
              justify-content: space-around;
              align-items: center;
              
              }
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
              }
              .entradaaddc{
                left: 0%;
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
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 50vh;
                      padding: 5px;
                     
                     }
                    
                    .contIconoSelect{
                      background: whitesmoke;
                      border-radius: 50%;
                      padding: 5px;
                      display: flex;
                      justify-content: center;
                      border-bottom: 4px solid black;
                      height: 80px;
                  
                      margin: 10px;
                    } 
             .iconoCuenta{
              width: 95%;
              border-radius: 50%;
             }
           `}</style>
        

          
           </div>
        )
    }
}

export default ModalSelectIcon