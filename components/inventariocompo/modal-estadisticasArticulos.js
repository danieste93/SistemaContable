import React, { Component } from 'react'

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie, Line,  } from 'react-chartjs-2';

import 'chart.js/auto';
class Contacto extends Component {
   

    componentDidMount(){
     
      setTimeout(function(){ 
        
        document.getElementById('mainEstadisticasArt').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
   
      Onsalida=()=>{
        document.getElementById('mainEstadisticasArt').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      

    render () {
      console.log(this.props)
      let TituloVar = this.props.tipo == "compras"?"Compras":"Ventas"
      let Categorias =[]
      let  NombresCat =[]
      let valores = []
      let coloresElegidos = [
        "red",
        "yellow",
        "orange",
        "lightGreen",
        '#00457E',
        "#2F70AF",
        "#806491",
      ]
      let  superdataPie = {}
      if(this.props.datos){

        if(this.props.tipo == "compras"){
 this.props.datos.forEach(compra => {
 
  compra.ArtComprados.forEach(art =>{
    let valorFinal = art.CantidadCompra * art.Precio_Compra
    if(!Categorias.includes(art.Categoria._id)){
     
      Categorias.push(art.Categoria._id)
      NombresCat.push(art.Categoria.nombreCat)
      valores.push(valorFinal)
    }else{
      let indexCat = Categorias.findIndex(x=> x == art.Categoria._id )
      let nuevoValor = valores[indexCat] + valorFinal
      valores[indexCat] =nuevoValor
    }
  })

 });}else if(this.props.tipo == "ventas"){
  this.props.datos.forEach(venta => {
 
    venta.articulosVendidos.forEach(art =>{
      let valorFinal = art.PrecioVendido
      if(!Categorias.includes(art.Categoria._id)){
        Categorias.push(art.Categoria._id)
        NombresCat.push(art.Categoria.nombreCat)
        valores.push(valorFinal)
      }else{
        let indexCat = Categorias.findIndex(x=> x == art.Categoria._id )
        let nuevoValor = valores[indexCat] + valorFinal
        valores[indexCat] =nuevoValor
      }
    })
  
   })

 }

  superdataPie = {labels: NombresCat,
  datasets: [{
     label: '',
     data: valores,
     backgroundColor: coloresElegidos
  } ]  }
}
 

        return ( 

         <div >

<div className="maincontacto" id="mainEstadisticasArt" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Estadísticas de {TituloVar}

</div>



</div> 
<div className="Scrolled">
<div className='contPie'>
<Pie data={superdataPie} plugins={[ChartDataLabels]}  options={{
  maintainAspectRatio : false,
  responsive: true,
      cutoutPercentage: 80,
 
      plugins: {
      
        legend : {
          labels:{
            fontColor:"black"
          },
          
          position: 'top',
          },
        datalabels: {
            backgroundColor: function(context) {
                return "white";
              },
            formatter: (value, ctx) => {
                let sum = 0;
                let ci = ctx.chart;
             
                let dataArr = ctx.chart.data.datasets[0].data;
                let acc = 0
                dataArr.forEach((d, i) => {
                  if (ci.getDataVisibility(i)) {
                    acc += d;
                  }
                });
                let percentage = (value*100 / acc).toFixed(0)+"%";
                return percentage;
            },
            color: 'black',
            borderRadius: 25,
            padding: 5,
            font: {
                size:"15px",
                weight: 'bold'
              },
        }}
   
    }} />
    </div>
</div>
</div>
        </div>
        <style jsx >{`
           .maincontacto{
            z-index: 1301;
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
.contPie{
  height: 300px;
  width: 100%;
  
  max-width: 400px;
}
            .contcontacto{
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

                .headercontact {

                  display:flex;
                  justify-content: space-around;
                  width: 80%;
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
                      justify-content: center;
                      align-items: center;
                     }
                  
           `}</style>
        

          
           </div>
        )
    }
}

export default Contacto