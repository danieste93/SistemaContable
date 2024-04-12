   researchDatadArt=()=>{
        this.setState({getLoaderinv:false})
     
        let compras = this.props.state.RegContableReducer.Compras
        let ventas = this.props.state.RegContableReducer.Ventas
        let registrosGasto = this.props.state.RegContableReducer.Regs.filter(x=>x.Accion =="Gasto"  && x.CatSelect.nombreCat =="Salida Inventario")
        let cantidadArtComprados =0
        let cantidadArtVendidos =0
        let cantidadArtEliminados =0
        let arrCompras=[]
        let arrRegs=[]
        let arrVentas=[]
        for (let i = 0; i<compras.length;i++){

          for (let x = 0; x< compras[i].ArtComprados.length;x++){
            if(compras[i].ArtComprados[x]._id == this.props.art._id){
              cantidadArtComprados += compras[i].ArtComprados[x].CantidadCompra
          
              let tiempo = new Date(compras[i].Tiempo)    
              let mes = this.addCero(tiempo.getMonth()+1)
              let dia = this.addCero(tiempo.getDate())
              var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
              arrCompras.push({
                Documento:"Compra",
                DocId:compras[i].CompraNumero,
                MongoID:compras[i].ArtComprados[x]._id,
                Eqid:compras[i].ArtComprados[x].Eqid,
                Titulo:compras[i].ArtComprados[x].Titulo,
                Precio_Compra:parseFloat(compras[i].ArtComprados[x].Precio_Compra).toFixed(2),
                CantidadCompra:compras[i].ArtComprados[x].CantidadCompra,
                Precio_Venta:parseFloat(compras[i].ArtComprados[x].Precio_Venta).toFixed(2)||0 ,
                Tiempo:date
              })
  



            } 

          }
    

        }
        for (let i = 0; i<ventas.length;i++){
     
          for (let x = 0; x< ventas[i].articulosVendidos.length;x++){
            let tiempo = new Date(ventas[i].tiempo)    
            let mes = this.addCero(tiempo.getMonth()+1)
            let dia = this.addCero(tiempo.getDate())
            var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
            if(ventas[i].articulosVendidos[x]._id == this.props.art._id){
              cantidadArtVendidos += ventas[i].articulosVendidos[x].CantidadCompra
              arrVentas.push({
                Documento:"Venta",
                DocId:ventas[i].iDVenta,          
                Eqid:ventas[i].articulosVendidos[x].Eqid,
                Titulo:ventas[i].articulosVendidos[x].Titulo,
                Precio_Compra:parseFloat(ventas[i].articulosVendidos[x].Precio_Compra).toFixed(2),
                CantidadCompra:ventas[i].articulosVendidos[x].CantidadCompra,
                Precio_Venta:parseFloat(ventas[i].articulosVendidos[x].Precio_Venta).toFixed(2)||0 ,
                Tiempo:date
              })
            } 

          }

        }
        for (let i = 0; i<registrosGasto.length;i++){
          let tiempo = new Date(registrosGasto[i].Tiempo)    
          let mes = this.addCero(tiempo.getMonth()+1)
          let dia = this.addCero(tiempo.getDate())
          var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()

          if(registrosGasto[i].Descripcion2){
          for (let x = 0; x< registrosGasto[i].Descripcion2.articulosVendidos.length;x++){
          if(registrosGasto[i].Descripcion2.articulosVendidos[x]._id == this.props.art._id){
            cantidadArtEliminados += registrosGasto[i].Descripcion2.articulosVendidos[x].CantidadCompra
            arrRegs.push({
              Documento:"Reg Salida",
              DocId:registrosGasto[i].IdRegistro,
              Eqid:registrosGasto[i].Descripcion2.articulosVendidos[x].Eqid,
              MongoID:registrosGasto[i].Descripcion2.articulosVendidos[x]._id,
              Titulo:registrosGasto[i].Descripcion2.articulosVendidos[x].Titulo,
              Precio_Compra:registrosGasto[i].Descripcion2.articulosVendidos[x].Precio_Compra,
              CantidadCompra:registrosGasto[i].Descripcion2.articulosVendidos[x].CantidadCompra,
              Precio_Venta:registrosGasto[i].Descripcion2.articulosVendidos[x].Precio_Venta,
              Tiempo:date
            })
          }
      }}
        }
        let TotalArts =cantidadArtComprados-cantidadArtVendidos - cantidadArtEliminados

this.setState({Compras:arrCompras,cantidadArtComprados,
              Ventas:arrVentas,cantidadArtVendidos,
              RegsElim:arrRegs,cantidadArtEliminados,
              TotalArts
})
      }