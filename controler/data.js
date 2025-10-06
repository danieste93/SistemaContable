  if(sinInsumos.length > 0){
   
      let articulosPorCrear = sinInsumos.filter(x=>x.itemSelected == null)
      let articulosPorActualizar= sinInsumos.filter(x=>x.itemSelected)
      
      if(articulosPorCrear.length > 0){
        articulosCrear = articulosPorCrear.length

       
        for(let x = 0;x<articulosPorCrear.length;x++){
          
       let Precio_Compra = (parseFloat(articulosPorCrear[x].precioFinal) )
       let existencias = (parseFloat(articulosPorCrear[x].cantidad[0]))
       valorInventario += (Precio_Compra*existencias) 
      let caducable = {Estado:false}
      if(articulosPorCrear[x].Caduca){
        caducable={
          Estado:articulosPorCrear[x].Caduca.Estado,
          FechaCaducidad:articulosPorCrear[x].Caduca.FechaCaducidad
        }
      } 
     
      let valido = true 
let acuminsu = 1
let newid = articulosPorCrear[x].codigoPrincipal[0]
console.log(articulosPorCrear[x])
while(valido){
 
  let findDistridi = await ArticuloModelSass.find({Diid:newid
})

if(findDistridi.length == 0){
  valido = false
} else {
  if (typeof newid === "number") {
    newid++; // Si es número, sumarle 1
  } else {
    newid = newid.toString() + acuminsu; // Si es string, concatenar "acum"
  }
  acuminsu++; // Incrementar acumulador
}

}

console.log("salidmos del while")
let ivadata = articulosPorCrear[x].iva == null ? false:
articulosPorCrear[x].iva == true ? true:
articulosPorCrear[x].iva == false? false:false

       let dataArtNew= {
            Eqid:Counterx[0].ContArticulos + x,
            Diid:newid,
            Grupo:"",
            Categoria:articulosPorCrear[x].categoria,
            Subcategoria:articulosPorCrear[x].subcategoria,
            Departamento:"",
            Titulo:articulosPorCrear[x].descripcion[0],
            Marca:"",
            Existencia:existencias,
            Calidad:"",
            Color:"",
            Precio_Compra:parseFloat(Precio_Compra),
            Precio_Venta:(parseFloat(Precio_Compra) + (parseFloat(Precio_Compra) * 1)).toFixed(2),
            Precio_Alt:(parseFloat(Precio_Compra) +(parseFloat(Precio_Compra) * 0.5)).toFixed(2),
           
            Descripcion:"",
            Garantia:"No",
            Imagen:"",
            Medida:"Unidad",
            Tipo:"Producto",
            Precio_Compra: parseFloat(Precio_Compra),
            CantidadCompra: parseFloat(articulosPorCrear[x].cantidad[0]),
            PrecioCompraTotal:Precio_Compra*existencias,
            Caduca:caducable,
             Iva:ivadata,
             Bodega_Inv_Nombre: "Inventario ",
             Bodega_Inv:9999998,
        
          }

          let art = await ArticuloModelSass.create([dataArtNew], { session})
      
          articulosGenerados.push(art[0])
        }

      }
      if(articulosPorActualizar.length > 0){
   console.log(articulosPorActualizar)
        for(let x = 0;x<articulosPorActualizar.length;x++){
          let art = articulosPorActualizar[x].itemSelected
          let nData = articulosPorActualizar[x]
          if(articulosPorActualizar[x].Caduca){
            console.log("caducado")
          }
           else{
          let totalInvertido = art.Precio_Compra * art.Existencia
          let ActualInvertido = nData.precioFinal  * parseFloat(nData.cantidad[0])
          let nuevaCantExistencias = art.Existencia + parseFloat(nData.cantidad[0])

          let sumaInvertido =  totalInvertido + ActualInvertido
          let NuevoPrecioCompra = sumaInvertido/nuevaCantExistencias
          if(art.Existencia <= 0){

            NuevoPrecioCompra= ActualInvertido / parseFloat(nData.cantidad[0])
            }

            let updateAS = { Existencia: nuevaCantExistencias  ,
              Precio_Compra:NuevoPrecioCompra ,
              CantidadCompra:parseFloat(nData.cantidad[0]),
              PrecioCompraTotal:ActualInvertido,
            }
              
                    
let artupdate = await ArticuloModelSass.findByIdAndUpdate(art._id,updateAS,{ session, new:true} )
if(artupdate == null ){
  throw new Error("Articulo no modificado, vuelva intentar en unos minutos")
}
valorInventario += ActualInvertido
articulosGenerados.push(artupdate)

        }
      }
    }

    }
 let arrRegs = []

    for(let i=0; i<req.body.Fpago.length;i++){
      if(req.body.Fpago[i].Cantidad > 0){
   
      let valornegativo = req.body.Fpago[i].Cantidad * (-1)            
    let update = { $inc: { DineroActual: valornegativo } }
    let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:9999998}, null,{session, new:true} )
    let updateIng = { $inc: { DineroActual: valorInventario } }
      let datareg= { Accion:"Gasto",   
      Tiempo:new Date(req.body.xmlData.fechaAutorizacion[0]).getTime(),
      IdRegistro:Counterx[0].ContRegs + i,
    
      CuentaSelec:{idCuenta:req.body.Fpago[i].Cuenta._id,
                   nombreCuenta: req.body.Fpago[i].Cuenta.NombreC,
                   valorCambiar:  req.body.Fpago[i].Cuenta.DineroActual.$numberDecimal 
                  },
    
      CatSelect:{idCat:catGasInv[0].idCat,
                    urlIcono:catGasInv[0].urlIcono,
                    nombreCat:catGasInv[0].nombreCat,
                    subCatSelect:catGasInv[0].subCatSelect,
                    _id:catGasInv[0]._id,
                  },
                Nota:"Compra Facturada N°"+Counterx[0].ContCompras+ " / " + req.body.Fpago[i].Tipo ,
    
      Descripcion:req.body.Fpago[i].Detalles,
      Descripcion2:{articulosVendidos:articulosGenerados},
      CompraNumero:Counterx[0].ContCompras,
      Estado:false,
      urlImg:[],
      Valrep:"No",
      TipoRep:"",
      Importe:req.body.Fpago[i].Cantidad,
      Usuario:{
        Nombre:req.body.Vendedor.Nombre,
        Id:req.body.Vendedor.Id,
        Tipo:req.body.Vendedor.Tipo,
    
      }
    }

   
    let dataregING= { Accion:"Ingreso",   
    Tiempo:new Date(req.body.xmlData.fechaAutorizacion[0]).getTime(),
    IdRegistro:Counterx[0].ContRegs + i,
    
    CuentaSelec:{idCuenta:idCuentaInv[0]._id,
                nombreCuenta: "Inventario",
                valorCambiar:  ""
                },
    
                CatSelect:{
                  idCat:catIngInv[0].idCat,
                 urlIcono:catIngInv[0].urlIcono,
                 nombreCat:catIngInv[0].nombreCat,
                 subCatSelect:catIngInv[0].subCatSelect,
                 _id:catIngInv[0]._id,
            
               },
    
    Nota:"Compra Facturada N°"+Counterx[0].ContCompras ,
    
    Descripcion:req.body.Fpago[i].Detalles,
    Descripcion2:{articulosVendidos:articulosGenerados},
    CompraNumero:Counterx[0].ContCompras,
    Estado:false,
    urlImg:[],
    Valrep:"No",
    TipoRep:"",
    Importe:valorInventario,
    Usuario:{
      Nombre:"Sistema",
      Id:"999999",
      Tipo:"Sistema",
  
    }
    }
    let reg1 = await RegModelSass.create([datareg],{session} )
    counterRegs += 1
    let reg2 = await RegModelSass.create([dataregING], {session} )
    counterRegs += 1
    arrRegs.push(reg1[0]._id)
    arrRegs.push(reg2[0]._id)
 
 let cuenta1 =   await CuentasModelSass.findByIdAndUpdate(req.body.Fpago[i].Cuenta._id,update,{session})
 let cuenta2 =   await CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id,updateIng,{session})
 if(cuenta1 == null || cuenta2 == null){
  throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
}   }   }


 let   datacompra ={
      arrRegs,
      CompraNumero:Counterx[0].ContCompras,
      ArtComprados:articulosGenerados,
      Usuario:req.body.Vendedor,
      Tiempo: new Date(req.body.xmlData.fechaAutorizacion[0]).getTime(),
      ValorTotal:req.body.TotalPago,
      Proveedor:"",
      Fpago:req.body.Fpago,
      idReg:Counterx[0].ContRegs,
      Doctype:"Factura",
      Factdata:{
        ruc:req.body.Ruc,
        nombreComercial:req.body.usuario,
        numeroFactura:`${req.body.codpunto}-${req.body.codemision}-${req.body.numeroFact}`,
        numeroAutorizacion:req.body.xmlData.numeroAutorizacion[0],
        fechaAutorizacion:req.body.xmlData.fechaAutorizacion[0],
      },
      ClaveAcceso:claveAccess,
      Validada:true
    }

   //let mydata = {...req.body}
    //let newDistri =  await UserControl.registerDistri(JSON.stringify(mydata))



    let Compra = await ComprasModelSass.create([datacompra], {new:true, session})

    

    let adicionador  = Counterx[0].ContRegs + counterRegs
      let updatecounter = { $inc: { ContCompras: 1, }, 
                           ContRegs:adicionador + 1,
                           
                           $inc: { ContArticulos: articulosCrear, }, 
                               
                                   }
      await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session} )
     
