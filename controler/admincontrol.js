const Cuentasmodel = require("../models/cuenta")
const Regmodel  = require("../models/registros")
const Art= require("../models/articulo")
const Ventas =  require("../models/venta")
const Compras =  require("../models/compras")
const Counter = require("../models/counter")
const tipoSchema  = require("../models/tiposSass")
const CryptoJS = require('crypto-js');
const catSchema = require("../models/catSass")
const Articulo = require("../models/articulo")
var fs = require('fs')
var pdf = require('html-pdf');
var soap = require('soap');
const xml = require("xml-parse");
const bcrypt = require('bcrypt'); 
const ExcelJS = require('exceljs');
const ComprasShema =  require("../models/comprasSass")
const counterSchema= require("../models/counterSass")
const ArticuloSchema = require("../models/articuloSass")
const regSchema= require("../models/registrosSass")
const accountSchema = require("../models/cuentaSass")
const comprasSchema= require("../models/comprasSass")
const ventasSchema = require("../models/ventaSass")
const clientSchema = require("../models/clientSass")
const UserSchema = require('../models/usersSass');
const regSchemaDelete= require("../models/registrosSassDel")
const distriSchema = require('../models/ditribuidorSass');
const  HtmlArtSchema = require('../models/articuloHTMLSass');
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const Forge = require('node-forge');
const fetch = require('node-fetch');
const {encrypt,decrypt} = require('./security');

const UserControl = require("./usercontrol")

async function genOnlyArt(req,res){

  let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  const session = await mongoose.startSession();  
  session.startTransaction();
 try{
  let data = req.body

  let  eqidFind= await ArticuloModelSass.findOne({Eqid:data.EqId})
  //let  tituloFind= await ArticuloModelSass.findOne({Titulo:`/^${req.body.Titulo}$/i`})
  let tituloFind = await ArticuloModelSass.findOne({ 
    Titulo: { $regex: `^${req.body.Titulo.trim()}$`, $options: 'i' } 
});

  if(eqidFind == null && tituloFind == null){
  let finalid = ""
  let cantidadReal =""
  let medidafinal =""
  
  
  let precioCompraFinal =""
  if(data.Caduca){
    finalid= data.EqId + "L1"
 
  }else{
  
    finalid= data.EqId 
  }

  if(data.Medida == "Unidades" ){
    cantidadReal = data.Cantidad
    medidafinal = "Unidad"
  }else{
    medidafinal = "Peso"
   
    if(data.Medida == "Gramos" ){
      cantidadReal =parseFloat(data.Cantidad)
    }else if(data.Medida == "Kilos" ){
      cantidadReal =parseFloat(data.Cantidad) * 1000
    }else if(data.Medida == "Libras"){
      cantidadReal =parseFloat(data.Cantidad) * 453.592
    } 
  }
  let precioVentaLote =0
  let precioVentaUnidad =0
let precioAltUnidad=0
let precioVentaAltLote=0
let preciocompraUnitario =""
  if(data.Vunitario){
   preciocompraUnitario = parseFloat(data.valUnitario)
    precioVentaUnidad = parseFloat(data.Precio_Venta_Unitario)
    precioVentaLote = parseFloat(cantidadReal * data.Precio_Venta_Unitario)
    precioAltUnidad =  parseFloat(data.Precio_VentaAlt_Unitario)
    precioVentaAltLote = parseFloat(precioAltUnidad * cantidadReal)
  }
  else if(data.Vtotal){
    
    preciocompraUnitario = (data.TotalValorCompra / cantidadReal)
    precioVentaLote = parseFloat(data.Precio_Venta_Total)
    precioVentaUnidad = parseFloat(data.Precio_Venta_Total / cantidadReal )
    
 
    precioVentaAltLote = parseFloat(data.Precio_VentaAlt_Total)
    precioAltUnidad= parseFloat(data.Precio_VentaAlt_Total / cantidadReal )
  }


  let dataArtNew= {
    Eqid:finalid,
    Diid:data.DistribuidorID,
    Barcode:data.Barcode,
    Grupo:data.Grupo,
    Categoria:data.catSelect,
      SubCategoria:data.subCatSelect,
    Departamento:data.Departamento,
    Titulo:data.Titulo,
    Marca:data.Marca,
    Existencia:(cantidadReal),
    Calidad:data.Calidad,
    Color:data.Color,
    Precio_Compra:preciocompraUnitario,
    Precio_Venta:precioVentaUnidad,
    Precio_Alt:precioAltUnidad,

    Descripcion:data.Descripcion,
    Garantia:data.Garantia,
    Imagen:data.urlImg,
    Medida:medidafinal,
    Tipo:"Producto",
  
   
    Bodega_Inv_Nombre: data.cuentaInvNombre,
    Bodega_Inv:data.cuentaInvSelect,
    Caduca:{
              Estado:data.Caduca,
              FechaCaducidad:data.Fecha_Caducidad
           },
           Iva:data.Iva

  }
  let art = await ArticuloModelSass.create([dataArtNew], { session, new:true})
  let updatecounter = { $inc: { ContArticulos: 1 } }
  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session, new:true} )
  res.status(200).send({message:"Articulo Ingresado", Articulo:art[0] })
            await session.commitTransaction();
            session.endSession();

 } else if(tituloFind){
  res.send({status: "Error", message: "Titulo ya existente"});
  await session.abortTransaction();
  session.endSession();
 }
 
 else if(eqidFind){
  res.send({status: "Error", message: "EqId ya existente"});
  await session.abortTransaction();
  session.endSession();
  
 }
 }

catch(error){
                  await session.abortTransaction();
                  session.endSession();
                  console.log(error, "errr")
                  return res.json({status: "Error", message: "Error en el sistema, porfavor intente en unos minutos", error });
                }
}
async function addArtIndividual(req,res){

  let data = req.body
  
  let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let ComprasModelSass = await conn.model('Compras', ComprasShema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let CatModelSass = await conn.model('Categoria', catSchema);
  const session = await mongoose.startSession();  
  session.startTransaction();
  try{
    console.log(req.body.Titulo)

    let  eqidFind= await ArticuloModelSass.findOne({Eqid:data.EqId})
    let tituloFind = await ArticuloModelSass.findOne({ 
      Titulo: { $regex: `^${req.body.Titulo.trim()}$`, $options: 'i' } 
  });
  console.log(tituloFind)
   if(eqidFind == null && tituloFind == null){
    let finalid = ""
    let cantidadReal =""
    let medidafinal =""
    
    
    let precioCompraFinal =""
    if(data.Caduca){
      finalid= data.EqId + "L1"
   
    }else{
    
      finalid= data.EqId 
    }
  
    if(data.Medida == "Unidades" ){
      cantidadReal = data.Cantidad
      medidafinal = "Unidad"
    }else{
      medidafinal = "Peso"
     
      if(data.Medida == "Gramos" ){
        cantidadReal =parseFloat(data.Cantidad)
      }else if(data.Medida == "Kilos" ){
        cantidadReal =parseFloat(data.Cantidad) * 1000
      }else if(data.Medida == "Libras"){
        cantidadReal =parseFloat(data.Cantidad) * 453.592
      } 
    }
    let precioVentaLote =0
    let precioVentaUnidad =0
  let precioAltUnidad=0
  let precioVentaAltLote=0
  let preciocompraUnitario =""
    if(data.Vunitario){
     preciocompraUnitario = parseFloat(data.valUnitario)
      precioVentaUnidad = parseFloat(data.Precio_Venta_Unitario)
      precioVentaLote = parseFloat(cantidadReal * data.Precio_Venta_Unitario)
      precioAltUnidad =  parseFloat(data.Precio_VentaAlt_Unitario)
      precioVentaAltLote = parseFloat(precioAltUnidad * cantidadReal)
    }
    else if(data.Vtotal){
      
      preciocompraUnitario = (data.TotalValorCompra / cantidadReal)
      precioVentaLote = parseFloat(data.Precio_Venta_Total)
      precioVentaUnidad = parseFloat(data.Precio_Venta_Total / cantidadReal )
      
   
      precioVentaAltLote = parseFloat(data.Precio_VentaAlt_Total)
      precioAltUnidad= parseFloat(data.Precio_VentaAlt_Total / cantidadReal )
    }
  
  
    let dataArtNew= {
      Eqid:finalid,
      Diid:data.DistribuidorID,
      Barcode:data.Barcode,
      Grupo:data.Grupo,
      Categoria:data.catSelect,
      SubCategoria:data.subCatSelect,
      Departamento:data.Departamento,
      Titulo:data.Titulo,
      Marca:data.Marca,
      Existencia:(cantidadReal),
      Calidad:data.Calidad,
      Color:data.Color,
      Precio_Compra:preciocompraUnitario,
      Precio_Venta:precioVentaUnidad,
      Precio_Alt:precioAltUnidad,

      Descripcion:data.Descripcion,
      Garantia:data.Garantia,
      Imagen:data.urlImg,
      Medida:medidafinal,
      Tipo:"Producto",
    
   
      Bodega_Inv_Nombre: data.cuentaInvNombre,
      Bodega_Inv:data.cuentaInvSelect,
      Caduca:{
                Estado:data.Caduca,
                FechaCaducidad:data.Fecha_Caducidad
             },
             Iva:data.Iva,
             PrecioCompraTotal: parseFloat(preciocompraUnitario) *cantidadReal,
             CantidadCompra:cantidadReal
  
    }
    let art = await ArticuloModelSass.create([dataArtNew], { session, new:true})
    
  let invImage =   art[0].Imagen.length > 0 && art[0].Imagen[0] != ""?art[0].Imagen[0]:["/regsimg/addproduct.png"]
  let arrRegs = []
  let regsToSend = []
  let arrCuentas =[]
  let counterRegs = 0
  let cuentainv =  await CuentasModelSass.find({iDcuenta:data.cuentaInvSelect}, null,{session, new:true} )
  let catIngInv=  await CatModelSass.find({idCat:16}, null,{session, new:true} )
  let catGasInv=  await CatModelSass.find({idCat:17}, null,{session, new:true} )
 

  const fixedImportTotalValorCompra= new mongoose.Types.Decimal128(parseFloat(data.TotalValorCompra).toFixed(2))
  let dataregING= { Accion:"Ingreso",   
  Tiempo:req.body.tiempo,
  TiempoEjecucion:req.body.tiempo,
  IdRegistro:req.body.idReg,

  CuentaSelec:{idCuenta:cuentainv[0]._id,
              nombreCuenta: cuentainv[0].NombreC,
           valorCambiar:cuentainv[0].DineroActual,
              },

  CatSelect:{
       idCat:catIngInv[0].idCat,
      urlIcono:catIngInv[0].urlIcono,
      nombreCat:catIngInv[0].nombreCat,
      subCatSelect:catIngInv[0].subCatSelect,
      _id:catIngInv[0]._id,
 
    },
           
  Nota:"Compra N°"+req.body.idCompra ,
  Descripcion:"",
  Descripcion2:{articulosVendidos:[dataArtNew]},
  Estado:false,
  urlImg:invImage,
  Valrep:"No",
  TipoRep:"",
  Importe:fixedImportTotalValorCompra,
  Usuario:{
    Nombre:"Sistema",
    Id:"999999",
    Tipo:"Sistema",

  }
                  }

let updateIng = { $inc: { DineroActual: fixedImportTotalValorCompra  } }
let reg2 = await RegModelSass.create([dataregING], {session} )
arrRegs.push(reg2[0]._id)
regsToSend.push(reg2[0])

counterRegs += 1
let cuenta2=    await CuentasModelSass.findByIdAndUpdate(cuentainv[0]._id,updateIng,{ session, new:true})
if(cuenta2 == null ){
  throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
}   
arrCuentas.push(cuenta2)

  for(let i=0; i<req.body.Fpago.length;i++){
      const fixedCantidad = parseFloat(req.body.Fpago[i].Cantidad).toFixed(2)
      let datareg= { Accion:"Gasto",   
      Tiempo:req.body.tiempo,
      TiempoEjecucion:req.body.tiempo,
      IdRegistro:req.body.idReg + counterRegs,
    
      CuentaSelec:{idCuenta:req.body.Fpago[i].Cuenta._id,
                   nombreCuenta: req.body.Fpago[i].Cuenta.NombreC,
                   valorCambiar:req.body.Fpago[i].Cuenta.DineroActual.$numberDecimal,
                  },
                  CatSelect:{idCat:catGasInv[0].idCat,
                    urlIcono:catGasInv[0].urlIcono,
                    nombreCat:catGasInv[0].nombreCat,
                    subCatSelect:catGasInv[0].subCatSelect,
                    _id:catGasInv[0]._id,
                  },
    
      Nota:"Compra N°"+req.body.idCompra+ " / " + req.body.Fpago[i].Tipo ,
      Descripcion:req.body.Fpago[i].Detalles,
      Descripcion2:{articulosVendidos:[dataArtNew]},
      Estado:false,
      urlImg:invImage,
      Valrep:"No",
      TipoRep:"",
      Importe:fixedCantidad,
      Usuario:{
        Nombre:req.body.Vendedor.Nombre,
        Id:req.body.Vendedor.Id,
        Tipo:req.body.Vendedor.Tipo,
    
      }
    }
   
  
            let valornegativo = fixedCantidad * (-1)                      
            let update = { $inc: { DineroActual: valornegativo } }
  
            let reg1 = await RegModelSass.create([datareg],{session} )
            counterRegs += 1
          
            arrRegs.push(reg1[0]._id)
          regsToSend.push(reg1[0])
  
     let cuenta1=   await   CuentasModelSass.findByIdAndUpdate(req.body.Fpago[i].Cuenta._id,update, {  session, new:true})

            
         if(cuenta1 == null ){
          throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
        }   
            
        arrCuentas.push(cuenta1)
             
            
          }
  


          let defaultData = { arrRegs,
            CompraNumero:req.body.idCompra,
            ArtComprados:[art[0]],
            Usuario:req.body.Vendedor,
            Tiempo:req.body.tiempo,
            ValorTotal:req.body.TotalPago,
            Fpago:req.body.Fpago,
            idReg:req.body.idReg,
            Factdata:{
              ruc:req.body.Ruc,
              nombreComercial:req.body.nombreComercial,
              numeroFactura:`${req.body.codpunto}-${req.body.codemision}-${req.body.numeroFact}`
             },
          
          }
    let datacompra = {
     ...defaultData,
      Doctype:"Nota de venta",
    }
  
  
    if(req.body.addFact){
      datacompra ={
        ...defaultData, 
        Doctype:"Factura",
       
      }
    }
  
    let Compra = await ComprasModelSass.create([datacompra], { session, new:true})
   
    let adicionador  = req.body.idReg + counterRegs
          let updatecounter = { $inc: { ContCompras: 1, ContArticulos: 1}, 
                                ContRegs:adicionador + 1,
    
                           
                               }
  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session, new:true} )
  
  
          res.status(200).send({message:"Compra Ingresada", Articulo:art[0], Compra:Compra[0],Regs:regsToSend, Cuentas:arrCuentas })
          await session.commitTransaction();
          session.endSession();
  
  
   }else if(tituloFind){
    res.send({status: "Error", message: "Titulo ya existente"});
    await session.abortTransaction();
    session.endSession();
   } else if(eqidFind){
    res.send({status: "Error", message: "EqId ya existente"});
    await session.abortTransaction();
    session.endSession();
    
   }

  }catch(error){
    await session.abortTransaction();
    session.endSession();
    console.log(error, "errr")
    return res.json({status: "Error", message: "error al registrar", error });
  }
}
const editArt=async(req, res)=>{
   
  let conn = await mongoose.connection.useDb(req.body.UserData.DBname);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  
 

 
  let update = { 
    Diid:req.body.DistribuidorID,
        Barcode:req.body.Barcode,
        Categoria:req.body.catSelect,
        SubCategoria:req.body.subCatSelect,
    Grupo: req.body.Grupo,
    Departamento: req.body.Departamento,
    Titulo: req.body.Titulo,
    Color: req.body.Color,
    Calidad: req.body.Calidad,
    Marca: req.body.Marca,
    Descripcion: req.body.Descripcion,
    Garantia: req.body.Garantia,
    Precio_Venta:parseFloat(req.body.Precio_Venta_Unitario),
    Precio_Alt:  parseFloat(req.body.Precio_VentaAlt_Unitario),
    Precio_Compra:req.body.Precio_Compra,
   
    Iva:req.body.Iva,
    Imagen:req.body.urlImg,
    PrecioCompraTotal: parseFloat(req.body.Precio_Compra) *0,
    CantidadCompra:0
 
}
if(req.body.newImg!==""){{
  if(req.body.urlImg[0] != ""){
  update.Imagen =  req.body.newImg.concat(req.body.urlImg)
}else {
  update.Imagen =  req.body.newImg
}

}}

let artUpdate = await ArticuloModelSass.findByIdAndUpdate(req.body.id,update,{new:true})
res.status(200).send({status: "actualizar art", artUpdate });

}
const editArtCompra= async(req, res)=>{

    let conn = await mongoose.connection.useDb(req.body.UserData.DBname);
    let RegModelSass = await conn.model('Reg', regSchema);
    let ComprasModelSass = await conn.model('Compras', ComprasShema);
    let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);
    let CounterModelSass = await conn.model('Counter', counterSchema);
    let CatModelSass = await conn.model('Categoria', catSchema);
    let ExisActual = parseInt(req.body.Existencia)
  let ExisAnt = req.body.AntiExis
  let CantidadComprada = ExisActual -  ExisAnt
  const session = await mongoose.startSession();   
  session.startTransaction();
  try{
    let Counterx =     await CounterModelSass.find({iDgeneral:9999999},null, {session} )
    let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:req.body.cuentaInvSelect}, null,{session, new:true} )
    const fixedImportTotalPago= new mongoose.Types.Decimal128(parseFloat(req.body.TotalPago).toFixed(2))
    let arrRegs =[]
    let arrRegsend =[]
    let arrCuentas =[]
    let catIngInv=  await CatModelSass.find({idCat:16}, null,{session, new:true} )
  let catGasInv=  await CatModelSass.find({idCat:17}, null,{session, new:true} )
  
  let newarrimg = [...req.body.urlImg, ...req.body.newImg]

    let imgToshow = newarrimg.find(x=> x != "")
    let invImage =  ["/regsimg/addproduct.png"]

    if(imgToshow){
      invImage = [imgToshow]
    }
    let artData = { 
      $inc: { Existencia: CantidadComprada }, 
      Categoria:req.body.catSelect,
      SubCategoria:req.body.subCatSelect,
             Grupo: req.body.Grupo,
             Diid:req.body.DistribuidorID,
             Barcode:req.body.Barcode,
             Departamento: req.body.Departamento,
             Titulo: req.body.Titulo,
             Color: req.body.Color,
             Calidad: req.body.Calidad,
             Marca: req.body.Marca,
             Descripcion: req.body.Descripcion,
             Garantia: req.body.Garantia,
             Precio_Venta: req.body.Precio_Venta,
             Precio_Compra:req.body.Precio_Compra,
             Precio_Alt: req.body.Precio_Alt,
             }
             let update =""
     if(req.body.newImg==""){          
       update = { ...artData,           
         Imagen:req.body.urlImg
               }
     } 
     else {
       update = {   
         ...artData,
         Imagen:req.body.newImg.concat(req.body.urlImg)
                                           }
     }

   let ArticuloActualizado =  await  ArticuloModelSass.findByIdAndUpdate(req.body.id,update,{session, new:true})
     
   if(ArticuloActualizado == null ){
     throw new Error("Articulo no encontrado, vuelva intentar en unos minutos")
   }
  
 
   ArticuloActualizado.CantidadCompra = CantidadComprada
   ArticuloActualizado.PrecioCompraTotal = (CantidadComprada *req.body.Precio_Compra).toFixed(2)
 
    let findIdReg = await CounterModelSass.find({iDgeneral:9999999}, null,{session})



      let counterRegs = 0
  
    let dataregING= { Accion:"Ingreso",   
    Tiempo:req.body.tiempo,
    TiempoEjecucion:req.body.tiempo,
    IdRegistro:Counterx[0].ContRegs + counterRegs,
    CuentaSelec:{idCuenta:idCuentaInv[0]._id,
                nombreCuenta: idCuentaInv[0].NombreC},
  
                CatSelect:{
                  idCat:catIngInv[0].idCat,
                 urlIcono:catIngInv[0].urlIcono,
                 nombreCat:catIngInv[0].nombreCat,
                 subCatSelect:catIngInv[0].subCatSelect,
                 _id:catIngInv[0]._id,
            
               },
  
    Nota:"Compra desde Edicion-Articulo N°"+Counterx[0].ContCompras,
    Descripcion:"",
    Descripcion2:{articulosVendidos:[ArticuloActualizado]},
    Estado:false,
    urlImg:invImage,
    Valrep:"No",
    TipoRep:"",
    Importe:fixedImportTotalPago,
    Usuario:{
      Nombre:"Sistema",
      Id:"999999",
      Tipo:"Sistema",
  
    }
  }
  let reg2 = await RegModelSass.create([dataregING], {session} )
  arrRegs.push(reg2[0]._id)
  arrRegsend.push(reg2[0])
  if(reg2[0] == null ){
    throw new Error("Registros no creados, vuelva intentar en unos minutos")
  }
  counterRegs += 1
  let updateIng = { $inc: { DineroActual: fixedImportTotalPago } }
  let cuenta2Modi=await CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id,updateIng,{session, new:true})

  if(cuenta2Modi == null ){
    throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
  } 

  arrCuentas.push(cuenta2Modi)
    for(let i=0; i<req.body.Fpago.length;i++){
    
      const fixedImportFor = new mongoose.Types.Decimal128(parseFloat(req.body.Fpago[i].Cantidad).toFixed(2))

      let datareg= { Accion:"Gasto",   
      Tiempo:req.body.tiempo,
      TiempoEjecucion:req.body.tiempo,
      IdRegistro:Counterx[0].ContRegs + counterRegs,
    
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

                Nota:"Compra Edicion Articulo N°"+Counterx[0].ContCompras+ " / " + req.body.Fpago[i].Tipo ,
  
      Descripcion:req.body.Fpago[i].Detalles,
      Descripcion2:{articulosVendidos:[ArticuloActualizado]},
      Estado:false,
      urlImg:invImage,
      Valrep:"No",
      TipoRep:"",
      Importe:fixedImportFor,
      Usuario:{
        Nombre:req.body.Vendedor.Nombre,
        Id:req.body.Vendedor.Id,
        Tipo:req.body.Vendedor.Tipo,
    
      }
    }
  
  
  
  
  let reg1 = await RegModelSass.create([datareg],{session} )  
  if(reg1[0] == null ){
    throw new Error("Registros no creados, vuelva intentar en unos minutos")
  }
  counterRegs += 1
  arrRegs.push(reg1[0]._id)
  arrRegsend.push(reg1[0])
    let valornegativo = fixedImportFor* (-1)              
    let updateCuentax = { $inc: { DineroActual: valornegativo } }
   
 let cuenta1Modi=  await CuentasModelSass.findByIdAndUpdate(req.body.Fpago[i].Cuenta._id,updateCuentax,{session, new:true})

 arrCuentas.push(cuenta1Modi)
 if(cuenta1Modi == null ){
  throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
} 
    }

    let datacompra =   {
      arrRegs,  
      Doctype:"Nota de venta",
      CompraNumero:Counterx[0].ContCompras,
      ArtComprados:[ArticuloActualizado],
      Usuario:req.body.Vendedor,
      Tiempo:req.body.tiempo,
      ValorTotal:req.body.TotalPago,
      Proveedor:req.body.proveedor,
      Fpago:req.body.Fpago,
      idReg:Counterx[0].ContRegs,
      Factdata:{
        ruc:req.body.Ruc,
        nombreComercial:req.body.nombreComercial,
        numeroFactura:`${req.body.codpunto}-${req.body.codemision}-${req.body.numeroFact}`
       }, 
    }
    if(req.body.addFact){
      datacompra ={
    ...datacompra,
        Doctype:"Factura",
    
      }
    }
    let Compra = await  ComprasModelSass.create([datacompra],{session})
  
    if(Compra[0] == null ){
      throw new Error("Compra no creada, vuelva intentar en unos minutos")
    }
  

    
          let adicionador  =   counterRegs + findIdReg[0].ContRegs
          let updateCounterCompra = { ContRegs:adicionador + 1,
                                     $inc: { ContCompras: 1, }
                                                    }
          await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updateCounterCompra,{session} )
  
          
          await session.commitTransaction();
         session.endSession();
         return res.status(200).send({message:"compra Edicion",Articulo:ArticuloActualizado,Regs:arrRegsend,Compra:Compra[0], Cuentas:arrCuentas} )
  
  } catch(error){
      await session.abortTransaction();
      session.endSession();
      console.log(error, "errr")
      return res.json({status: "Error", message: "error al registrar", error });
    }
  
  }
const editArtSalidaInv= async(req, res)=>{
  let conn = await mongoose.connection.useDb(req.body.UserData.DBname);
  let CatModelSass = await conn.model('Categoria', catSchema);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let CounterModelSass = await conn.model('Counter', counterSchema);

  let newarrimg = [...req.body.urlImg, ...req.body.newImg]
  let imgToshow = newarrimg.find(x=> x != "")
    let invImage =  ["/regsimg/lostproduct.png"]

    if(imgToshow){
      invImage = [imgToshow]
    }

  let gendata = { $inc: { Existencia: req.body.TotalEgreso * -1 }, 
  Categoria:req.body.catSelect,
  SubCategoria:req.body.subCatSelect,
  Grupo: req.body.Grupo,
  Departamento: req.body.Departamento,
  Titulo: req.body.Titulo,
  DistribuidorID:req.body.DistribuidorID,
  Barcode:req.body.Barcode,
  Color: req.body.Color,
  Calidad: req.body.Calidad,
  Marca: req.body.Marca,
  Descripcion: req.body.Descripcion,
  Garantia: req.body.Garantia,
  Precio_Compra:req.body.Precio_Compra,
  Precio_Venta: req.body.Precio_Venta,
  Precio_Alt: req.body.Precio_Alt}

    let update =""
  if(req.body.newImg==""){
  
    update = {   
     ...gendata,
      Imagen:req.body.urlImg
                                        }
  } 
  else {
    update = {   
      ...gendata,
      Imagen:req.body.newImg.concat(req.body.urlImg)
                                        }
  }
  const session = await mongoose.startSession();   
  session.startTransaction();
  try{
    let Counterx =     await CounterModelSass.find({iDgeneral:9999999},null, {session})
    let arrCuentas =[]
    let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:req.body.cuentaInvSelect}, null,{session, new:true} )
 let artmodi=    await ArticuloModelSass.findByIdAndUpdate(req.body.id,update,{session,new:true })
 const fixedImportTotalPago= new mongoose.Types.Decimal128(parseFloat(req.body.TotalPP).toFixed(2))
if(artmodi == null ){
  throw new Error("Articulo no modificado, vuelva intentar en unos minutos")
}
artmodi.PrecioCompraTotal =  fixedImportTotalPago
artmodi.CantidadCompra = req.body.TotalEgreso
let catSalidaInv=  await CatModelSass.find({idCat:18}, null,{session, new:true} )
    let updatecuenta = { $inc: { DineroActual: fixedImportTotalPago * (-1)} }
    let cuentainvMod = await  CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id,updatecuenta,{session, new:true})
arrCuentas.push(cuentainvMod)
    let dataregSI= { Accion:"Gasto",   
    Tiempo:req.body.tiempo,
    TiempoEjecucion:req.body.tiempo,
    IdRegistro:Counterx[0].ContRegs,
  
    CuentaSelec:{idCuenta:idCuentaInv[0]._id,
                nombreCuenta: idCuentaInv[0].NombreC,
                valorCambiar:  ""
                },
  
                CatSelect:{idCat:catSalidaInv[0].idCat,
                  urlIcono:catSalidaInv[0].urlIcono,
                  nombreCat:catSalidaInv[0].nombreCat,
                  subCatSelect:catSalidaInv[0].subCatSelect,
                  _id:catSalidaInv[0]._id,
             
                },
  
    Nota:"Salida de Inventario"+ " / " + req.body.Justificacion ,
    Descripcion:"Cantidad de unidades egresadas: "+req.body.TotalEgreso,
    Descripcion2:{articulosVendidos:[artmodi]},
    Estado:true,
    urlImg:invImage,
    Valrep:"No",
    TipoRep:"",
    Importe:fixedImportTotalPago,
    Usuario:{
      Nombre:req.body.Vendedor.Nombre,
      Id:req.body.Vendedor.Id,
      Tipo:req.body.Vendedor.Tipo,
    }
  }
 let reg1 =  await RegModelSass.create([dataregSI],{session} )
 

   let updateCounterReg = {  $inc: { ContRegs: 1, } }

   await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updateCounterReg,{session} )
   
  res.status(200).send({message:"Egreso Generado", Regs:reg1[0], Articulo:artmodi,Cuentas:arrCuentas})

  await session.commitTransaction();
  session.endSession();

  }
  catch(error){
    console.log(error, "errr")
    res.json({status: "Error", message: "error al registrar", error });
    await session.abortTransaction();
    session.endSession();
   
  
  }

}

async function generateCombo(req,res){
  
 
  let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  const session = await mongoose.startSession();   
  session.startTransaction();
  try{ 
    let data = req.body
    var articFind = await ArticuloModelSass.findOne({Titulo:data.Namecombo},null,{session})
    if(articFind == null){


      let dataArtNew= {
        Eqid:data.EqId,         
        Titulo:data.Namecombo,
        Precio_Venta:data.TotalValorCompra,
        Precio_Alt:data.TotalValorCompraAlt,             
        Tipo:"Combo", 
        Existencia:0,     
        Producs:data.ArtAddCalc        
    
      }
      let art = await ArticuloModelSass.create([dataArtNew], { session, new:true})
      
      let updatecounter = { $inc: {  ContArticulos: 1}   }
      await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session, new:true} )
      res.status(200).send({message:"Combo Ingresado", Articulo:art[0],  })
      await session.commitTransaction();
      session.endSession();
    }else{
  res.send({status: "Error", message: "Nombre ya existente"});
  await session.abortTransaction();
  session.endSession();
  
 }

  }catch(error){
                  await session.abortTransaction();
                  session.endSession();
                  console.log(error, "errr")
                  return res.json({status: "Error", message: "error al registrar", error });
                }

}


async function getHtmlArt(req,res){

   
  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
  let  iDFind= await HtmlArtModel.findOne({Eqid: req.body.idArt});
  console.log(iDFind)
  if(iDFind == null){
    res.status(200).send({status:"Ok", message:"articuloHTML no encontrado" })
  }else{
    res.status(200).send({status:"Ok",message:"articuloHTML Encontrado" ,HTMLdata:iDFind})
  }




}
async function saveTemplate(req,res){
   
  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
  let newHtmlArt = {
    Eqid:req.body.EqId,
    Titulo:req.body.Titulo,
    idArt:req.body.idArt,
    publicHtml:req.body.HTMLdata,
    Diseno:req.body.Diseno,
    Tipo:req.body.Tipo
  }

  await HtmlArtModel.create([newHtmlArt])

  res.status(200).send({message:"Plantilla generada " })
}
async function deleteTemplate(req,res){
   
  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
  
  let deleteTemplate = await HtmlArtModel.findByIdAndDelete(req.body.item._id)

    if(deleteTemplate){
      res.status(200).send({message:"Plantilla generada", reg:deleteTemplate })
    }else{
      res.status(200).send({message:"error"})
    }

}

async function editHtmlArt(req,res){
   
  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
  

  const session = await mongoose.startSession();  
  session.startTransaction();
  try{
  let  iDFind= await HtmlArtModel.findOne({Eqid: req.body.EqId});


  if(iDFind == null){

    let newHtmlArt = {
      Eqid:req.body.EqId,
      Titulo:req.body.Titulo,
      idArt:req.body.idArt,
      publicHtml:req.body.HTMLdata,
      Diseno:req.body.Diseno
    }

    await HtmlArtModel.create([newHtmlArt], { session})

  }else{

    let updateData = {
      Titulo:req.body.Titulo,
      publicHtml:req.body.HTMLdata,
      Diseno:req.body.Diseno
    }
    await HtmlArtModel.findOneAndUpdate({Eqid:req.body.EqId}, updateData,{session} )

  }
  res.status(200).send({message:"Articulo actualizado o creado " })
          await session.commitTransaction();
          session.endSession();

  }catch(error){
    await session.abortTransaction();
    session.endSession();
    console.log(error, "errr")
    return res.json({status: "Error", message: "error al registrar", error });
  }
  

}
async function getTemplates(req,res){

  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
  let  templates= await HtmlArtModel.find({Tipo: "Template"});

  res.status(200).send({status:"Ok",message:"templates Encontrados" ,templates})

}

async function generateService(req,res){

  let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  const session = await mongoose.startSession(); 
  session.startTransaction();
 try{
  let data = req.body
  var articFind = await ArticuloModelSass.findOne({Titulo:data.Titulo},null,{session})

 if(articFind == null){

  let dataArtNew= {
    Eqid:data.EqId,
    Categoria:data.catSelect,
    SubCategoria:data.subCatSelect,

    Titulo:data.TituloServ,
   
  
    Precio_Venta:parseFloat(data.PrecioServ),
    Precio_Alt:parseFloat(data.PrecioServAlt),

    Precio_Compra:parseFloat(data.PrecioCompraServ),
  
    TiempoReq:{
      Formato:data.TimeMesuare,
      tiempo:parseInt(data.Timereq)
    },
    Imagen:data.urlImg,
    Existencia:0,
    Tipo:"Servicio",
 
    Iva:data.Iva

  }
  let art = await ArticuloModelSass.create([dataArtNew], { session, new:true})
  let updatecounter = { $inc: {  ContArticulos: 1} }


  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session, new:true} )
  res.status(200).send({message:"Servicio Ingresada", Articulo:art[0]})
  await session.commitTransaction();
  session.endSession();
  }else{
  res.send({status: "Error", message: "Nombre ya existente"});
  await session.abortTransaction();
  session.endSession();
  
 }
 }catch(error){
                  await session.abortTransaction();
                  session.endSession();
                  console.log(error, "errr")
                  return res.json({status: "Error", message: "error al registrar", error });
                }

}
async function generateCompraMasiva(req,res){

  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname)
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let ComprasModelSass = await conn.model('Compras', ComprasShema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let CatModelSass = await conn.model('Categoria', catSchema);

 let errorArt = ""
 let errorId = ""
 let verifycomplete = false
 let Counterx =     await CounterModelSass.find({iDgeneral:9999999} )
 console.log(req.body.dataToAdd.length)
  for(let x=0;x<req.body.dataToAdd.length;x++){
    console.log("datatoadd",x)
  let nData= req.body.dataToAdd[x]
  
  if(  nData.Categoria == null|| nData.Categoria == undefined ||   nData.Precio_Compra.replaceAll(" ", "") == ""  ){
    
    
       errorArt = nData
    errorArt.CampoError = "Categoria"
      
      break;  
      
     }else{
      let catArt=  await CatModelSass.find({nombreCat:nData.Categoria}, null)
  
       if(catArt[0] == undefined || catArt[0] == null|| catArt[0] == []){
        console.log("creando",nData.Categoria)
         await  CatModelSass.create([{
           tipocat: "Articulo",
           subCategoria: [],
           urlIcono:"/iconscuentas/compra.png",
           nombreCat:nData.Categoria,
           idCat:Counterx[0].ContadorCat+1,
         
         }] )

         
        
       }
     }
 
  if( isNaN(nData.Precio_Compra.replaceAll(",","."))   || nData.Precio_Compra == null || parseFloat(nData.Precio_Compra) < 0||  nData.Precio_Compra.replaceAll(" ", "") == ""  ){
 
 
    errorArt = nData
 errorArt.CampoError = "Precio_Compra"
   
   break;  
   
  }
  if( isNaN(nData.Cantidad_Compra.replaceAll(",","."))   || nData.Cantidad_Compra == null || parseFloat(nData.Cantidad_Compra) < 0||  nData.Cantidad_Compra.replaceAll(" ", "") == "" || !Number.isInteger(parseFloat(nData.Cantidad_Compra)) ){
    errorArt = nData
    errorArt.CampoError = "Cantidad_Compra"    
    break; 
     }
     if( isNaN(nData.Precio_Venta.replaceAll(",","."))   || nData.Precio_Venta == null || parseFloat(nData.Precio_Venta) < 0||  nData.Precio_Venta.replaceAll(" ", "") == ""  ){
      errorArt = nData
      errorArt.CampoError = "Precio_Venta"    
      break; 
       }
       if( isNaN(nData.Precio_Alt.replaceAll(",","."))   || nData.Precio_Alt == null || parseFloat(nData.Precio_Alt) < 0||  nData.Precio_Alt.replaceAll(" ", "") == ""  ){
        errorArt = nData
        errorArt.CampoError = "Precio_Alt"    
        break; 
         }
     if(nData.Eqid == "#N/A" ||nData.Eqid == "#¡VALOR!" ||nData.Eqid.replace(" ", "") == "" ||nData.Eqid == null   ){
      errorId= nData
      break;   }
      if(nData.Titulo == "#N/A" ||nData.Titulo == "#¡VALOR!" ||nData.Titulo.replace(" ", "") == "" ||nData.Titulo == null   ){
        errorId= nData
        errorArt.CampoError = "Titulo"  
        break;   }
      if(nData.Diid == "#N/A" ||nData.Diid == "#¡VALOR!"  ||nData.Diid == null   ){
        errorArt = nData
        errorArt.CampoError = "Diid"  
        break;   }
        if(nData.Barcode == "#N/A" ||nData.Barcode == "#¡VALOR!"  ||nData.Barcode == null   ){
          errorArt = nData
          errorArt.CampoError = "Barcode"  
          break;   }
      if(nData.Tipo !== "Producto" && nData.Tipo !== "Servicio" && nData.Tipo !== "Combo"){
        errorArt = nData
    errorArt.CampoError = "Tipo"  
    break;  
      }
      if(nData.Iva !== "true" && nData.Iva !== "false" ){
        errorArt = nData
    errorArt.CampoError = "Iva"  
    break;  
      }
      if(nData.Medida !== "Unidad" && nData.Medida !== "Peso" ){
        errorArt = nData
    errorArt.CampoError = "Medida"  
    break;  
      }
      if(req.body.dataToAdd.length == x+1){
        console.log("ejecutando")
        verifycomplete = true
      }
  }//finfor
 console.log(verifycomplete)
 console.log(errorArt)
 console.log(errorId)

  if(errorArt !== ""){
  
    res.send({estado: "data error", message:  `Error el item con Eqid:  ${errorArt.Eqid} , en el campo:  ${errorArt.CampoError}, `});
  }
  else if(errorId !== ""){
   
    res.send({estado: "data error", message:  `Error el item con Titulo:  ${errorId.Titulo} , en el campo: ${errorId.Eqid}`});
  }else if(verifycomplete ){

 console.log("ejecutando creacion ")
    let gendata= []
    let gendata2= []
    let getCuentasInv = req.body.dataToAdd.map(x=> x.InvId)
  
    let sinRepetidos = getCuentasInv.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);


    for(let x=0;x<sinRepetidos.length;x++){
      let getCuenta = await CuentasModelSass.find({iDcuenta:parseInt(sinRepetidos[x])})
  
      if(getCuenta){
      
        if(getCuenta[0].Tipo != "Inventario"){
       return   res.send({estado: "data error", message:  `La cuenta con ID:  ${sinRepetidos[x]} no es tipo inventario `});
        }

      }else{
        return  res.send({estado: "data error", message:  `No existe la cuenta invetario con ID:  ${sinRepetidos[x]} `});
      }

    }

  
    for(let x=0;x<req.body.dataToAdd.length;x++){
      let nData= req.body.dataToAdd[x]
      let idArt= req.body.dataToAdd[x].Eqid

      var articFind = await ArticuloModelSass.findOne({Eqid:idArt},null,{new:true, })
      let catArt=  await CatModelSass.find({nombreCat:nData.Categoria}, null)
      let trusted_Precio_Compra =parseFloat(nData.Precio_Compra.replaceAll(",","."))
      let trusted_Precio_Venta =parseFloat(nData.Precio_Venta.replaceAll(",","."))
      let trusted_Precio_Alt =parseFloat(nData.Precio_Alt.replaceAll(",","."))
      if(articFind == null){
       
       
        let result = await  ArticuloModelSass.create([{    
                                                Eqid:nData.Eqid,
                                                Diid:nData.Diid,
                                                Barcode:nData.Barcode,
                                                Grupo:nData.Grupo,
                                                Categoria:catArt[0],
                                                SubCategoria:nData.Subcategoria,
                                                Departamento:nData.Departamento,
                                                Titulo:nData.Titulo,
                                                Marca:nData.Marca,
                                                Existencia:parseInt(nData.Cantidad_Compra) ,
                                                Calidad:nData.Calidad,
                                                Color:nData.Color,
                                                Precio_Compra:trusted_Precio_Compra,
                                                Precio_Venta:trusted_Precio_Venta,
                                                Precio_Alt:trusted_Precio_Alt,
                                                Descripcion:nData.Descripcion,
                                                Garantia:nData.Garantia,
                                                Imagen:nData.Imagen,
                                                CantidadCompra: parseFloat(nData.Cantidad_Compra) ,
                                                Caduca:nData.Caduca,
                                                Medida: nData.Medida,
                                                Iva:nData.Iva,
                                                TiempoReq: nData.TiempoReq,
                                                Tipo:nData.Tipo,
                                                Bodega_Inv:nData.InvId,
                                                Products:nData.Producs,
                                                PrecioCompraTotal:parseFloat(nData.Cantidad_Compra) *parseFloat(trusted_Precio_Compra)
                                              }],{new:true});
         gendata.push(result[0])
         console.log(result[0],"artIng")
      }else{

        let stabledData = {
          Eqid:nData.Eqid,
          Diid:nData.Diid,
          Barcode:nData.Barcode,
          Grupo:nData.Grupo,
          Categoria:catArt[0],
          SubCategoria:nData.Subcategoria,
          Departamento:nData.Departamento,
          Titulo:nData.Titulo,
          Marca:nData.Marca,
          $inc: { Existencia: parseInt(nData.Cantidad_Compra) },
          Calidad:nData.Calidad,
          Color:nData.Color,         
          Precio_Venta:trusted_Precio_Venta,
          Precio_Alt:trusted_Precio_Alt,
          Descripcion:nData.Descripcion,
          Garantia:nData.Garantia,
          PrecioCompraTotal:parseFloat(nData.Cantidad_Compra) *parseFloat(trusted_Precio_Compra),
          Precio_Compra: trusted_Precio_Compra,
          CantidadCompra: parseInt(nData.Cantidad_Compra),        
          Medida: nData.Medida,
          Iva:nData.Iva,
          TiempoReq: nData.TiempoReq,
          Tipo:nData.Tipo,
          Bodega_Inv:nData.InvId,
         
        }
       
       
      let update = { ...stabledData, Precio_Compra:trusted_Precio_Compra}
      if(articFind.Existencia > 0){
    
      let totalInvertido = articFind.Precio_Compra * articFind.Existencia
      let ActualInvertido = parseInt(nData.Cantidad_Compra) * trusted_Precio_Compra
      let sumaInvertido =  totalInvertido + ActualInvertido
      let nuevaCantExistencias = articFind.Existencia + parseInt(nData.Cantidad_Compra)
      let NuevoPrecioCompra = sumaInvertido/nuevaCantExistencias
    
      update = { ...stabledData,  Precio_Compra:NuevoPrecioCompra }
      }
    
      
      
      let updateArt = await ArticuloModelSass.findByIdAndUpdate(articFind._id,update,{ new:true})
      
      if(updateArt == null ){
        throw new Error("Articulo no modificado, vuelva intentar en unos minutos")
      }
          gendata2.push(updateArt)
      }
      console.log(x,"artIng")
    }//fin for datatoadd
      
    const session = await mongoose.startSession();   
    session.startTransaction();
    try{
     
      let allDataArt =gendata.concat(gendata2)
      let arrRegs = []
      let arrRegsSend = []
      let counterRegs = 0
      let catIngInv=  await CatModelSass.find({idCat:16}, null,{session, new:true} )
      let catGasInv=  await CatModelSass.find({idCat:17}, null,{session, new:true} )
      for(let x=0;x<sinRepetidos.length;x++){
        
        let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:parseInt(sinRepetidos[x])}, null,{session, new:true} )
      
        let getArtsInv = req.body.dataToAdd.filter((a)=> a.InvId == sinRepetidos[x])
     
        let valorinvertido = 0
       for(let j=0;j<getArtsInv.length;j++){
      
        let trusted_Precio_Compra =parseFloat(getArtsInv[j].Precio_Compra.replaceAll(",","."))

        let newsum = parseFloat(getArtsInv[j].Cantidad_Compra) * trusted_Precio_Compra
        getArtsInv[j].PrecioCompraTotal = newsum
          valorinvertido += newsum
        }
   //  console.log(valorinvertido + " : " + sinRepetidos[x])
     const fixedImport = new mongoose.Types.Decimal128(parseFloat(valorinvertido).toFixed(2))
     let dataregING= { Accion:"Ingreso",   
     Tiempo:req.body.tiempo,
     TiempoEjecucion:req.body.tiempo,
     IdRegistro:req.body.idReg + counterRegs,
   
     CuentaSelec:{idCuenta:idCuentaInv[0]._id,
                 nombreCuenta: idCuentaInv[0].NombreC,
                 valorCambiar:  ""
                 },
   
                 CatSelect:{
                  idCat:catIngInv[0].idCat,
                 urlIcono:catIngInv[0].urlIcono,
                 nombreCat:catIngInv[0].nombreCat,
                 subCatSelect:catIngInv[0].subCatSelect,
                 _id:catIngInv[0]._id,
            
               },
   
     Nota:"Compra Masiva N°"+req.body.idCompra ,
     Descripcion:"",
     Descripcion2:{articulosVendidos:getArtsInv},
     Estado:false,
     urlImg:[],
     Valrep:"No",
     TipoRep:"",
     Importe:fixedImport,
     Usuario:{
       Nombre:"Sistema",
       Id:"999999",
       Tipo:"Sistema",
   
     }
   }
   let reg2 = await RegModelSass.create([dataregING], {session} )
   counterRegs += 1
   arrRegs.push(reg2[0]._id)
   arrRegsSend.push(reg2[0])
   let updateIng = { $inc: { DineroActual: fixedImport  } }
  let cuentapagoIng =  await CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id,updateIng,{session})
   if(cuentapagoIng == null){
    throw new Error("No se pudo acceder a la cuenta, intente despues")
  }
  }
      
      for(let i=0; i<req.body.Fpago.length;i++){
     
        const fixedImportGas = new mongoose.Types.Decimal128(parseFloat( req.body.Fpago[i].Cantidad).toFixed(2))
        let valornegativo = fixedImportGas* (-1)
        let update = { $inc: { DineroActual: valornegativo } }
     
      let datareg= { Accion:"Gasto",   
      Tiempo:req.body.tiempo,
      TiempoEjecucion:req.body.tiempo,
      IdRegistro:req.body.idReg + counterRegs,
      
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
      
      Nota:"Compra Masiva N°"+req.body.idCompra+ " / " + req.body.Fpago[i].Tipo ,
      Descripcion:req.body.Fpago[i].Detalles,
      Descripcion2:{articulosVendidos:allDataArt},
      Estado:false,
      urlImg:[],
      Valrep:"No",
      TipoRep:"",
      Importe:fixedImportGas,
      Usuario:{
        Nombre:req.body.Vendedor.Nombre,
        Id:req.body.Vendedor.Id,
        Tipo:req.body.Vendedor.Tipo,
      
      }
      }
      
      let reg1 = await RegModelSass.create([datareg],{session} )
  
      counterRegs += 1
      arrRegs.push(reg1[0]._id)
     
      arrRegsSend.push(reg1[0])
      
      
      
      let cuentaPagoMasive = await  CuentasModelSass.findByIdAndUpdate(req.body.Fpago[i].Cuenta._id,update,{session})
     
      if(cuentaPagoMasive == null){
        throw new Error("No se pudo acceder a la cuenta, intente despues")
      }
      }//fin for pago 
    
    
    let datacompra ={
      arrRegs,
      CompraNumero:req.body.idCompra,
      ArtComprados:allDataArt,
      Usuario:req.body.Vendedor,
      Tiempo:req.body.tiempo,
      ValorTotal:req.body.TotalPago,
      Proveedor:req.body.proveedor,
      Fpago:req.body.Fpago,
      idReg:req.body.idReg,
      Doctype:"Nota de venta",
      Factdata:{
        ruc:req.body.Ruc,
        nombreComercial:req.body.nombreComercial,
        numeroFactura:`${req.body.codpunto}-${req.body.codemision}-${req.body.numeroFact}`
       },
    
    }
    if(req.body.addFact){
      datacompra ={
   ...datacompra,
        Doctype:"Factura",
       
      }
    }
    
    
    
    let Compra = await  ComprasModelSass.create(  [datacompra],{new:true, session})
    
    
    if(Compra[0] == null){
      throw new Error("No se pudo comprar, intente despues")
    }
   
   
    let adicionador  = req.body.idReg + counterRegs
    let updatecounter = { $inc: { ContCompras: 1, }, 
    ContRegs:adicionador + 1,      
            }
    await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session} )
  
  
     await session.commitTransaction();
    session.endSession();
 return res.status(200).send({message:"Compra Ingresada", Compra:Compra[0], Regs:arrRegsSend})
      }catch(error){
        await session.abortTransaction();
        session.endSession();
        console.log(error, "errr")
        return res.json({status: "Error", message: "error al registrar", error });
      }
    

    }}

async function generateCompra (req,res){

  let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let ComprasModelSass = await conn.model('Compras', ComprasShema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
  let CatModelSass = await conn.model('Categoria', catSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  const session = await mongoose.startSession();   
  session.startTransaction();
 try{

  let arrRegs = []
  let regsSend = []
  let arrCuentas = []
  let getCuentasInv = req.body.ArtAddCalc.map(x=> x.Bodega_Inv)
 
  let catIngInv=  await CatModelSass.find({idCat:16}, null,{session, new:true} )
  let catSalidaInv=  await CatModelSass.find({idCat:17}, null,{session, new:true} )

  let sinRepetidos = getCuentasInv.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);

  let counterRegs = 0
  for(let x=0;x<sinRepetidos.length;x++){
    let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:parseInt(sinRepetidos[x])}, null,{session} )


    let getArtsInv = req.body.ArtAddCalc.filter((a)=> a.Bodega_Inv == sinRepetidos[x])
    let valorinvertido = 0
    for(let j=0;j<getArtsInv.length;j++){

       valorinvertido +=   parseFloat(getArtsInv[j].PrecioCompraTotal)
     }
 
  const fixedImport = new mongoose.Types.Decimal128(parseFloat(valorinvertido).toFixed(2))
    let dataregING= { Accion:"Ingreso",   
    Tiempo:req.body.tiempo,
    TiempoEjecucion:req.body.tiempo,
    IdRegistro:req.body.idReg + counterRegs,
    
    CuentaSelec:{idCuenta:idCuentaInv[0]._id,
                nombreCuenta: idCuentaInv[0].NombreC,
               
                },
    
                CatSelect:{
                  idCat:catIngInv[0].idCat,
                 urlIcono:catIngInv[0].urlIcono,
                 nombreCat:catIngInv[0].nombreCat,
                 subCatSelect:catIngInv[0].subCatSelect,
                 _id:catIngInv[0]._id,
            
               },
    
    Nota:"Compra N°"+req.body.idCompra+ " / ",
    
    Descripcion:"",
    Descripcion2:{articulosVendidos:getArtsInv},
    Estado:false,
    urlImg:[],
    Valrep:"No",
    TipoRep:"",
    Importe:fixedImport,
    Usuario:{
      Nombre:"Sistema",
      Id:"999999",
      Tipo:"Sistema",
  
    }
    }
    let reg2 = await RegModelSass.create([dataregING], {session} )
    counterRegs += 1
    arrRegs.push(reg2[0]._id)
    regsSend.push(reg2[0])
    let updateIng = { $inc: { DineroActual: fixedImport  } } 
 let ingresoCuenta  = await CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id,updateIng,{session, new:true})
  arrCuentas.push(ingresoCuenta)
 if(ingresoCuenta == null){
      throw new Error("No se pudo acceder a la compra, intente despues")
    }
  }

  for(let i=0; i<req.body.Fpago.length;i++){
    const fixedCantidad = parseFloat(req.body.Fpago[i].Cantidad).toFixed(2)

    
    let valornegativo = fixedCantidad * (-1)            
  let update = { $inc: { DineroActual: valornegativo } }
  
    let datareg= { Accion:"Gasto",   
    Tiempo:req.body.tiempo,
    TiempoEjecucion:req.body.tiempo,
    IdRegistro:req.body.idReg + counterRegs,
  
    CuentaSelec:{idCuenta:req.body.Fpago[i].Cuenta._id,
                 nombreCuenta: req.body.Fpago[i].Cuenta.NombreC,
                 valorCambiar:  req.body.Fpago[i].Cuenta.DineroActual.$numberDecimal 
                },
  
                CatSelect:{idCat:catSalidaInv[0].idCat,
                  urlIcono:catSalidaInv[0].urlIcono,
                  nombreCat:catSalidaInv[0].nombreCat,
                  subCatSelect:catSalidaInv[0].subCatSelect,
                  _id:catSalidaInv[0]._id,
             
                },
              Nota:"Compra N°"+req.body.idCompra+ " / " + req.body.Fpago[i].Tipo ,
  
    Descripcion:req.body.Fpago[i].Detalles,
    Descripcion2:{articulosVendidos:req.body.ArtAddCalc},
    Estado:false,
    urlImg:[],
    Valrep:"No",
    TipoRep:"",
    Importe:fixedCantidad,
    Usuario:{
      Nombre:req.body.Vendedor.Nombre,
      Id:req.body.Vendedor.Id,
      Tipo:req.body.Vendedor.Tipo,
  
    }
  }
 
  
  
  
  
 let reg1 = await RegModelSass.create([datareg],{session} )

 counterRegs += 1
  arrRegs.push(reg1[0]._id)

  regsSend.push(reg1[0])

  let compraCuenta = await CuentasModelSass.findByIdAndUpdate(req.body.Fpago[i].Cuenta._id,update,{session})
 
  if(compraCuenta == null){
    throw new Error("No se pudo acceder a la compra, intente despues")
  }
  arrCuentas.push(compraCuenta)
  

  
                                         }

  let ArtsCompra = []
  let ArtRedux = []
  for(let x=0;x<req.body.ArtAddCalc.length;x++){
    let idArt= req.body.ArtAddCalc[x].Eqid
  let art = await ArticuloModelSass.findOne({Eqid:idArt}, null,{ session} )
 
  let nData= req.body.ArtAddCalc[x]
  
if(art.Caduca.Estado){
if(art.Caduca.FechaCaducidad != nData.Caduca.FechaCaducidad) {
let miid = nData.Eqid
let miidex = miid.indexOf("L")
let codebase = miid.slice(0, miidex);  
let subcode = miid.slice((miidex+1), miid.length);

let newid = codebase +"L" +subcode

let createdCode = "L"+ subcode
let titleClean = nData.Titulo.replace(createdCode, "")

let valido = true 
let acum = 1
while(valido){
  let artNewbase = await ArticuloModelSass.findOne({Eqid:newid}, null,{ session} )
   
  if(artNewbase == null){
    valido = false
  }else{
    newSubCode = parseInt(subcode) + acum

    newid = codebase +"L"+ newSubCode
    acum ++
  }

}
 
let nuevaCantExistencias =  parseFloat(nData.CantidadCompra)
let preciocompraUnidad =  (nData.Precio_Compra / nuevaCantExistencias)


let dataArtNew= {
  Eqid:newid,
  Diid:data.DistribuidorID,
    Barcode:data.Barcode,
  Titulo:titleClean + " L" + newSubCode,   
  Existencia:nuevaCantExistencias,   
  Precio_Compra:preciocompraUnidad,
  Precio_Venta: art.Precio_Venta,
  Precio_Alt: art.Precio_Alt,

  Precio_Venta_Lote:(art.Precio_Venta * nuevaCantExistencias),
  Precio_VentaAlt_Lote:( art.Precio_Alt * nuevaCantExistencias),
  
  Medida:nData.Medida,
  Tipo:"Producto",
  Precio_Compra: preciocompraUnidad,
  CantidadCompra:nData.CantidadCompra,
  Caduca:{
            Estado:nData.Caduca.Estado,
            FechaCaducidad:nData.Caduca.FechaCaducidad
         },
  Iva:art.Iva

}
let newart = await ArticuloModelSass.create([dataArtNew], { session, new:true})

if(newart[0] == null){
  throw new Error("No se pudo crear el articulo")
}

}else{
let totalInvertido = art.Precio_Compra * art.Existencia
let ActualInvertido = nData.Precio_Compra


let nuevaCantExistencias = 0

if(nData.Medida == "Unidad"){

nuevaCantExistencias  = art.Existencia + parseFloat(nData.CantidadCompra)
}else if(nData.Medida == "Peso"){
if(nData.Unidad == "Gramos" ){
  let cantidadengramos = parseFloat(nData.CantidadCompra) 
  nuevaCantExistencias  = parseFloat(art.Existencia) + parseFloat(cantidadengramos)
}else if(nData.Unidad == "Kilos" ){
  
  let cantidadengramos = parseFloat(nData.CantidadCompra * 1000)
  nuevaCantExistencias  = parseFloat(art.Existencia) + parseFloat(cantidadengramos)
  
}else if(nData.Unidad == "Libras"){

  let cantidadengramos = parseFloat(nData.CantidadCompra * 453.592)
  nuevaCantExistencias  = parseFloat(art.Existencia) + parseFloat(cantidadengramos)

} 
}

let sumaInvertido =  totalInvertido + ActualInvertido

let NuevoPrecioCompra = sumaInvertido/nuevaCantExistencias

if(art.Existencia <= 0){
NuevoPrecioCompra= nData.Precio_Compra
}

let update = {Existencia: nuevaCantExistencias, 
                     Precio_Compra:NuevoPrecioCompra  }

let artupdate = await ArticuloModelSass.findByIdAndUpdate(art._id,update,{ session, new:true} )
if(artupdate == null ){
  throw new Error("Articulo no modificado, vuelva intentar en unos minutos")
}
ArtRedux.push(artupdate)

artupdate.CantidadCompra = parseFloat(nData.CantidadCompra)
artupdate.Precio_Compra = parseFloat(nData.Precio_Compra)
artupdate.PrecioCompraTotal = parseFloat(nData.CantidadCompra) *parseFloat(nData.Precio_Compra)

ArtsCompra.push(artupdate)

}

}
else{

let totalInvertido = art.Precio_Compra * art.Existencia
let ActualInvertido = nData.PrecioCompraTotal
let nuevaCantExistencias = art.Existencia + parseFloat(nData.CantidadCompra)


let sumaInvertido =  totalInvertido + ActualInvertido

let NuevoPrecioCompra = sumaInvertido/nuevaCantExistencias


if(art.Existencia <= 0){

NuevoPrecioCompra= nData.PrecioCompraTotal / nData.CantidadCompra
}

let update = { Existencia: nuevaCantExistencias  ,
                     Precio_Compra:NuevoPrecioCompra   }
                    
let artupdate = await ArticuloModelSass.findByIdAndUpdate(art._id,update,{ session, new:true} )
if(artupdate == null ){
  throw new Error("Articulo no modificado, vuelva intentar en unos minutos")
}   
ArtRedux.push(artupdate)

artupdate.CantidadCompra = parseFloat(nData.CantidadCompra)
artupdate.Precio_Compra = parseFloat(nData.Precio_Compra)
artupdate.PrecioCompraTotal = parseFloat(nData.CantidadCompra) *parseFloat(nData.Precio_Compra)

ArtsCompra.push(artupdate)
}

 


}//fin for

let datacompra ={
  arrRegs,
  CompraNumero:req.body.idCompra,
  ArtComprados:ArtsCompra,
  Usuario:req.body.Vendedor,
  Tiempo:req.body.tiempo,
  ValorTotal:req.body.TotalPago,
  Proveedor:req.body.proveedor,
  Fpago:req.body.Fpago,
  idReg:req.body.idReg,
  Doctype:"Nota de venta",
  Factdata:{
    ruc:req.body.Ruc,
    nombreComercial:req.body.nombreComercial,
    numeroFactura:`${req.body.codpunto}-${req.body.codemision}-${req.body.numeroFact}`
   },
}
if(req.body.addFact){
  datacompra ={
    ...datacompra,
    Doctype:"Factura",
  
  }
}

let Compra = await ComprasModelSass.create([datacompra], {new:true, session})



let adicionador  = (req.body.Fpago.length - 1) + parseInt(Compra[0].idReg)
let updatecounter = { $inc: { ContCompras: 1, }, 
                     ContRegs:adicionador + 1,
  
                         
                             }
await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session} )

res.status(200).send({message:"Compra Ingresada", Compra:Compra[0], Regs:regsSend, Cuentas:arrCuentas, Articulos:ArtRedux})
await session.commitTransaction();
session.endSession();

 } catch(error){
                  await session.abortTransaction();
                  session.endSession();
                  console.log(error, "errr")
                  return res.json({status: "Error", message: "error al registrar", error });
                }
  }//fin compras

  async function  getAllCounts (req, res){
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);
    let cuentasHabiles = await CuentasModelSass.find()
    res.status(200).send({status: "Ok", message: "allcounts",cuentasHabiles});
  }
  async function  getArt (req, res){
let conn = await mongoose.connection.useDb(req.body.User.DBname);

let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);  

let articulosHabiles = await ArticuloModelSass.find().sort({ $natural: -1 })

res.status(200).send({status: "Ok", message: "getArts",articulosHabiles});

};



  async function getArtByTitle (req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    
    let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);  
    let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
    let articulosHabiles = await ArticuloModelSass.find({Titulo:req.body.Titulo})
    let articulosHabilesHTML = await HtmlArtModel.find({Titulo:req.body.Titulo})
    res.status(200).send({status: "Ok", message: "getArts",articulosHabiles,articulosHabilesHTML});
    
    };
const  getArt_by_id = (req, res)=>{

  const articulo =  req.params.article
  Arti.findById(articulo,  (err,articulo)=>{
            
    if(err) res.status(500).send({message:"error al encontrar "})
    if(!articulo) res.status(404).send({message:"no encontrado "})
    return res.status(200).send({status: "ok", articulo} )
  })
};
const ventasList =(req, res)=>{
  Ventas.find({}, (err, Ventas)=>{
    if(err) return res.status(500).send({message:"error en la peticion"})
    if(!Ventas) return res.status(404).send({message:"elemento no encontrado"})
    res.status(200).send({Ventas})
  })
};
const comprasList =(req, res)=>{
  Compras.find({}, (err, Comprasx)=>{
    if(err) return res.status(500).send({message:"error en la peticion"})
    if(!Comprasx) return res.status(404).send({message:"elemento no encontrado"})
    res.status(200).send({Comprasx})
  })
};
const deleteVenta = async (req,res)=>{

let conn = await mongoose.connection.useDb(req.body.UserData.DBname);
let RegModelSass = await conn.model('Reg', regSchema);
let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
let VentaModelSass = await conn.model('Venta', ventasSchema);
let CuentasModelSass = await conn.model('Cuenta', accountSchema);
let RegModelSassDelete = await conn.model('RegDelete', regSchemaDelete);
         

let arrArts = []
let arrCuentas = []
let arrRegs = []
let arrRegsDell = []

const session = await mongoose.startSession();   
  session.startTransaction();
  try{
    let ventac = await VentaModelSass.findByIdAndDelete(req.body._id,{session})
    if(ventac == null){
      throw new Error("Venta no encontrado")
    }
    

    for(let i=0;i<req.body.articulosVendidos.length;i++){
   let   valorinvertido = 0
  if(req.body.articulosVendidos[i].Tipo =="Combo"){
    

    req.body.articulosVendidos[i].Producs.forEach(async x=>{
      let cantidadUpdate = x.Cantidad
      if(x.Medida == "Unidad"){
        cantidadUpdate = x.Cantidad
       
       }else if(x.Medida == "Peso"){
        if(x.Unidad == "Gramos"){
         cantidadUpdate = x.Cantidad
        }else if(x.Unidad == "Libras"){
         cantidadUpdate = x.Cantidad * 453.592
        }else if(x.Unidad == "Kilos"){
         cantidadUpdate = x.Cantidad * 1000
        }
      
    }
    let update = { $inc: { Existencia: cantidadUpdate } }
            
    valorinvertido += x.Precio_Compra * cantidadUpdate
 let artUpdated =   await  ArticuloModelSass.findByIdAndUpdate(x._id,update,{session})
    if(artUpdated == null ){
      throw new Error("Articulo no modificado, vuelva intentar en unos minutos")
    }
    })
  }else if(req.body.articulosVendidos[i].Tipo =="Producto"){
    let valorIncremento = req.body.articulosVendidos[i].CantidadCompra 

    let update = { $inc: { Existencia: valorIncremento } }
 let artInve=   await  ArticuloModelSass.findByIdAndUpdate(req.body.articulosVendidos[i]._id,update,{session, new:true})  
arrArts.push(artInve)
if(artInve == null){
  throw new Error("articulo no encontrado")
}
else if(artInve.Eqid != req.body.articulosVendidos[i].Eqid){
  throw new Error("Inconcistencia en los datos, no se puede eliminar")
}
  }else if(req.body.articulosVendidos[i].Tipo =="Servicio"){
    valorinvertido += 0
  }
   

}
 



if(req.body.arrRegs.length == 0 || req.body.arrRegs == undefined ){
  throw new Error("sin arrRegs q eliminar")
  }
    for(let y=0;y<req.body.arrRegs.length;y++){
      let regdata =   await RegModelSass.findByIdAndRemove(req.body.arrRegs[y], { session })
     
      if (!regdata) {
        throw new Error(`Registro con ID ${req.body.arrRegs[y]} no encontrado para eliminar.`);
      }
      let newDeleteReg={
        ...regdata.toObject(),
        Estado:false,
        TiempoDelete: new Date().getTime(),
        UsuarioDelete:req.body.UsuarioDelete
      }

      let newRegDelete = await RegModelSassDelete.create([newDeleteReg],{session})
      
    
      arrRegs.push(regdata)
      arrRegsDell.push(newRegDelete[0])
     
      
      if(regdata.Accion == "Gasto"){
        const fixedImport= new mongoose.Types.Decimal128(JSON.stringify(parseFloat(regdata.Importe)))
        let updateInv = { $inc: { DineroActual:fixedImport } }
        let cuentaUpdate=  await CuentasModelSass.findByIdAndUpdate(regdata.CuentaSelec.idCuenta,updateInv,{session, new:true})
      arrCuentas.push(cuentaUpdate)
        if(cuentaUpdate == null){
          throw new Error("Cuenta no encontrada")
        }
      
      }
      if(regdata.Accion == "Ingreso"){
        const fixedImport= new mongoose.Types.Decimal128(JSON.stringify(parseFloat(regdata.Importe)))
        let updateInv = { $inc: { DineroActual:fixedImport *-1 } }
        let cuentaUpdate=  await CuentasModelSass.findByIdAndUpdate(regdata.CuentaSelec.idCuenta,updateInv,{session, new:true})
        arrCuentas.push(cuentaUpdate)
        if(cuentaUpdate == null){
          throw new Error("Cuenta no encontrada")
        }
    
      }
      if(regdata.Accion == "Trans"){
        const fixedImport= new mongoose.Types.Decimal128(JSON.stringify(parseFloat(regdata.Importe)))
        let updateInvGas = { $inc: { DineroActual:fixedImport *-1 } }
        let updateInvIng = { $inc: { DineroActual:fixedImport  } }

        let cuenta1 = await  CuentasModelSass.findByIdAndUpdate(regdata.CuentaSelec.idCuenta, updateInvIng, {session,new:true})
        let cuenta2 =await   CuentasModelSass.findByIdAndUpdate(regdata.CuentaSelec2.idCuenta, updateInvGas, {session, new:true})        
        if(cuenta1 == null){
          throw new Error("Cuenta no encontrada")
        }
        if(cuenta2 == null){
          throw new Error("Cuenta no encontrada")
        }
        arrCuentas.push(cuenta1)
        arrCuentas.push(cuenta2)
      }
  

    }
if(req.body.formasdePago){
 

    
  }else if(req.body.FormasCredito){
  
   
    let updateCuenta = { $inc: { LimiteCredito: req.body.CreditoTotal}  }
    let CuentaCredito=    await CuentasModelSass.findByIdAndUpdate(req.body.CuentaCredito,updateCuenta,{session})
    if(CuentaCredito == null){
      throw new Error("Credito no encontrdo")
    }
  
  
  }


 await session.commitTransaction();
  session.endSession();
  return res.status(200).send({status: "venta Eliminada", Venta: ventac, arrRegs, arrArts, arrCuentas, arrRegsDell });

}  catch(e){
    await session.abortTransaction();
    session.endSession();
    console.log(e, "errr")
    return res.json({status: "Error", message: "error al registrar", error:e.message });
  }
}

const deleteCompra= async (req, res, next)=>{

  let conn = await mongoose.connection.useDb(req.body.UserData.DBname);

  let RegModelSass = await conn.model('Reg', regSchema);
  let ComprasModelSass = await conn.model('Compras', ComprasShema);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let RegModelSassDelete = await conn.model('RegDelete', regSchemaDelete);
         

  let arrArts = []
  let arrCuentas = []
  let arrRegs = []
  let arrRegsDell = []
  const session = await mongoose.startSession();   
    session.startTransaction();
    try{


for(let i=0;i<req.body.ArtComprados.length;i++){
 if(req.body.ArtComprados[i].Eqid ==='INSUMO-GEN' ){

  continue;
 }

let artic = await ArticuloModelSass.findById(req.body.ArtComprados[i]._id);

if (artic == null) {
  throw new Error(`Artículo no encontrado o eliminado: "${req.body.ArtComprados[i].Titulo}" (Eqid: ${req.body.ArtComprados[i].Eqid})`);

}
  else{
    let numeroExistencias = artic.Existencia
  let unidadesEliminadas = (req.body.ArtComprados[i].CantidadCompra) 

  let unidadesActuales = numeroExistencias - unidadesEliminadas
  if (unidadesActuales < 0) {
    // apenas encuentres uno con error, responde y termina
    let articulo = { Titulo: artic.Titulo, Eqid: artic.Eqid };
  

       const error = new Error("Existencias insuficientes");
  error.articulo = req.body.ArtComprados[i];
  throw error;
}
}
}
    
  
    let Compra = await ComprasModelSass.findByIdAndDelete(req.body._id, { session })

    if(Compra == null){
      throw new Error("Compra no encontrada")
    }

    for(let i=0;i<req.body.ArtComprados.length;i++){
      if(req.body.ArtComprados[i].Eqid ==='INSUMO-GEN' ){
        continue;
       }
  
      let artic = await ArticuloModelSass.findById(req.body.ArtComprados[i]._id,null,{ session}) 
      if(artic == null){
     const error = new Error("Artículo no encontrado");
  error.articulo = req.body.ArtComprados[i];
  throw error;

      }
   
      
      let numeroExistencias = artic.Existencia
      let unidadesEliminadas = (req.body.ArtComprados[i].CantidadCompra) 
  
      let unidadesActuales = numeroExistencias - unidadesEliminadas
      
      let valorTotalInvertido = numeroExistencias * artic.Precio_Compra
      let valorPerdido = req.body.ArtComprados[i].Precio_Compra * req.body.ArtComprados[i].CantidadCompra
  
      let nuevoValorInvertido = valorTotalInvertido-valorPerdido
      let nuevoPrecioCompra = nuevoValorInvertido/ unidadesActuales
      
   
      if(Object.is(nuevoPrecioCompra, NaN)){
       
        nuevoPrecioCompra = 0
      }
  
  
      let update = {   Existencia: unidadesActuales, Precio_Compra: nuevoPrecioCompra  }
     
  
   let resart = await  ArticuloModelSass.findByIdAndUpdate(req.body.ArtComprados[i]._id,update,{ session, new:true})
   if(resart == null){
    throw new Error("Compra no encontrada")
  }
  
  arrArts.push(resart)
  
  
    }
  if(req.body.arrRegs.length == 0 || req.body.arrRegs == undefined ){
  throw new Error("sin arrRegs q eliminar")
  }
    for(let y=0;y<req.body.arrRegs.length;y++){
    
    let regdata =  await RegModelSass.findByIdAndRemove(req.body.arrRegs[y], { session })

    if(regdata == null){
      throw new Error("Registros no encontrados")
    }
    let newDeleteReg={
      ...regdata.toObject(),
      Estado:false,
        TiempoDelete: new Date().getTime(),
        
      UsuarioDelete:req.body.UsuarioDelete
    }

    let newRegDelete = await RegModelSassDelete.create([newDeleteReg],{session})
    
  
    arrRegs.push(regdata)
    arrRegsDell.push(newRegDelete[0])



    if(regdata.Accion == "Ingreso"){
      const fixedImport= new mongoose.Types.Decimal128((parseFloat(regdata.Importe )* -1).toFixed(2))
      let updateIng = { $inc: { DineroActual: fixedImport} }

      let cuentaUpdate=  await CuentasModelSass.findByIdAndUpdate(regdata.CuentaSelec.idCuenta,updateIng,{session, new:true})
      if(cuentaUpdate == null){
        throw new Error("Cuenta no encontrada")
      }
      arrCuentas.push(cuentaUpdate)

    }


    }
    for(let x=0;x<req.body.Fpago.length;x++){
      let val = ""
      let c = req.body.Fpago[x].Cantidad;
if (typeof c === 'number') {
  
  val = String(c)
} else if (typeof c === 'string') {
  // Elimina comillas extra si las tiene, pero deja el string
  val=c
}

      const fixedImportFpago= new mongoose.Types.Decimal128(val)
    
    
     let update2= { $inc: { DineroActual:fixedImportFpago } }
    
    
    let cuentaActualizada =   await  CuentasModelSass.findByIdAndUpdate(req.body.Fpago[x].Cuenta._id,update2,{ session, new:true})
    if(cuentaActualizada == null){
      throw new Error("Cuenta de pago no encontrada")
    }
    arrCuentas.push(cuentaActualizada)
   
    if(x == req.body.Fpago.length - 1){
       await session.commitTransaction();
        session.endSession();
      return  res.json({status: "Ok", message: "compra Eliminada", Compra, arrRegs, arrArts, arrCuentas, arrRegsDell });
       
     
      }
    }
   
    }catch (error) {
  await session.abortTransaction();
  session.endSession();
  console.log(error, "errr");

  return res.status(400).json({
    status: "error",
    message: error.message,
   // Solo el mensaje, para que llegue limpio al frontend
  });
}
  






  



}
async function editCombo(req,res){
   
  let data = req.body
  let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let update= {
    
    Titulo:data.Namecombo,
    Precio_Venta:data.TotalValorCompra,
    Precio_Alt:data.TotalValorCompraAlt,           
    Producs:data.ArtAddCalc        

  }
  if(req.body.newImg!==""){{
    update.Imagen =  req.body.newImg.concat(req.body.urlImg)
  }}
  ArticuloModelSass.findByIdAndUpdate(req.body.idArt,update,(err, artUpdate)=>{
    if(err)   return res.json({status: "Error", message: "error al registrar", error });
    
    res.status(200).send({status: "actualizar art", artUpdate });
  })

}
const editService=async(req, res)=>{
   
  let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);


  let update = {    
    Categoria:req.body.catSelect,
      SubCategoria:req.body.subCatSelect,

    Titulo: req.body.TituloServ,
    TiempoReq:{tiempo:req.body.Timereq,Formato:req.body.TimeMesuare},
    
    Precio_Venta:req.body.PrecioServ,
    Precio_Alt:  req.body.PrecioServAlt,
    Precio_Compra:parseFloat(req.body.PrecioCompraServ),
  
    Iva:req.body.Iva,
    Imagen:req.body.urlImg
 
}
if(req.body.newImg!==""){{
  update.Imagen =  req.body.newImg.concat(req.body.urlImg)
}}

ArticuloModelSass.findByIdAndUpdate(req.body.idArt,update,{new:true},(err, artUpdate)=>{
  if(err)   return res.json({status: "Error", message: "error al registrar", error });
  
  res.status(200).send({status: "actualizar art", Articulo:artUpdate });
})

}



const dataInv=(req, res)=>{

  let idCuentaInv = "62743e7b9222840d383610a9"; 
  Cuentasmodel.findById(idCuentaInv, (err, cuenta)=>{
    if(err) return res.status(500).send({message:"error en la actualizar Cuenta",err})
    res.status(200).send({status: "cuentainv",   cuenta});
  })

}

const deleteServComb= async(req, res)=>{
 
let conn = await mongoose.connection.useDb(req.body.UserData.DBname);
let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
const session = await mongoose.startSession();   
session.startTransaction();
try{
 let  articDelete =  await ArticuloModelSass.findByIdAndDelete(req.body._id, {session})
  await session.commitTransaction();
  res.status(200).send({message:"Articulo Eliminado",articDelete})
     session.endSession();
}catch(error){
  await session.abortTransaction();
  session.endSession();
  console.log(error, "errr")
  return res.json({status: "Error", message: "error al registrar", error });
}

}

const deleteArt= async(req, res)=>{
  
  let conn = await mongoose.connection.useDb(req.body.UserData.DBname);

  let RegModelSass = await conn.model('Reg', regSchema);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
   let CounterModelSass = await conn.model('Counter', counterSchema);
   let CatModelSass = await conn.model('Categoria', catSchema);

  const session = await mongoose.startSession();   
  session.startTransaction();
  try{
    let catGasInv=  await CatModelSass.find({idCat:18}, null,{session, new:true} ) //perdida inventario
let valEgresado = req.body.CantidadEgreso
let cuentainv =  await CuentasModelSass.find({iDcuenta:req.body.Bodega_Inv}, null,{session, new:true} )
let dataregSI= { Accion:"Gasto",   
    Tiempo:req.body.tiempo,
    IdRegistro:req.body.idReg ,
  
    CuentaSelec:{idCuenta:cuentainv[0]._id,
      nombreCuenta: cuentainv[0].NombreC,
      valorCambiar:cuentainv[0].DineroActual,
                },
  
                CatSelect:{idCat:catGasInv[0].idCat,
                  urlIcono:catGasInv[0].urlIcono,
                  nombreCat:catGasInv[0].nombreCat,
                  subCatSelect:catGasInv[0].subCatSelect,
                  _id:catGasInv[0]._id,
                },
  
    Nota:"Eliminado manualmente / "+ req.body.Titulo,
    Descripcion:"Unidades egresadas: "+req.body.Existencia,
    Estado:false,
    urlImg:[],
    Valrep:"No",
    TipoRep:"",
    Importe:valEgresado,
    Usuario:{
      Nombre:req.body.Vendedor.Nombre,
      Id:req.body.Vendedor.Id,
      Tipo:req.body.Vendedor.Tipo,
  
    }
  }

  let updateSI = { $inc: { DineroActual: valEgresado *-1  } }

   let reg1 = await RegModelSass.create([dataregSI],{session} )
 let cuentaupdate =   await CuentasModelSass.findByIdAndUpdate(cuentainv[0]._id,updateSI,{session, new:true})
  let articDelete =  await ArticuloModelSass.findByIdAndDelete(req.body._id, {session})
    
   
   let updateCounterCompra = {  $inc: { ContRegs: 1, } }
   await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updateCounterCompra,{session} )

   await session.commitTransaction();
   res.status(200).send({message:"Articulo Eliminado",articDelete, cuentaupdate, registro:reg1})
      session.endSession();
  }catch(error){
    await session.abortTransaction();
    session.endSession();
    console.log(error, "errr")
    return res.json({status: "Error", message: "error al registrar", error });
  }

}

function  validateCompraFact (req, res){
   

  let  urlAuth = "https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl"

  soap.createClient(urlAuth, {}, function(err, client) {
 

    client.autorizacionComprobante({claveAccesoComprobante:"0809202201179191912200120013020000018230000000111"}, async (err,auth)=>{     
    
      if(err) console.log(err)  
   
   if(auth.RespuestaAutorizacionComprobante.autorizaciones){
      let resdata = auth.RespuestaAutorizacionComprobante.autorizaciones.autorizacion
   
                      if(resdata.estado == "AUTORIZADO"){
                        res.status(200).send({status: "ok", message: "factura validada", resdata});
                        
                      }else if(resdata.estado == "EN PROCESO"){
                        res.status(500).send({status: "process", message: "en proceso",resdata});
                    
                    
                      }else{                  
                  
                        res.status(500).send({status: "error", message: "error en validacion",resdata});
                      }
    }else{
       
        res.status(500).send({status: "error", message: "sin autorizacion "});
        
        }
  
  
         }) 
         })  

}

function  resendAuthFact (req, res){

 

  let  urlAuth = "https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl"
  
  soap.createClient(urlAuth, {}, function(err, client) {
 

  client.autorizacionComprobante({claveAccesoComprobante:req.body.allData.ClaveAcceso}, async (err,auth)=>{     
  
    if(err) console.log(err)  
   
 if(auth.RespuestaAutorizacionComprobante.autorizaciones){
    let resdata = auth.RespuestaAutorizacionComprobante.autorizaciones.autorizacion

    if(resdata.estado == "AUTORIZADO"){
      let newHtml = req.body.extradata.Html
      newHtml.replace("EN PROCESO","AUTORIZADO")

      newHtml.replace("xx-en-espera--xx",resdata.fechaAutorizacion)
      newHtml.replace("00000000000",resdata.numeroAutorizacion)
    
    
    pdf.create(newHtml, {      
      
      border: {
          top: "0px",            // default is 0, units: mm, cm, in, px
          right: "0px",
          bottom: "0px",
          left: "0px"
        },
        childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toBuffer(async (err, buffer) => {
      
          if (err) {console.log(err); throw new Error("error al crear pdf")}
    
          let datafind = await CounterModelSass.find({ iDgeneral:9999990})
          let usermail ='iglassmailer2020@gmail.com'
          let userpass =process.env.REACT_MAILER_PASS
               if(datafind.length > 0){
                usermail = datafind[0].Data[0].user
                userpass = datafind[0].Data[0].pass
               }
    
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              
                    user: usermail,
                    pass: userpass,
               
            }
          })
    
          let subjectsting = `Factura ${req.body.allData.nombreComercial} Nº ${req.body.allData.estab}${req.body.allData.ptoEmi}-${req.body.allData.secuencial}  `;
          
          let adjuntos = [
            {
                filename: `${req.body.allData.nombreComercial}-${req.body.allData.secuencial}.pdf`, // <= Here: made sure file name match
                content: buffer,
                contentType: 'application/pdf'
            },
            {
              filename: `${req.body.allData.nombreComercial}-${req.body.allData.secuencial}.xml`, // <= Here: made sure file name match
              content: Buffer.from(resdata.comprobante),
              contentType: 'application/xml'
          },
          
    
        ]
        let textstingdev =
        `<table width="90%" border="1">
        <tbody>
        <tr>
        <td align="center">Estimad@ informamos que su comprobante electronico ha sido emitido exitosamente</td>
        </tr>
        </tbody>
        </table>
        <table width="90%" border="0" cellpadding="0" cellspacing="5">
        <tbody>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        <tr>
        <th align="right">Razón Social:</th>
        <td>${req.body.allData.razon}</td>
        </tr>
        <tr>
        <th align="right">RUC:</th>
        <td>${req.body.allData.ruc}</td>
        </tr>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        <tr>
        <th align="right">Cliente:</th>
        <td>${req.body.allData.razonSocialComprador}</td>
        </tr>
        <tr>
        <th align="right">Identificaci&oacute;n Cliente:</th>
        <td>${req.body.allData.identificacionComprador}</td>
        </tr>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        <tr>
        <th align="right">Ambiente:</th>
        <td>Produccion</td>
        </tr>
        <tr>
        <th align="right">Tipo de Comprobante:</th>
        <td>Factura</td>
        </tr>
        <tr>
        <th align="right">Fecha de Emisi&oacute;n:</th>
        <td>${resdata.fechaAutorizacion}</td>
        </tr>
        <tr>
        <th align="right">Nro. de Comprobante:</th>
        <td>${req.body.allData.estab}${req.body.allData.ptoEmi}-${req.body.allData.secuencial}</td>
        </tr>
        <tr>
        <th align="right">Valor Total:</th>
        <td>${parseFloat(req.body.allData.SuperTotal).toFixed(2)}</td>
        </tr>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        <tr>
        <th align="right">Nro. Autorizacion SRI:</th>
        <td>${resdata.numeroAutorizacion}</td>
        </tr>
        <tr>
        <th align="right">Clave de Acceso:</th>
        <td>${req.body.allData.ClaveAcceso}</td>
        </tr>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        </tbody>
        </table>
        <table width="90%" border="1">
        <tbody>
        <tr>
        <td align="center">Documento Generado por Contalux S.A 2022</td>
        </tr>
        </tbody>
        </table>`

        var mailOptions = {
          from: 'iglassmailer2020@gmail.com',
          to: req.body.extradata.correoCliente,
          subject: subjectsting,
          html: textstingdev,
          attachments: adjuntos
        }

        transporter.sendMail(mailOptions, function (err, res) {
          if(err){
              console.log(err);
          } else {
              console.log('Email Sent');
          }
        })

        let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
        let VentaModelSass = await conn.model('Venta', ventasSchema);
        

        let update = {
          Html:newHtml,
          Estado:"AUTORIZADO"
        }

        let nuevaVenta =  await VentaModelSass.findByIdAndUpdate(req.body.extradata._id, update,{new:true})
        if(nuevaVenta == null){
          throw new Error("venta no encontrado")
        }


      res.status(200).send({status: "ok", message: "FACTURA AUTORIZADA",nuevaVenta});

        })
       
    }  else if(resdata.estado == "EN PROCESO"){
      res.status(500).send({status: "error", message: "AuthSucess",resdata});
  
  
    } else{


      res.status(500).send({status: "error", message: "error al generar",resdata});
    }}else{
     
      res.status(500).send({status: "error", message: "la clave de acceso esta en consulta",});
    }


       }) 
       })  


      }
function  uploadSignedXml (req, res){
   
  let url =""

  if(req.body.ambiente =="Produccion"){
    url = "https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl"
  }else if (req.body.ambiente =="Pruebas"){
    url = "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl"
}


var xmlBase64 =  Buffer.from(req.body.doc).toString('base64');
const options = {
  wsdl_options: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
    },
    rejectUnauthorized: false, // Evita errores con certificados SSL
    timeout: 15000 // Aumenta el tiempo de espera
  }
};


soap.createClient(url, options, function(err, client) {
 console.log("cliente funcional")
  if (err){
    res.send({status: "fatalerror", message: "error en la creacion del clienteSoap"}); 
  }else{
    if(client == undefined){
      res.send({status: "fatalerror", message: "error en la creacion del clienteSoap, indefinido"}); 
    }
  
    else if(client != undefined){
      console.log("cliente encontrado")
     
      client.validarComprobante({xml:xmlBase64}, function(err, result) {
        
        if (err){
          console.log("error en validarComprobante")
          console.log(err)
          res.send({status: "fatalerror", message: "error en validarComprobante ",result,err});
        }
      
       else if(result != undefined){
        if(result.RespuestaRecepcionComprobante){
         
          if(result.RespuestaRecepcionComprobante.estado == "RECIBIDA"){
            console.log("Recibido")
            setTimeout(()=> {
              Authdata()
            },500)
           
           
       
          }
    
          else if(result.RespuestaRecepcionComprobante.estado == "DEVUELTA" ){
            let resdata = result.RespuestaRecepcionComprobante.comprobantes.comprobante
            console.log("DEVUELTA")
            res.status(200).send({status: "error", message: "errorAccess",resdata});
          }
    
          else{
            
            res.status(200).send({status: "fatalerror", message: "errorAccess",result});
          }
           
          
          }else {
                res.send({status: "faltaerror", message: "errorAccess", result});
          }  
          }
          
          else {
        res.send({status: "fatalerror", message: "Error en encontrar result Validacion comprobante", result});
                } 
  
        })
      
      }
  }
 

  
})


const  Authdata =()=>{
 
  
    let urlAuth 
    if(req.body.ambiente =="Produccion"){
      urlAuth = "https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl"
    }else if (req.body.ambiente =="Pruebas"){
    urlAuth = "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl"
      }
  
    soap.createClient(urlAuth, {}, function(err, client) {
   
    client.autorizacionComprobante({claveAccesoComprobante:req.body.codigo}, async (err,auth)=>{     
    console.log(auth)
      if(err)  res.status(500).send({status: "error", message: "AuthSucess",auth});
    
      if(auth.RespuestaAutorizacionComprobante.autorizaciones ){
      let resdata = auth.RespuestaAutorizacionComprobante.autorizaciones.autorizacion
    
      if(resdata.estado){

        if(resdata.estado == "AUTORIZADO"){

        

          res.status(200).send({status: "ok", message: "AuthSucess",resdata});
            
        
        
        }
        else if(resdata.estado == "EN PROCESO"){
          res.status(500).send({status: "error", message: "AuthSucess",resdata});
        }else {
          res.status(500).send({status: "error", message: "AuthSucess",resdata});
        }
      }
        
  
       
}      else{


          res.status(500).send({status: "error", message: "sin autorizacion",auth});
        }

       
      
         }) 
         })}  
}


async function  getUA (req, res){

  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let CounterModelSass = await conn.model('Counter', counterSchema);

  let ClienteModelSass = await conn.model('Cliente', clientSchema);
  let contadoresHabiles = await CounterModelSass.find({iDgeneral:9999999})
  
  let clientesHabiles = await ClienteModelSass.find()
  //let cuentasHabiles = await CuentasModelSass.find({Permisos:req.body.User.Tipo})
  let allCuentasHabiles = await CuentasModelSass.find()
  //let regsHabiles = await RegModelSass.find({'Usuario.Id' :req.body.User.Id })

  res.status(200).send({status: "Ok", message: "getUA",clientesHabiles,contadoresHabiles,allCuentasHabiles});
}

async function  uploadFirmdata (req, res){
  let MainConn = await mongoose.connection.useDb("datashop");  

  let UserModelSass = await MainConn.model('usuarios', UserSchema);
  let update = {Firmdata:{
    url:req.body.url,
    pass:req.body.pass,
    valiteFirma:req.body.valiteFirma
  }}
  let newuser = await UserModelSass.findByIdAndUpdate(req.body.idUser,update, {new:true})
  res.status(200).send({status: "Ok", message: "uploadFirmData", user:newuser});
}




async function  uploadFactData (req, res){
  let MainConn = await mongoose.connection.useDb("datashop");  
  
  let UserModelSass = await MainConn.model('usuarios', UserSchema);

let urgGen = req.body.urlLogoEmp == ""?"https://contalux.herokuapp.com/logomin.png":req.body.urlLogoEmp

let update = {Factura:{
  ruc:req.body.ruc,
  razon:req.body.razon,
  nombreComercial:req.body.nombreComercial,
  dirMatriz:req.body.dirMatriz,
  dirEstab:req.body.dirEstab,
  codigoEstab:req.body.codigoEstab,
  codigoPuntoEmision:req.body.codigoPuntoEmision,
  contriEspecial:req.body.contriEspecial,
  ObligadoContabilidad:req.body.contabilidad,
  rimpe:req.body.rimpe,
  retencion:req.body.retencion,
  logoEmp:urgGen,
  populares:req.body.populares
  }}
let newuser = await UserModelSass.findByIdAndUpdate(req.body.idUser,update, {new:true})



res.status(200).send({status: "Ok", message: "uploadFactData", user:newuser});
}



async function  downLoadFact (req, res){

   let conn = await mongoose.connection.useDb(req.body.User.DBname);
   let VentaModelSass = await conn.model('Venta', ventasSchema);
   let getVenta = await VentaModelSass.findById(req.body._id)

   if( getVenta&& getVenta.Html  ){
  pdf.create(getVenta.Html, {
  
  
    border: {
        top: "0px",            // default is 0, units: mm, cm, in, px
        right: "0px",
        bottom: "0px",
        left: "0px"
      },
      childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toBuffer(async (err, buffer) => {
    
        if (err) {console.log(err); throw new Error("error al crear pdf")}
  
       
        res.status(200).send({status: "Ok", message: "Factok", buffer});
  
      
      })}else{
        res.status(200).send({status: "error", message: "venta no encontrada"});
      }

}

async function  downloadPDFbyHTML (req, res){


  if( req.body.Html  ){
 pdf.create(req.body.Html, {
 
 
   border: {
       top: "0px",            // default is 0, units: mm, cm, in, px
       right: "0px",
       bottom: "0px",
       left: "0px"
     },
     childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toBuffer(async (err, buffer) => {
   
       if (err) {console.log(err); throw new Error("error al crear pdf")}
 
      
       res.status(200).send({status: "Ok", message: "Factok", buffer});
 
     
     })}else{
       res.status(200).send({status: "error", message: "Ingrese el HTML"});
     }

}

async function  enviarCoti (req, res){
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
 
let CounterModelSass = await conn.model('Counter', counterSchema);
pdf.create(req.body.html, {
  
  
  border: {
      top: "0px",            // default is 0, units: mm, cm, in, px
      right: "0px",
      bottom: "0px",
      left: "0px"
    },
    childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toBuffer(async (err, buffer) => {
  
      if (err) {console.log(err); throw new Error("error al crear pdf")}

      let datafind = await CounterModelSass.find({ iDgeneral:9999990})
      let usermail ='iglassmailer2020@gmail.com'
      let userpass =process.env.REACT_MAILER_PASS
           if(datafind.length > 0){
            usermail = datafind[0].Data[0].user
            userpass = datafind[0].Data[0].pass
           }

      if(req.body.cotiToClient){
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            
                  user: usermail,
                  pass: userpass,
             
        
          }
        })
        let subjectsting = `Cotizacion ${req.body.allData.nombreComercial} Nº ${req.body.allData.idCoti} `;
        let textstingdev =
        `<table width="90%" border="1">
        <tbody>
        <tr>
        <td align="center">Estimad@ informamos que su cotización electrónica ha sido emitido exitosamente</td>
        </tr>
        </tbody>
        </table>
        <table width="90%" border="0" cellpadding="0" cellspacing="5">
        <tbody>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        <tr>
        <th align="right">Razón Social:</th>
        <td>${req.body.allData.razon}</td>
        </tr>
        <tr>
        <th align="right">RUC:</th>
        <td>${req.body.allData.ruc}</td>
        </tr>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        <tr>
        <th align="right">Cliente:</th>
        <td>${req.body.allData.razonSocialComprador}</td>
        </tr>
        <tr>
        <th align="right">Identificaci&oacute;n Cliente:</th>
        <td>${req.body.allData.identificacionComprador}</td>
        </tr>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        <tr>
        <th align="right">Ambiente:</th>
        <td>Produccion</td>
        </tr>
        <tr>
        <th align="right">Tipo de Comprobante:</th>
        <td>Cotización</td>
        </tr>
        
        <tr>
        <th align="right">Nro. de Comprobante:</th>
        <td>${req.body.allData.idCoti}</td>
        </tr>
        <tr>
        <th align="right">Valor Total:</th>
        <td>${parseFloat(req.body.allData.SuperTotal).toFixed(2)}</td>
        </tr>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        <tr>
     
        </tr>
        <tr>
    
        </tr>
        <tr>
        <th align="right"></th>
        <td></td>
        </tr>
        </tbody>
        </table>
        <table width="90%" border="1">
        <tbody>
        <tr>
        <td align="center">Documento Generado en contaluxe.com </td>
        </tr>
        </tbody>
        </table>`
      
      
        var mailOptions = {
          from: 'iglassmailer2020@gmail.com',
          to: req.body.correo,
          subject: subjectsting,
          html: textstingdev,
          attachments: [
            {
                filename: `${req.body.allData.nombreComercial}-cotizacion-${req.body.allData.idCoti}.pdf`, // <= Here: made sure file name match
                content: buffer,
                contentType: 'application/pdf'
            },
          
    
        ]
        }
        
        transporter.sendMail(mailOptions, function (err, res) {
          if(err){
              console.log(err);
          } else {
              console.log('Email Sent');
          }
        })
      
      
      
      }

      let updatecounter = { $inc: { ContCotizacion: 1 } }
      await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{ new:true} )
      


      res.status(200).send({status: "Ok", message: "Coti Enviada", buffer});

    
    })

}


var multiparty = require('multiparty');
const cloudinary = require('cloudinary').v2;




function  signatureCloudi (req, res){

  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    console.log(fields)
    var fileGettingUploaded = files.img[0].path;
 
    let options ={
      resource_type: "auto",
      type: 'authenticated',
      sign_url: true,
      access_mode:'authenticated',
      upload_preset:"dv6fhl5k"
    }
   
    let sha1_base64=(txt)=> {
      let md = Forge.md.sha1.create();
      md.update(txt,"utf8");
      return Buffer.from(md.digest().toHex(), 'hex').toString('base64');
      }
    let generateURL=(url, key, name)=>{

      let stringdata = name +""+key 
      let base64 = sha1_base64(stringdata)

    
      let signature = `s--${base64.slice(0, 8)}--` 
      let chanceUrl = url.replace(signature,"x-x-x-x")
      let secureUrl = chanceUrl.replace(process.env.CLOUDINARY_CLOUD_NAME,"y-y-y-y" )

      return secureUrl
    }
  
    cloudinary.uploader.upload(fileGettingUploaded,options, async (err, result)=> {
        console.log(result);

       let newurl = await generateURL(result.url, process.env.CLOUDINARY_API_SECRET,result.public_id)
       
   
       let conn = await mongoose.connection.useDb("datashop");
       let UserModelSass = await conn.model('usuarios', UserSchema);
       let userfinded = await UserModelSass.findById(fields.idUser[0]) 
       userfinded.Firmdata.url = newurl
       userfinded.Firmdata.publicId = result.public_id
       userfinded.Firmdata.pass =  fields.pass[0]
       userfinded.Firmdata.valiteFirma = true
       let updateUser = await userfinded.save()
       res.status(200).send({status: "Ok", message: "ok dataupload",user:updateUser });
    });
  })
  
 

}



async function  editSeller (req, res){
   console.log(req.body)
  let MainConn = await mongoose.connection.useDb("datashop"); 
  let UserModelSass = await MainConn.model('usuarios', UserSchema);
  let adminuser = await UserModelSass.findById(req.body.idUser)
  let vendedorIndex = adminuser.Vendedores.findIndex(x=>x.Id == req.body.sellerToEddit.Id)
  
  console.log(vendedorIndex)
  let updateData =  { 
    Id:req.body.sellerToEddit.Id,
    Usuario: req.body.sellerToEddit.Usuario,
    Facturacion: req.body.sellerToEddit.Facturacion,
    Correo: req.body.sellerToEddit.Correo,
    Confirmacion:req.body.sellerToEddit.Confirmacion,
    Tipo:req.body.sellerToEddit.Tipo,
  }

  adminuser.Vendedores[vendedorIndex] = updateData

  let updateUser = await adminuser.save()

let updateSeller =""
let Factura=""
let Firmdata=""

if(req.body.sellerToEddit.Facturacion){
  Factura=req.body.Factura
  Firmdata=req.body.Firmdata
  
}
updateSeller={
  Usuario:req.body.sellerToEddit.Usuario,
  Email:req.body.sellerToEddit.Correo,
  Tipo:req.body.sellerToEddit.Tipo,
  Factura,
  Firmdata,
}
if(req.body.newpass.trim() != ''){
  console.log("en newpass")
  let updatedPass =   bcrypt.hashSync(req.body.newpass.trim(), 10);
  console.log(updatedPass)
  updateSeller={
    Usuario:req.body.sellerToEddit.Usuario,
    Email:req.body.sellerToEddit.Correo,
    Password:updatedPass,
    Tipo:req.body.sellerToEddit.Tipo,
    Factura,
    Firmdata,
  }
}

   await UserModelSass.findByIdAndUpdate(req.body.sellerToEddit.Id, updateSeller)



  res.status(200).send({status: "ok", message: "addslet", user:updateUser});

}

async function  deleteSeller (req, res){
   
  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let MainConn = await mongoose.connection.useDb("datashop"); 

  let UserModelSass = await MainConn.model('usuarios', UserSchema);


  let adminuser = await UserModelSass.findById(req.body.idUser)
console.log(adminuser)
  let nuevosvend = adminuser.Vendedores.filter(x=>x.Id != req.body.Id)

  adminuser.Vendedores = nuevosvend

  let updateUser = await adminuser.save()
  let updatecounter = { $inc: { ContVendedores: 1 } }
  let CounterModelSass = await conn.model('Counter', counterSchema);
  await UserModelSass.findByIdAndDelete(req.body.Id)
  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{ new:true} )

  res.status(200).send({status: "ok", message: "addslet", user:updateUser});

}

async function  uploadNewSeller (req, res){
  
  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let MainConn = await mongoose.connection.useDb("datashop"); 
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let UserModelSass = await MainConn.model('usuarios', UserSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);




  
  const session = await mongoose.startSession();  
    session.startTransaction();

  let newUser = await UserModelSass.find({ Usuario: req.body.VUsuario })
  let newMail = await  UserModelSass.find({ Email: req.body.Vcorreo })
console.log(newUser)
console.log(newMail)
if (newUser.length == 0 && newMail.length == 0 ){
try{
  Firmdata = req.body.Firmdata
  Factura = req.body.Factura

  const opts= { session, new:true};
  let Counterx =     await CounterModelSass.find({iDgeneral:9999999},null, {session} )
 
  let nuevaCuenta=  await  CuentasModelSass.create([{
    CheckedA: false,
    CheckedP: false,
    Visibility: true,
    Tipo: "Trabajadores",
    FormaPago:"Transferencia",
    NombreC: req.body.VUsuario,
    DineroActual: 0,
    iDcuenta: Counterx[0].Contmascuenta,
    Descrip: "",
    Permisos:["administrador","tesorero"],
    Background:{Seleccionado:"Solido",
    urlBackGround:"/fondoscuentas/amex1.png",
    colorPicked:"#70ade2"}
      }], opts )


  let getUser = await UserModelSass.create([{
    Usuario: req.body.VUsuario,
    Tipo:req.body.workerType,
    Telefono: "", 
    Confirmacion:false,
    Email: req.body.Vcorreo,
     Password: req.body.Vpass,
     RegistradoPor:"administrador",
     DBname:req.body.User.DBname,
     Membresia:"trabajador",
     Firmdata,
     Factura,
     IDcuenta:nuevaCuenta[0]._id
      }], opts)

      

  let adminuser = await UserModelSass.findById(req.body.idUser,null, opts)
let newSeller = {
  Id:getUser[0]._id,
  Usuario:getUser[0].Usuario,
  Facturacion:req.body.Facturar,
  Correo:req.body.Vcorreo,
  Confirmacion:false,
  Tipo:req.body.workerType,
  IDcuenta:nuevaCuenta[0]._id

}
  adminuser.Vendedores = adminuser.Vendedores.concat(newSeller)  
  let updateUser = await adminuser.save()
  let updatecounter = { $inc: { ContVendedores: -1,
                                 Contmascuenta: 1 } }


  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{ session} )
  await session.commitTransaction();
  session.endSession();
  res.status(200).send({status: "ok", message: "addslet", user:updateUser});

}catch(error){
  console.log(error)
  await session.abortTransaction();
  session.endSession();
  return res.json({status: "Error", message: "error al registrar", error });
}}else{
  return res.status(200).send({
    success: false,
    status:"error",
            message: 'El correo o usuario ya esta registrado'
  });
}



}

async function  uploadMasiveClients (req, res){
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname)
  let ClienteModelSass = await conn.model('Cliente', clientSchema);
 
const session = await mongoose.startSession();   
session.startTransaction();
try{
  
for(let i = 0; i<req.body.dataToAdd.length;i++){

let clientdata={
  Usuario:req.body.dataToAdd[i].Nombre,
  Tipo:"Cliente",
  Password:"abc123",
  Telefono:req.body.dataToAdd[i].Telefono,
  Ciudad:req.body.dataToAdd[i].Ciudad,
  Direccion:req.body.dataToAdd[i].Direccion,
  Cedula:req.body.dataToAdd[i].Identificacion,
  TipoID:req.body.dataToAdd[i].Tipo,
  Email:req.body.dataToAdd[i].Correo,
  RegistradoPor:"Vendedor",
 
}

  await ClienteModelSass.create([clientdata], {session})
 
}
res.status(200).send({message:"Vendedores Ingresados" })
await session.commitTransaction();
session.endSession();
}catch(error){
    await session.abortTransaction();
    session.endSession();
    console.log(error, "errr")
    return res.json({status: "Error", message: "error al registrar", error });
  }

}
async function  tryToHelp (req, res){


  let conn = await mongoose.connection.useDb("jazmin2024-2226");
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);

  let findarts = await ArticuloModelSass.find({})

let sumtotal = 0


findarts.forEach(async x=> {

 let newval= x.Precio_Compra * x.Existencia

 sumtotal += newval
   })




  res.status(200).send({status: "Ok", message: "getArts",sumtotal});

}
async function  generateFactCompra(req, res){

  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let ComprasModelSass = await conn.model('Compras', ComprasShema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let CatModelSass = await conn.model('Categoria', catSchema);
    let Counterx =     await CounterModelSass.find({iDgeneral:9999999} )
  let claveAccess = req.body.Comprobante.factura.infoTributaria[0].claveAcceso[0]
  
  let findCompra = await ComprasModelSass.find({ClaveAcceso:claveAccess})
 let findCompraID = await ComprasModelSass.find({CompraNumero:Counterx[0].ContCompras})

  if(findCompra.length > 0){
    res.send({status: "error", message: "Factura ya ingresada"});
  }else if(findCompraID.length > 0){
    res.send({status: "error", message: "Vuelva a intentarlo porfavor"});
     }
  
  else{

  const session = await mongoose.startSession();   
  session.startTransaction();
  try{
  

    let articulos = req.body.Comprobante.factura.detalles[0].detalle
    let insumos = articulos.filter(x=>x.insumo)
    let sinInsumos = articulos.filter(x=>x.insumo == null)
    let articulosCrear = 0
    let counterRegs = 0
    let valorInsumos = 0
    let valorInventario = 0
    let articulosGenerados = []
    let articulosCreados = []
    let articulosActualizados = []
    let arrRegs= []
    let arrCuentas= []
    let catIngInv=  await CatModelSass.find({idCat:16}, null,{session, new:true} )
    let catGasInv=  await CatModelSass.find({idCat:17}, null,{session, new:true} )
  
    if(insumos.length > 0){
   
      for(let x = 0;x<insumos.length;x++){
       const fixedImport= new mongoose.Types.Decimal128(JSON.stringify(insumos[x].precioFinal))
       valorInsumos += insumos[x].precioFinal
        let impuesto = parseFloat(insumos[x].impuestos[0].impuesto[0].tarifa[0]) 

        let conImpuesto = parseFloat(insumos[x].impuestos[0].impuesto[0].baseImponible[0]) * parseFloat(`1.${impuesto }`)

        let precioUnitario = parseFloat(conImpuesto.toFixed(2))
      
        let dataArtNew= {
          Eqid:"INSUMO-GEN",
          Diid:"",
          Grupo:"",
          Categoria:{  
            tipocat: 'Articulo',
            subCategoria: [],
            nombreCat: 'GENERAL',
            imagen: [],
            urlIcono: '/iconscuentas/compra.png',
            idCat: 21,
            sistemCat: true
          },
          Subcategoria:"",
          Departamento:"",
          Titulo:insumos[x].descripcion[0],
          Marca:"",
          Existencia:parseFloat(insumos[x].cantidad[0]),
          Calidad:"",
          Color:"",     
          Descripcion:"",
          Garantia:"No",
          Imagen:"",
          Medida:"Unidad",
          Tipo:"Producto",
          Precio_Compra: precioUnitario,
          CantidadCompra: parseFloat(insumos[x].cantidad[0]),
          PrecioCompraTotal:insumos[x].precioFinal,
           Iva:true,
           Bodega_Inv_Nombre: "Inventario ",
           Bodega_Inv:9999998,
      
        }
        articulosGenerados.push(dataArtNew)

        let dataregInsumoGas= { Accion:"Gasto",   
          Tiempo:new Date(req.body.xmlData.fechaAutorizacion[0]).getTime(),
          IdRegistro:Counterx[0].ContRegs + x,
        
          CuentaSelec:{idCuenta:req.body.Fpago[0].Cuenta._id,
                       nombreCuenta: req.body.Fpago[0].Cuenta.NombreC,
           },
        
          CatSelect:{idCat:insumos[x].categoria.idCat,
                        urlIcono:insumos[x].categoria.urlIcono,
                        nombreCat:insumos[x].categoria.nombreCat,
                        subCatSelect:insumos[x].subcategoria,
                        _id:insumos[x].categoria._id,
                      },
                    Nota:"Insumo Facturado en la Compra N° "+Counterx[0].ContCompras ,
        
          Descripcion:req.body.Fpago[0].Detalles,
          Descripcion2:{articulosVendidos:[dataArtNew]},
          CompraNumero:Counterx[0].ContCompras,
          Estado:false,
          urlImg:[],
          Valrep:"No",
          TipoRep:"",
          Importe:fixedImport,
          Usuario:{
            Nombre:req.body.Vendedor.Nombre,
            Id:req.body.Vendedor.Id,
            Tipo:req.body.Vendedor.Tipo,
        
          }
        }

        let reg1 = await RegModelSass.create([dataregInsumoGas],{session} )
        arrRegs.push(reg1[0])
        counterRegs += 1

        let valornegativo = fixedImport * (-1)            
        let update = { $inc: { DineroActual: valornegativo } }
        let cuenta1 =   await CuentasModelSass.findByIdAndUpdate(req.body.Fpago[0].Cuenta._id,update,{session, new:true})
        arrCuentas.push(cuenta1)


      }
   
   
    }
    if(sinInsumos.length > 0){

  let articulosPorCrear = sinInsumos.filter(x => x.itemSelected == null);
let articulosPorActualizar = sinInsumos.filter(x => x.itemSelected && x.itemSelected._id);
      
      if(articulosPorCrear.length > 0){
        console.log("en creador")
        articulosCrear = articulosPorCrear.length

       
        for(let x = 0;x<articulosPorCrear.length;x++){
          
    
          let impuesto = parseFloat(articulosPorCrear[x].impuestos[0].impuesto[0].tarifa[0]) 
          let conImpuesto = parseFloat(articulosPorCrear[x].precioUnitario[0]) * parseFloat(`1.${impuesto }`)
          let precioUnitario = parseFloat(conImpuesto.toFixed(2))
        


       let existencias = (parseFloat(articulosPorCrear[x].cantidad[0]))
       let Precio_Compra = (parseFloat(precioUnitario)) 
       valorInventario += articulosPorCrear[x].precioFinal
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


let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:9999998}, null,{session} )

let ivadata = articulosPorCrear[x].iva == null ? false:
articulosPorCrear[x].iva == true ? true:
articulosPorCrear[x].iva == false? false:false

       let dataArtNew= {
            Eqid:Counterx[0].ContArticulos + x,
            Diid:newid,
            Grupo:"",
            Categoria:articulosPorCrear[x].categoria,
            SubCategoria:articulosPorCrear[x].subcategoria,
            Departamento:"",
            Titulo:articulosPorCrear[x].descripcion[0],
            Marca:"",
            Existencia:existencias,
            Calidad:"",
            Color:"",
            Precio_Compra:precioUnitario,
            Precio_Venta:articulosPorCrear[x].precioVenta,
            Precio_Alt:articulosPorCrear[x].precioVenta - (articulosPorCrear[x].precioVenta *0.20),
           
            Descripcion:"",
            Garantia:"No",
            Imagen:"",
            Medida:"Unidad",
            Tipo:"Producto",
          
            CantidadCompra: parseFloat(articulosPorCrear[x].cantidad[0]),
            PrecioCompraTotal:Precio_Compra*existencias,
            Caduca:caducable,
             Iva:ivadata,
             Bodega_Inv_Nombre: idCuentaInv[0].NombreC,
             Bodega_Inv:9999998,
        Barcode:articulosPorCrear[x].Barcode
          }

          let art = await ArticuloModelSass.create([dataArtNew], { session})
      
          articulosCreados.push(art[0])
        }

      }
      if(articulosPorActualizar.length > 0){
console.log("en actualizador")
      
      
        for(let x = 0;x<articulosPorActualizar.length;x++){
     
  let impuesto = parseFloat(articulosPorActualizar[x].impuestos[0].impuesto[0].tarifa[0]) 
        let conImpuesto = parseFloat(articulosPorActualizar[x].precioUnitario[0]) * parseFloat(`1.${impuesto }`)
        let precioUnitario = parseFloat(conImpuesto.toFixed(2))


          let art = articulosPorActualizar[x].itemSelected
          let nData = articulosPorActualizar[x]
          if(articulosPorActualizar[x].Caduca){
            console.log("caducado")
          }
           else{
          let totalInvertido = art.Precio_Compra * art.Existencia
          let ActualInvertido =parseFloat(precioUnitario)  * parseFloat(nData.cantidad[0])
          let nuevaCantExistencias = art.Existencia + parseFloat(nData.cantidad[0])

          let sumaInvertido =  totalInvertido + ActualInvertido
          let NuevoPrecioCompra = sumaInvertido/nuevaCantExistencias
          if(art.Existencia <= 0){

            NuevoPrecioCompra= ActualInvertido / parseFloat(nData.cantidad[0])
            }

            let updateAS = { 
              
              Existencia: nuevaCantExistencias  ,
              Precio_Compra:NuevoPrecioCompra ,
              CantidadCompra:parseFloat(nData.cantidad[0]),
              Titulo:nData.descripcion[0],
              Categoria:nData.categoria,
              SubCategoria:nData.subcategoria,
              PrecioCompraTotal:ActualInvertido,
              Barcode:nData.Barcode
            }
              
                    
let artupdate = await ArticuloModelSass.findByIdAndUpdate(art._id,updateAS,{ session, new:true} )

if(artupdate == null ){
  
  throw new Error("Articulo no modificado, vuelva intentar en unos minutos")
}
valorInventario += nData.precioFinal
articulosActualizados.push(artupdate)

        }
      }
    }

    

    const fixedImport= new mongoose.Types.Decimal128(valorInventario.toFixed(2))

 
    let valornegativo = fixedImport  * (-1)            
    let update = { $inc: { DineroActual: valornegativo } }
    let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:9999998}, null,{session, new:true} )
    let updateIng = { $inc: { DineroActual: fixedImport } }

    let datareg= { Accion:"Gasto",   
      Tiempo:new Date(req.body.xmlData.fechaAutorizacion[0]).getTime(),
      IdRegistro:Counterx[0].ContRegs + counterRegs,
    
      CuentaSelec:{idCuenta:req.body.Fpago[0].Cuenta._id,
                   nombreCuenta: req.body.Fpago[0].Cuenta.NombreC,
                   },
    
      CatSelect:{idCat:catGasInv[0].idCat,
                    urlIcono:catGasInv[0].urlIcono,
                    nombreCat:catGasInv[0].nombreCat,
                    subCatSelect:catGasInv[0].subCatSelect,
                    _id:catGasInv[0]._id,
                  },
                Nota:"Compra Facturada N°"+Counterx[0].ContCompras+ " / " + req.body.Fpago[0].Tipo ,
    
      Descripcion:req.body.Fpago[0].Detalles,
      Descripcion2:{articulosVendidos:[...articulosActualizados, ...articulosCreados]},
      CompraNumero:Counterx[0].ContCompras,
      Estado:false,
      urlImg:[],
      Valrep:"No",
      TipoRep:"",
      Importe:fixedImport,
      Usuario:{
        Nombre:req.body.Vendedor.Nombre,
        Id:req.body.Vendedor.Id,
        Tipo:req.body.Vendedor.Tipo,
    
      }
    }

    let reg1 = await RegModelSass.create([datareg],{session} )
    arrRegs.push(reg1[0])
    counterRegs += 1

    
    let dataregING= { Accion:"Ingreso",   
      Tiempo:new Date(req.body.xmlData.fechaAutorizacion[0]).getTime(),
      IdRegistro:Counterx[0].ContRegs + counterRegs,
      
      CuentaSelec:{idCuenta:idCuentaInv[0]._id,
                  nombreCuenta: idCuentaInv[0].NombreC,  
                  },
      
                  CatSelect:{
                    idCat:catIngInv[0].idCat,
                   urlIcono:catIngInv[0].urlIcono,
                   nombreCat:catIngInv[0].nombreCat,
                   subCatSelect:catIngInv[0].subCatSelect,
                   _id:catIngInv[0]._id,
              
                 },
                 Nota:"Compra Facturada N°"+Counterx[0].ContCompras+ " / " + req.body.Fpago[0].Tipo ,

      
      Descripcion:req.body.Fpago[0].Detalles,
      Descripcion2:{articulosVendidos:[...articulosActualizados, ...articulosCreados]},
      CompraNumero:Counterx[0].ContCompras,
     Estado:false,
      urlImg:[],
      Valrep:"No",
      TipoRep:"",
      Importe:fixedImport,
      Usuario:{
        Nombre:"Sistema",
        Id:"999999",
        Tipo:"Sistema",
    
      }
      }
 
    let reg2 = await RegModelSass.create([dataregING], {session} )
   
    arrRegs.push(reg2[0])
    counterRegs += 1
  
    let cuenta1 =   await CuentasModelSass.findByIdAndUpdate(req.body.Fpago[0].Cuenta._id,update,{session, new:true})
    let cuenta2 =   await CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id,updateIng,{session, new:true})
    if(cuenta1 == null || cuenta2 == null){
     throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
   }   
arrCuentas.push(cuenta1)
arrCuentas.push(cuenta2)

    }

    let sumaTotalItems = (valorInventario + valorInsumos).toFixed(2)
 if(parseFloat(req.body.TotalPago) != parseFloat(sumaTotalItems)){
console.log(parseFloat(req.body.TotalPago))
console.log(parseFloat(sumaTotalItems))

throw new Error("la suma de los items no corresponde al total")
}   



 let   datacompra ={
  arrRegs:arrRegs.map(x=>x._id),
  CompraNumero:Counterx[0].ContCompras,
  ArtComprados:[...articulosGenerados, ...articulosCreados, ...articulosActualizados],
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
 
}

//let mydata = {...req.body}
//let newDistri =  await UserControl.registerDistri(JSON.stringify(mydata))



let Compra = await ComprasModelSass.create([datacompra], {new:true, session})



let adicionador  = Counterx[0].ContRegs + counterRegs
  let updatecounter = { 
                       ContRegs:adicionador + 1,
                       
                       $inc: { ContArticulos: articulosCrear,
                                ContCompras: 1,
                        }, 
                          
                               }
  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session} )
 

  
   await session.commitTransaction();
      session.endSession();
      return res.status(200).send({message:"Factura Ingresada", Registros:arrRegs, Cuentas:arrCuentas,Compra, articulosCreados, articulosActualizados})                                 

 
  }
  catch(error){
    await session.abortTransaction();
    session.endSession();
    console.log(error, "errr")
    return res.json({status: "Error", message: error, error });
  }

  
}

}
var ObjectId = require('mongodb').ObjectID;
async function  inventarioDelete (req, res){
  console.log("dentro")

  let conn = await mongoose.connection.useDb("IGlassQuito-72287");
  let RegModelSass = await conn.model('Reg', regSchema);
let registrosInventario = await RegModelSass.find({})


let filtrados = registrosInventario.filter(x=> x.CuentaSelec.idCuenta == "63686e7ad6ba9e00165bada7")


filtrados.forEach( async (reg)=>{

  await RegModelSass.findByIdAndDelete(reg._id)
  
  })

res.send({status: "Ok", message: "registros del vendedor",inv:filtrados, });
}
async function vendData(req, res) {
  console.log(req.body)
  try {
    const conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
    const TiposModelSass = await conn.model('tiposmodel', tipoSchema);
    const RegModelSass = await conn.model('Reg', regSchema);
   // const CuentasModelSass = await conn.model('Cuenta', accountSchema);

    //const cuentasHabiles = await CuentasModelSass.find({ Permisos: req.body.Usuario.Tipo });
   // const Allcuentas = await CuentasModelSass.find({});
    const tiposHabiles = await TiposModelSass.find({});

    // Obtener fecha de hoy con rango de horas (00:00:00 - 23:59:59)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Inicio del día
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1); // Inicio del siguiente día

    // Construir filtro base por fecha
    const filtroReg = {
     
  $and: [
    { Tiempo: { $gte: hoy } },
    { Tiempo: { $lte: mañana } },
  ]

    };

    // Si no es administrador, agregar filtro por usuario
    if (req.body.Usuario.Tipo !== "administrador") {
      filtroReg['Usuario.Id'] = req.body.Usuario._id;
    }

console.log()

    const regsHabiles = await RegModelSass.find(filtroReg);

    res.send({
      status: "Ok",
      message: "registros del vendedor",
      regsHabiles,
   //   cuentasHabiles,
      tiposHabiles,
     // Allcuentas
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "Error", message: "Error al obtener los datos", error: err });
  }
}


async function  testingsend (req, res){

let html = "<h1>TESTO</h1>"
  // Example of options with args //
  // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  pdf.create(html, {/* ... */ childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toBuffer((err, buffer) => {

    if (err) {console.log(err); throw new Error("error al crear pdf")}
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        
              user: 'iglassmailer2020@gmail.com',
              pass: process.env.REACT_MAILER_PASS,
         
    
      }
    })
    let subjectsting = `Factura test`;
    let textstingdev =
    `<p>Gracias por preferirnos prod</p>`
      
    var mailOptions = {
      from: 'iglassmailer2020@gmail.com',
      to: 'johnny54wm@gmail.com',
      subject: subjectsting,
      html: textstingdev,
      attachments: [
        {
            filename: `xdds.pdf`, // <= Here: made sure file name match
            content: buffer,
            contentType: 'application/pdf'
        }
    ]
    }
    
    transporter.sendMail(mailOptions, function (err, res) {
      if(err){
          console.log(err);
      } else {
          console.log('Email Sent');
      }
    })
      
      res.status(200).send({status: "Ok", message: "factura Enviada", buffer});

});

  
 
}

async function  addDefaultDataInv(req, res){
  let conn = await mongoose.connection.useDb("newtester54-93377");
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);

console.log("dentro")
let updatedata = await ArticuloModelSass.updateMany({}, {$set: {Bodega_Inv: 9999998, Bodega_Inv_Nombre:"Principal"}})
  res.status(200).send({message:"ok",updatedata })
}
async function  researchArt(req, res){
  let conn = await mongoose.connection.useDb(req.body.UserData.DBname);
  
  let ComprasModelSass = await conn.model('Compras', ComprasShema);
  let VentaModelSass = await conn.model('Venta', ventasSchema);
  let RegModelSass = await conn.model('Reg', regSchema);

 let getCompras = await ComprasModelSass.find({ "ArtComprados._id":ObjectId(req.body.id)})
 let getVentas = await VentaModelSass.find({ "articulosVendidos._id":req.body.id})

 
 let getRegs = await RegModelSass.find({ "CatSelect.idCat":18
                                      ,"Descripcion2.articulosVendidos._id":ObjectId(req.body.id)})
  
  res.status(200).send({message:"ok",Compras:getCompras,Ventas:getVentas,Registros:getRegs })
}
async function  accountF4(req, res){
  let conn = await mongoose.connection.useDb("newtester54-93377");
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
 let allcuentas = await CuentasModelSass.find({})

 allcuentas.forEach(async x=>  {
  const fixedImportTotalPago= new mongoose.Types.Decimal128(parseFloat(0).toFixed(2))
  let updatecuenta = { DineroActual: fixedImportTotalPago }
  await CuentasModelSass.findByIdAndUpdate(x._id,updatecuenta)
 })
 
 let allregs = await RegModelSass.find({})
 console.log(allregs)
 allregs.forEach(async x=>  {
 
  
 let regsdelete = await RegModelSass.findByIdAndDelete(x._id)
 console.log(regsdelete)
 })
 res.status(200).send({message:"ok",allregs })
}
async function  updateVersionSistemCats(req, res){
  let conn = await mongoose.connection.useDb("dtc2024-6279");
  let CatModelSass = await conn.model('Categoria', catSchema);

  let allcats = await CatModelSass.find({urlIcono:null})

  for(let i = 0; i<allcats.length; i++){

    let updateCat= {urlIcono:"/iconscuentas/clasificar.png",
                    sistemCat:false,
                    idCat: 50 + i
    }
    
      let newItem=  await CatModelSass.findByIdAndUpdate(allcats[i]._id, updateCat)

      console.log(newItem)
      }
    
      res.status(200).send({message:"ok",allcats })
}
async function  updateVersionSistemCuentas(req, res){
 let conn = await mongoose.connection.useDb("JohnnyMerizaldeAlmeida-70658");
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let CatModelSass = await conn.model('Categoria', catSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let allcuentas = await CuentasModelSass.find({})
  let tiempo =new Date()
  let catApertura = await CatModelSass.findOne({idCat:9999999}, null,)

  for(let i = 0; i<allcuentas.length; i++){

   let convertVal = new mongoose.Types.Decimal128(parseFloat(allcuentas[i].DineroActual).toFixed(2))


let valuesec = allcuentas[i].DineroActual.$numberDecimal != null?allcuentas[i].DineroActual.$numberDecimal:convertVal


    let update= {urlIcono:"/iconscuentas/wallet.png",
    DineroActual:valuesec,
    Background:{Seleccionado:"Solido",
    urlBackGround:"/fondoscuentas/amex1.png",
    colorPicked:"#ef4f29"
    }
  }
    
      let newItem=  await CuentasModelSass.findByIdAndUpdate(allcuentas[i]._id, update)
      let Counterx =     await CounterModelSass.find({iDgeneral:9999999},null, )
   
      let datatosend={
        Accion:"Ingreso",
        Tiempo: tiempo.getTime(),
        TiempoEjecucion:tiempo.getTime(),
        IdRegistro:Counterx[0].ContRegs + i,
        CuentaSelec:{
          idCuenta:allcuentas[i]._id,
          nombreCuenta:allcuentas[i].NombreC,
        
        },
      
      
          CatSelect:{idCat:catApertura.idCat,
            urlIcono:catApertura.urlIcono,
              nombreCat:catApertura.nombreCat,
            subCatSelect:[],
          _id:catApertura._id
          },
      
          
        Descripcion:"",
        Importe:valuesec,
        Nota:"",
        Usuario:{
          Nombre:"Sistema",
          Id:"999999",
          Tipo:"Sistema",
      
        },
        
        
      }
      
      let regApe = await RegModelSass.create([datatosend])
      

  
      }
    
      res.status(200).send({message:"ok",allcuentas })
}

async function  createSystemCats(req, res){
  let conn = await mongoose.connection.useDb("JohnnyMerizaldeAlmeida-70658");
  let CatModelSass = await conn.model('Categoria', catSchema);
  const opts2 = { new:true};
  await  CatModelSass.create([{
    tipocat: "Ingreso",
    subCategoria: [],
    urlIcono:"/iconscuentas/apertura.png",
    nombreCat:"Apertura",
    idCat:9999999,
    sistemCat:true,
  }],opts2 )

  await  CatModelSass.create([{
    tipocat: "Ingreso",
    subCategoria: [],
    nombreCat:"Sueldo",
    urlIcono:"/iconscuentas/cash2.png",
    idCat:1
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Ingreso",
    subCategoria: [],
    nombreCat:"Negocios",
    urlIcono:"/iconscuentas/negocio.png",
    idCat:2
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Ingreso",
    subCategoria: [],
    nombreCat:"Inversiones",
    urlIcono:"/iconscuentas/inversion.png",
    idCat:3
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Ingreso",
    subCategoria: [],
    nombreCat:"Tienda Virtual",
    urlIcono:"/iconscuentas/venta1.png",
    idCat:4
  }],opts2 )

  await  CatModelSass.create([{
    tipocat: "Ingreso",
    subCategoria: [],
    nombreCat:"Punto de venta",
    urlIcono:"/iconscuentas/venta.png",
    idCat:5,
    sistemCat:true,
  }],opts2 )

  await  CatModelSass.create([{
    tipocat: "Ingreso",
    subCategoria: [],
    nombreCat:"Ingreso Inventario",
    urlIcono:"/iconscuentas/ingresoinv.png",
    idCat:16,
    sistemCat:true,
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Compra Inventario",
    urlIcono:"/iconscuentas/compra1.png",
    idCat:17,
    sistemCat:true,
  }],opts2 )
 
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Perdida Inventario",
    urlIcono:"/iconscuentas/lostinv.png",
    idCat:18,
    sistemCat:true,
  }],opts2 )
 
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Salida Precio Compra Inventario",
    urlIcono:"/iconscuentas/salidainv.png",
    idCat:19,
    sistemCat:true,
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Ingreso",
    subCategoria: [],
    nombreCat:"Credito",
    urlIcono:"/iconscuentas/cre.png",
    idCat:20,
    sistemCat:true,
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Comida",
    urlIcono:"/iconscuentas/comida.png",
    idCat:6
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: ["Luz", "Agua", "Internet"],
    nombreCat:"Servicios Basicos",
    urlIcono:"/iconscuentas/casa.png",
    idCat:7
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Telefono",
    urlIcono:"/iconscuentas/celular.png",
    idCat:8
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Comida extra",
    urlIcono:"/iconscuentas/comida4.png",
    idCat:9
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Transporte",
    urlIcono:"/iconscuentas/taxi.png",
    idCat:10
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Transporte Propio",
    urlIcono:"/iconscuentas/auto.png",
    idCat:11
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Ropa",
    urlIcono:"/iconscuentas/ropa.png",
    idCat:12
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Salud",
    urlIcono:"/iconscuentas/salud1.png",
    idCat:13
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Viajes",
    urlIcono:"/iconscuentas/playa.png",
    idCat:13
  }],opts2 )

  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Lujos",
    urlIcono:"/iconscuentas/joyas.png",
    idCat:14
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Mascotas",
    urlIcono:"/iconscuentas/mascota2.png",
    idCat:15
  }],opts2 )

  await  CatModelSass.create([{
    tipocat: "Articulo",
    subCategoria: [],
    nombreCat:"GENERAL",
    urlIcono:"/iconscuentas/compra.png",
    idCat:21
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Articulo",
    subCategoria: [],
    nombreCat:"PANTALLA",
    urlIcono:"/iconscuentas/celular.png",
    idCat:22
  }],opts2 )

}
async function  updateVersionSistemArts(req, res){
  let conn = await mongoose.connection.useDb("iglass2024-99784");
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);

  let allarts = await ArticuloModelSass.find({})

  for(let i = 0; i<allarts.length; i++){

    let update= {
      Categoria:{
        _id:ObjectId("654839e65b74804c57bf3761"),
        tipocat:"Articulo",
        subCategoria:[],
        nombreCat:"PANTALLA",
        urlIcono:"/iconscuentas/celular.png",
        idCat:22,
        sistemCat:false,
      },
Bodega_Inv:9999998,
    }

    let newItem=  await ArticuloModelSass.findByIdAndUpdate(allarts[i]._id, update, {new:true})
    console.log(newItem)
  }
    


      res.status(200).send({message:"ok",allarts })
      }
     
      async function  getIcons(req, res){
        let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
        let CounterModelSass = await conn.model('Counter', counterSchema);
        let DataIcons =     await CounterModelSass.find({iDgeneral:req.body.iDgeneral} )

        res.status(200).send({message:"Iconos Actualizados", Icons:DataIcons})
      }
      async function  deleteIcon(req, res){
        let conn = await mongoose.connection.useDb(req.body.User.DBname);
        let CounterModelSass = await conn.model('Counter', counterSchema);
        let DataIcons =     await CounterModelSass.find({iDgeneral:req.body.item.iDgeneral} )
        let icons = DataIcons[0].Data.filter(x=> x != req.body.item.seleccionado)
        let updatecounter = { Data: icons}
        let updadatedIcons =   await CounterModelSass.findOneAndUpdate({iDgeneral:req.body.item.iDgeneral}, updatecounter,{ new:true} )
        
        res.status(200).send({message:"Iconos Actualizados", updadatedIcons })
       
      }
      async function  addNewIcons(req, res){
       console.log(req.body)
        let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
        let CounterModelSass = await conn.model('Counter', counterSchema);
      
        let DataIcons =     await CounterModelSass.find({iDgeneral:req.body.iDgeneral} )
        let customIcons = DataIcons[0].Data
        let newIcons =[]
       
  
        newIcons =req.body.urlImg.concat(customIcons )
       
       let updatecounter = { Data: newIcons}
let updadatedIcons =   await CounterModelSass.findOneAndUpdate({iDgeneral:req.body.iDgeneral}, updatecounter,{ new:true} )

res.status(200).send({message:"Iconos Actualizados", updadatedIcons })
      }

      async function  updateDTCarts(req, res){
        let conn = await mongoose.connection.useDb("dtc2024-6279");
        let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
      
        let allarts = await ArticuloModelSass.find({})
        let filteredArt =[]
        allarts.forEach(x=> {

          if(x.Grupo.toLowerCase().includes("pin de carga")
           //|| x.Titulo.toLowerCase().includes("flex de maquina")
          
           ){
              
 filteredArt.push(x)
 console.log(x.Titulo)
          }
        })

       
        filteredArt.forEach(async x=> { 

           await ArticuloModelSass.findByIdAndUpdate(x._id,{
            Grupo:"CELULAR",
           // Categoria:{   },
          //  Marca:"SONY",
        //    Calidad:"ALTA",
         //   Departamento:"REPUESTOS"
           })

          })
     
          
      
      
            res.status(200).send({message:"ok",filteredArt })
            }

            async function masiveApplyTemplate(req, res){
              let conn = await mongoose.connection.useDb("Dtc-58253");
              let ArticuloModelSass = await conn.model('Articulo', );
              let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);

              let allarts = await ArticuloModelSass.find({})
              let allartshtml = await HtmlArtModel.find({})

              let artModel = allartshtml.find(x=>x.Eqid == "DTC1193")

              let Artsgen = allarts.filter(x=>x.Categoria == "CABLE" || x.Categoria == "ESTUCHE" || x.Categoria == "CARGADOR"|| x.Categoria == "AUDIFONOS")
          
             
             Artsgen.forEach(async x=>{

              let newHtmlArt = {
                Eqid:x.Eqid,
                Titulo:x.Titulo,
                idArt:x._id,
                publicHtml:artModel.publicHtml,
                Diseno:artModel.Diseno,
                Tipo:"HtmlArt"
              }

              let newArt = await HtmlArtModel.create([newHtmlArt])
              console.log(newArt)
            })

              
            }
            async function sendSearch(req, res){
          
            console.log(req.body)
                let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
                let RegModelSass = await conn.model('Reg', regSchema);
                const removeAccents = (str) => {
                  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                } 
             
                let condicionesAnd = [];
                let condicionesOr = [];
                if(req.body.searcherOut != ""){
                  condicionesOr = [
                    {"Descripcion": { $regex: removeAccents(req.body.searcherOut), $options: 'i' }},
                    {"Nota": { $regex: removeAccents(req.body.searcherOut), $options: 'i' }}
                  ];
                let valorNumerico = parseFloat(req.body.searcherOut);
                
                let esNumero = !isNaN(valorNumerico);
                if(esNumero){
                 
                  condicionesOr.push({ "Importe": valorNumerico });
                }
                if(req.body.incProducts){
                  condicionesOr.push(  { "Descripcion2.articulosVendidos": { 
                    $elemMatch: { 
                      Titulo: { $regex: req.body.searcherOut, $options: 'i' } 
                    }
                  }}
                )

                condicionesOr.push(  { "Descripcion2.articulosVendidos": { 
                  $elemMatch: { 
                    Eqid: { $regex: req.body.searcherOut, $options: 'i' } 
                  }
                }}
              )

                }
                }
                if (condicionesOr.length > 0) {
                  condicionesAnd.push({ $or: condicionesOr });
                }
                
                if (req.body.CuentasElegidas.length != 0) {
                  let idsCuentas = req.body.CuentasElegidas.map(cuenta => cuenta.id); // Extraemos los IDs

                  let condicionesCuentas = [
                    { "CuentaSelec.idCuenta": { $in: idsCuentas } },
                    { "CuentaSelec2.idCuenta": { $in: idsCuentas } }
                  ];
                  condicionesAnd.push({ $or: condicionesCuentas });
                }
                if (req.body.Categorias.length != 0) {
                  let idsCats = req.body.Categorias.map(cat=> cat._id); 
                  condicionesAnd.push({ "CatSelect._id": { $in: idsCats } });
                }

                if (req.body.subCategorias.length != 0) {   
                  condicionesAnd.push({ "CatSelect.subCatSelect": { $in: req.body.subCategorias } });
                }
                if (req.body.minImport != 0 && req.body.minImport != null) {   
                  condicionesAnd.push({ "Importe": {$gte : req.body.minImport} });
                }
                if (req.body.maxImport != 0 && req.body.maxImport != null) {   
                  condicionesAnd.push({ "Importe": {$lte : req.body.maxImport} });
                }
                if (req.body.UserFilter != "") {   
                  condicionesAnd.push({ "Usuario.Id": req.body.UserFilter  });
                }
                if (req.body.AccionFilter != "") {   
                  condicionesAnd.push({ "Accion": req.body.AccionFilter});
                }
                if (req.body.TiempoFilter != "") {  
                  let tiempoIni 
                  let tiempoFin 
                  if(req.body.TiempoFilter == "Dia"){
                    let datePeriodIni = new Date(req.body.tiempo);
                    datePeriodIni.setHours(0, 0, 0, 0); // establece hora local en 00:00:00.000
                    tiempoIni= datePeriodIni.getTime();
                    let datePeriodFin = new Date(req.body.tiempo);
                    datePeriodFin.setHours(23,59,59,999); // establece hora local en 00:00:00.000
                    tiempoFin= datePeriodFin.getTime();
                 
                  }
                  else if(req.body.TiempoFilter == "Mes"){
                    fecha = new Date(req.body.tiempo)
                    var primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1).getTime()
                    var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
                    var ultimahora = new Date(ultimoDia.setHours(23, 59, 59)).getTime()
                    tiempoIni = primerDia
                    tiempoFin =ultimahora
                   }

                   else if(req.body.TiempoFilter == "Periodo"){
let datePeriodIni = new Date(req.body.tiempo);
datePeriodIni.setHours(0, 0, 0, 0); // establece hora local en 00:00:00.000
tiempoIni= datePeriodIni.getTime();

let datePeriodFin = new Date(req.body.tiempoperiodofin);
datePeriodFin.setHours(0, 0, 0, 0); // establece hora local en 00:00:00.000
tiempoFin= datePeriodFin.getTime();

                    
                   }
          
                   condicionesAnd.push({Tiempo: {$gte : tiempoIni}});
                   condicionesAnd.push({Tiempo: {$lte : tiempoFin}});
     
                }

             
               
                let respuestaRegs = await RegModelSass.find({
                  $and: condicionesAnd
                });
            
                res.status(200).send({ status: "Ok", message: "SendSearch", Regs: respuestaRegs });
           
  
            }

            const getClientData = async (req,res)=>{

              let conn = await mongoose.connection.useDb(req.body.User.DBname);
              let ClienteModelSass = await conn.model('Cliente', clientSchema);
              let CounterModelSass = await conn.model('Counter', counterSchema);
              let CuentasModelSass = await conn.model('Cuenta', accountSchema);

              let contadoresHabiles = await CounterModelSass.find({iDgeneral:9999999})
              let findClient ="Cedula"
              if(req.body.datos != ""){
                findClient = await ClienteModelSass.findById(req.body.datos)
              }
              let CuentaCliente = ""
              if(findClient.IDcuenta)
                {
              
                  CuentaCliente = await CuentasModelSass.findById(findClient.IDcuenta)}

            console.log(findClient)
          

              res.status(200).send({ status: "Ok", message: "findClient",Client:findClient, Counters:contadoresHabiles[0].ContSecuencial, CuentaCliente  });
              
            }
            const deleteNotaCredito = async (req,res)=>{

              

            let conn = await mongoose.connection.useDb(req.body.User.DBname);
            let VentaModelSass = await conn.model('Venta', ventasSchema);
             let RegModelSass = await conn.model('Reg', regSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
let RegModelSassDelete = await conn.model('RegDelete', regSchemaDelete);

let arrCuentas = []
let arrRegs = []
let arrRegsDell = []
const session = await mongoose.startSession();   
  session.startTransaction();
            try{

if(req.body.item.NotaCredito.arrRegs.length == 0 || req.body.item.NotaCredito.arrRegs == undefined ){
  throw new Error("sin arrRegs q eliminar")
  }

  let regdata =   await RegModelSass.findByIdAndRemove(req.body.item.NotaCredito.arrRegs[0], { session })

      if (!regdata) {
        throw new Error(`Registro con ID ${req.body.item.NotaCredito.arrRegs[0]} no encontrado para eliminar.`);
      }
      let newDeleteReg={
        ...regdata.toObject(),
        Estado:false,
        TiempoDelete: new Date().getTime(),
        UsuarioDelete:req.body.UsuarioDelete
      }

      let newRegDelete = await RegModelSassDelete.create([newDeleteReg],{session})
       
      arrRegs.push(regdata)
      arrRegsDell.push(newRegDelete[0])
     
   const fixedImport= new mongoose.Types.Decimal128(JSON.stringify(parseFloat(regdata.Importe)))
        let updateInv = { $inc: { DineroActual:fixedImport *-1 } }
        let cuentaUpdate=  await CuentasModelSass.findByIdAndUpdate(regdata.CuentaSelec.idCuenta,updateInv,{session, new:true})
        arrCuentas.push(cuentaUpdate)
        if(cuentaUpdate == null){
          throw new Error("Cuenta no encontrada")
        }

            let ventac = await VentaModelSass.findByIdAndUpdate(req.body.item._id,{NotaCredito:""}, {new:true})
            if(ventac == null){
              throw new Error("Venta no encontrado")
            }
            
  await session.commitTransaction();
            res.status(200).send({ status: "Ok", message: "Eliminar Nota Credito", Venta: ventac, arrRegs, arrCuentas, arrRegsDell  });
 session.endSession();    }
            catch(e){
    await session.abortTransaction();
    session.endSession();
    console.log(e, "errr")
    return res.json({status: "Error", message: "error al registrar", error:e.message });
  }
              
            }
                const deleteNotaDebito = async (req,res)=>{

              

            let conn = await mongoose.connection.useDb(req.body.User.DBname);
            let VentaModelSass = await conn.model('Venta', ventasSchema);
             let RegModelSass = await conn.model('Reg', regSchema);
            let CuentasModelSass = await conn.model('Cuenta', accountSchema);
             let RegModelSassDelete = await conn.model('RegDelete', regSchemaDelete);
let arrCuentas = []
let arrRegs = []
let arrRegsDell = []
const session = await mongoose.startSession();   
  session.startTransaction();
            try{

if(req.body.item.NotaDebito.arrRegs.length == 0 || req.body.item.NotaDebito.arrRegs == undefined ){
  throw new Error("sin arrRegs q eliminar")
  }
    for(let y=0;y<req.body.item.NotaDebito.arrRegs.length;y++){
      let regdata =   await RegModelSass.findByIdAndRemove(req.body.item.NotaDebito.arrRegs[y], { session })

      if (!regdata) {
        throw new Error(`Registro con ID ${req.body.item.NotaDebito.arrRegs[y]} no encontrado para eliminar.`);
      }
      let newDeleteReg={
        ...regdata.toObject(),
        Estado:false,
        TiempoDelete: new Date().getTime(),
        UsuarioDelete:req.body.UsuarioDelete
      }

      let newRegDelete = await RegModelSassDelete.create([newDeleteReg],{session})
      
    
      arrRegs.push(regdata)
      arrRegsDell.push(newRegDelete[0])
     
      
   
      if(regdata.Accion == "Ingreso"){
        const fixedImport= new mongoose.Types.Decimal128(JSON.stringify(parseFloat(regdata.Importe)))
        let updateInv = { $inc: { DineroActual:fixedImport *-1 } }
        let cuentaUpdate=  await CuentasModelSass.findByIdAndUpdate(regdata.CuentaSelec.idCuenta,updateInv,{session, new:true})
        arrCuentas.push(cuentaUpdate)
        if(cuentaUpdate == null){
          throw new Error("Cuenta no encontrada")
        }
    
      }
   
  

    }
              

            let ventac = await VentaModelSass.findByIdAndUpdate(req.body.item._id,{NotaDebito:""}, {new:true})
            if(ventac == null){
              throw new Error("Venta no encontrado")
            }
            await session.commitTransaction();
            res.status(200).send({ status: "Ok", message: "Eliminar Nota Debito", Venta: ventac, arrRegs, arrCuentas, arrRegsDell  });
 session.endSession();
            }
            catch(e){
    await session.abortTransaction();
    session.endSession();
    console.log(e, "errr")
    return res.json({status: "Error", message: "error al registrar", error:e.message });
  }
          
          }

            async function getDatabaseSize(req,res) {
            
              try {
                  let conn = await mongoose.connection.useDb(req.body.User.DBname);
                  const stats = await conn.db.command({ dbStats: 1, scale: 1024 * 1024 }); // Escala a MB
            
                let data = {
                  storage:stats.storageSize,
                  datasize:stats.dataSize,
                  indexSize:stats.indexSize,

                }

                  res.status(200).send({ status: "Ok", message: "basesdeDatos", data  });

              } catch (error) {
                  console.error("❌ Error obteniendo stats:", error);
              }
          }

          async function correoConfigVerify(req, res) {
            try {
              
              let conn = await mongoose.connection.useDb(req.body.User.DBname);
              let CounterModelSass = await conn.model('Counter', counterSchema);

              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: req.body.datos.senderEmail,
                  pass: req.body.datos.token,
                },
              });
          
              let subjectString = `Envio de prueba`;
          
              const mailOptions = {
                from: req.body.datos.senderEmail,
                to: "iglassmailer2020@gmail.com",
                subject: subjectString,
                text: "testmail",
              };
          
              const info = await transporter.sendMail(mailOptions);
     
     let datafind = await CounterModelSass.find({ iDgeneral:9999990})
console.log(datafind)
     if(datafind.length == 0){
              await CounterModelSass.create([{
  Data:{
    user: req.body.datos.senderEmail,
    pass: req.body.datos.token,
  },
  iDgeneral:9999990
 }])
                        }else{

                          await CounterModelSass.findByIdAndUpdate(datafind._id,
                           {  Data:{
                            user: req.body.datos.senderEmail,
                            pass: req.body.datos.token,
                          },}   
                          )

                        }
              res.status(200).send({ status: "Ok", message: "Correo enviado", info });
            } catch (error) {
              console.error("Error al enviar el correo:", error);
              res.status(500).send({ status: "Error", error: error.message });
            }
          }

          async function getCorreoConfig(req,res) {
            let conn = await mongoose.connection.useDb(req.body.User.DBname);
            let CounterModelSass = await conn.model('Counter', counterSchema);

            let dataconfig = await CounterModelSass.find({iDgeneral:9999990})

            res.status(200).send({ status: "Ok", message: "Correo enviado", dataconfig });

           }
              async function getVentaID(req,res) {

            let conn = await mongoose.connection.useDb(req.body.User.DBname);
         let VentaModelSass = await conn.model('Venta', ventasSchema);
          console.log(req.body)

           let findVenta = await VentaModelSass.find({iDVenta:req.body.datos.id});
           if (!findVenta) {
               return res.status(404).send({ status: "error", message: "Venta no encontrada" });
           }

            res.status(200).send({ status: "Ok", message: "Venta encontrada", findVenta });

           }

           async function deleteCorreoConfigurado(req,res) {
        
            let conn = await mongoose.connection.useDb(req.body.User.DBname);
            let CounterModelSass = await conn.model('Counter', counterSchema);
            await CounterModelSass.findByIdAndDelete(req.body.item._id)
            
            res.status(200).send({ status: "Ok", message: "Correo eliminado" });

             }
             async function updateUser(req,res) {
              console.log(req.body)
              let conn = await mongoose.connection.useDb("datashop");
              let UserModelSass = await conn.model('usuarios', UserSchema);
            
            
             let userfinded = await UserModelSass.findById(req.body.idUser) 
             if (!userfinded) {
              return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
          }
             userfinded.Factura.validateFact = true
             
             let updateUser = await userfinded.save()
            
           
    
              res.status(200).send({status: "ok", message: "AuthSucess", user:updateUser});
                

             }
             async function getDbuserData(req,res) {
              try {
              const getSignature=(url, name)=>{
                let sha1_base64=(txt)=> {
                  let md = Forge.md.sha1.create();
                  md.update(txt,"utf8");
                  return Buffer.from(md.digest().toHex(), 'hex').toString('base64');
                  }
              let stringdata = name +""+process.env.CLOUDINARY_API_SECRET
              let base64 = sha1_base64(stringdata)
              
              let signature = `s--${base64.slice(0, 8)}--` 
              let chanceUrl = url.replace("x-x-x-x",signature)
              let secureUrl = chanceUrl.replace("y-y-y-y",process.env.CLOUDINARY_CLOUD_NAME)
        
              return secureUrl
              }
              const encryptData = (data, secretKey) => {
                return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
            };

              const GeneratedURL = getSignature(
                req.body.datos.url,   
                req.body.datos.publicId
              );

              const response = await fetch(GeneratedURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-pkcs12', 
                },
            });
            
            if (!response.ok) {
              throw new Error(`Error en la descarga: ${response.statusText}`);
          }

              const buffer = await response.arrayBuffer();
        const base64Data = await Buffer.from(buffer).toString('base64');
     
    //    const encryptedData = await encryptData(base64Data, process.env.CLOUDY_SECRET);
      //  console.log("encriptando")
      //  console.log(encryptedData)
        res.send({status: "Ok", data:base64Data});
 
      } catch (error) {
        res.send({status: "Error", message: error});
 
    }
  }
             async function getAllClients(req,res) {
            
              try {
                console.log(req.body)
                  let conn = await mongoose.connection.useDb(req.body.User.DBname);

                  let ClienteModelSass = await conn.model('Cliente', clientSchema);

                  let clientesHabiles = await ClienteModelSass.find()


                  res.status(200).send({ status: "Ok", message: "clientes",  clientesHabiles });

              } catch (error) {
                  console.error("❌ Error obteniendo stats:", error);
              }
          }


          async function editarPrecioCompra(req,res) {


            const session = await mongoose.startSession();  
            session.startTransaction();
           try{
            let conn = await mongoose.connection.useDb(req.body.User.DBname);
            let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
            let RegModelSass = await conn.model('Reg', regSchema);
            let CuentasModelSass = await conn.model('Cuenta', accountSchema);
            let CounterModelSass = await conn.model('Counter', counterSchema);
            let CatModelSass = await conn.model('Categoria', catSchema);
           console.log(req.body)
            let artData = req.body.datos.allData.ArtData

            let actualInvertido = artData.Existencia * artData.Precio_Compra
            let modificacionInversion = artData.Existencia * req.body.datos.PrecioCompraNuevo
            let Counterx =     await CounterModelSass.find({iDgeneral:9999999},null, {session} )
            let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:artData.Bodega_Inv}, null,{session} )
            let tiempo = new Date().getTime()
                     
           let catSalidaInv=  await CatModelSass.find({idCat:18}, null,{session, new:true} )

            let Usuario =req.body.datos.allData.User.update.usuario.user
       
if(req.body.datos.cantidadEsCero){
              let updateArt = { Precio_Compra: req.body.datos.PrecioCompraNuevo } 

let ArticuloActual = await ArticuloModelSass.findByIdAndUpdate(artData._id, updateArt,{session, new:true})
 await session.commitTransaction();
res.status(200).send({status:"Ok",message:"Actualizacion Precio",ArticuloActual})
 session.endSession();
}
          else if(req.body.datos.esMenor){

            
            
             let diferencia = actualInvertido - modificacionInversion
 

const fixedImportGas = new mongoose.Types.Decimal128(parseFloat(diferencia).toFixed(2))
       
             let datareg= { Accion:"Gasto",   
              Tiempo:tiempo,
              TiempoEjecucion:tiempo,
              IdRegistro:Counterx[0].ContRegs,
              
              CuentaSelec:{idCuenta:idCuentaInv[0]._id,
                            nombreCuenta: idCuentaInv[0].NombreC,
                         },
        
                CatSelect:{idCat:catSalidaInv[0].idCat,
                  urlIcono:catSalidaInv[0].urlIcono,
                  nombreCat:catSalidaInv[0].nombreCat,
                  subCatSelect:catSalidaInv[0].subCatSelect,
                  _id:catSalidaInv[0]._id,
             
                },
              
                Nota:"Salida de Precio de Compra "+ " / " + req.body.datos.Justificacion ,
                Descripcion:"",
              Descripcion2:{articulosVendidos:[artData]},
              Estado:false,
              urlImg:[],
              Valrep:"No",
              TipoRep:"",
              Importe:fixedImportGas,
              Usuario:{
                Nombre:Usuario.Usuario,
                Id:Usuario._id,
                Tipo:Usuario.Tipo,
              
              }
              }
              
              let reg1 = await RegModelSass.create([datareg],{session} )
          
              let updateSI = { $inc: { DineroActual: fixedImportGas *-1  } }
              let updateArt = { Precio_Compra: req.body.datos.PrecioCompraNuevo } 
           
let cuentaInvEdit =  await CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id,updateSI,{session, new:true})

let ArticuloActual = await ArticuloModelSass.findByIdAndUpdate(artData._id, updateArt,{session, new:true})
let updatecounter = { $inc: { ContRegs: 1 } }
  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session, new:true} )
  
 await session.commitTransaction();
res.status(200).send({status:"Ok",message:"Baja de Precio Compra",cuentaInvEdit, ArticuloActual, Registro:reg1[0]})
   session.endSession();

            }else if(req.body.datos.esMayor){


              let artData = req.body.datos.allData.ArtData
              let arrRegs = []
              let arrCuentas = []
              let diferencia = modificacionInversion - actualInvertido  
              let catIngInv=  await CatModelSass.find({idCat:16}, null,{session, new:true} )
              const fixedImport = new mongoose.Types.Decimal128(parseFloat(diferencia).toFixed(2))
      
              let dataregIng= { Accion:"Ingreso",   
                Tiempo:tiempo,
                TiempoEjecucion:tiempo,
                IdRegistro:Counterx[0].ContRegs,
                
                CuentaSelec:{idCuenta:idCuentaInv[0]._id,
                              nombreCuenta: idCuentaInv[0].NombreC,
                           },
          
                  CatSelect:{idCat:catIngInv[0].idCat,
                    urlIcono:catIngInv[0].urlIcono,
                    nombreCat:catIngInv[0].nombreCat,
                    subCatSelect:catIngInv[0].subCatSelect,
                    _id:catIngInv[0]._id,
               
                  },
                
                  Nota:"Aumento de Precio de Compra "+ " / " ,
                  Descripcion:"",
                Descripcion2:{articulosVendidos:[artData]},
                Estado:false,
                urlImg:[],
                Valrep:"No",
                TipoRep:"",
                Importe:fixedImport,
                Usuario:{
                  Nombre:Usuario.Usuario,
                  Id:Usuario._id,
                  Tipo:Usuario.Tipo,
                
                }
                }

                let reg1 = await RegModelSass.create([dataregIng],{session} )

            
let updateInv = { $inc: { DineroActual: fixedImport   } }
let UpInv =  await CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id,updateInv,{session, new:true})

arrRegs.push(reg1[0])
arrCuentas.push(UpInv)

                req.body.datos.Fpago.forEach(async (x,i)=>{
                  const fixedImportFpago = new mongoose.Types.Decimal128(parseFloat(x.Cantidad).toFixed(2))
      
                  let datareg= { Accion:"Gasto",   
                    Tiempo:tiempo,
                    TiempoEjecucion:tiempo,
                    IdRegistro:Counterx[0].ContRegs + i,
                    
                    CuentaSelec:{idCuenta:x.Cuenta._id,
                                  nombreCuenta: x.Cuenta.NombreC,
                               },
              
                      CatSelect:{idCat:catIngInv[0].idCat,
                        urlIcono:catIngInv[0].urlIcono,
                        nombreCat:catIngInv[0].nombreCat,
                        subCatSelect:catIngInv[0].subCatSelect,
                        _id:catIngInv[0]._id,
                   
                      },
                    
                      Nota:"Aumento Precio de Compra "+ " / " + x.Tipo ,
                      Descripcion:"",
                    Descripcion2:{articulosVendidos:[artData]},
                    Estado:false,
                    urlImg:[],
                    Valrep:"No",
                    TipoRep:"",
                    Importe:fixedImportFpago,
                    Usuario:{
                      Nombre:Usuario.Usuario,
                      Id:Usuario._id,
                      Tipo:Usuario.Tipo,
                    
                    }
                    }
                    let reg2 = await RegModelSass.create([datareg],{session} )
                    arrRegs.push(reg2[0])

                    let updateSI = { $inc: { DineroActual: fixedImportFpago *-1  } }            
      let cuentaPago =  await CuentasModelSass.findByIdAndUpdate(x.Cuenta._id,updateSI,{session, new:true})
      
      arrCuentas.push(cuentaPago)

                })
                let updateArt = { Precio_Compra: req.body.datos.PrecioCompraNuevo } 
            
                let ArticuloActual = await ArticuloModelSass.findByIdAndUpdate(artData._id, updateArt,{session, new:true})
                let updatecounter = { $inc: { ContRegs: req.body.datos.Fpago.length } }
                  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session, new:true} )
                  await session.commitTransaction();
                  res.status(200).send({status:"Ok",message:"Subida de Precio Compra",arrCuentas, arrRegs, ArticuloActual })
                     session.endSession();                


            }


            }
catch(error){
                  await session.abortTransaction();
                  session.endSession();
                  console.log(error, "errr")
                  return res.json({status: "Error", message: "Error en el sistema, porfavor intente en unos minutos", error });
                }

          }



         async function findYearRegs(req, res) {
  try {
    const conn = await mongoose.connection.useDb(req.body.User.DBname);
    const RegModelSass = conn.model('Reg', regSchema);

    const currentYear = new Date().getFullYear();
    const results = {};

    for (let i = 0; i < 5; i++) {
      const year = currentYear -1  - i;
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

      const exists = await RegModelSass.exists({
        Tiempo: { $gte: startOfYear, $lte: endOfYear }
      });

      results[year] = !!exists;
    }

    res.json(results);
  } catch (err) {
    console.error("Error al buscar registros por año:", err);
    res.status(500).json({ error: "Error al analizar los años de registros" });
  }
}

async function deleteDataYearRegs(req, res) {

  const year = parseFloat(req.body.datos);
  console.log(req.body)
    console.log("deleRegss")
    const session = await mongoose.startSession();  
     session.startTransaction();
   try {
    let conn = await mongoose.connection.useDb(req.body.User.user.DBname);
    const RegModelSass = await conn.model('Reg', regSchema);
    const ComprasModelSass = await conn.model('Compras', ComprasShema);
    const VentaModelSass = await conn.model('Venta', ventasSchema);
    const RegModelSassDelete = await conn.model('RegDelete', regSchemaDelete);

let tiempoIni = new Date(`${year}-01-01T05:00:00.000Z`).setHours(0,0,0,0);
let tiempoFin = new Date(`${year}-12-31T05:00:00.000Z`).setHours(23,59,59,999);

console.log("Tiempo inicial:", tiempoIni, "-", new Date(tiempoIni).toLocaleString());
console.log("Tiempo final:", tiempoFin, "-", new Date(tiempoFin).toLocaleString());

 await RegModelSass.deleteMany({
  $and: [
    { Tiempo: { $gte: tiempoIni } },
    { Tiempo: { $lte: tiempoFin } },
  ]
});

 await ComprasModelSass.deleteMany({
  $and: [
    { Tiempo: { $gte: tiempoIni } },
    { Tiempo: { $lte: tiempoFin } },
  ]
});

 await VentaModelSass.deleteMany({
  $and: [
    { Tiempo: { $gte: tiempoIni } },
    { Tiempo: { $lte: tiempoFin } },
  ]
});

 await RegModelSassDelete.deleteMany({
  $and: [
    { Tiempo: { $gte: tiempoIni } },
    { Tiempo: { $lte: tiempoFin } },
  ]
});
  await session.commitTransaction();
  session.endSession();

   res.status(200).send({status:"Ok",message:"eliminados exitozamente", })
 } catch (err) {
   await session.abortTransaction();
                  session.endSession();
    console.error("Error al elimiarregistros:", err);
    res.status(500).json({ status: "error", error: "Error al eliminar registros" });
  }
 }
async function findDataYearRegs(req, res) {

  const year = req.body.datos.year;
  console.log(req.body)

  try {
    let conn = await mongoose.connection.useDb(req.body.User.user.DBname);
    const RegModelSass = await conn.model('Reg', regSchema);
    const ComprasModelSass = await conn.model('Compras', ComprasShema);
    const VentaModelSass = await conn.model('Venta', ventasSchema);
    const RegModelSassDelete = await conn.model('RegDelete', regSchemaDelete);

let tiempoIni = new Date(`${year}-01-01T05:00:00.000Z`).setHours(0,0,0,0);
let tiempoFin = new Date(`${year}-12-31T05:00:00.000Z`).setHours(23,59,59,999);

console.log("Tiempo inicial:", tiempoIni, "-", new Date(tiempoIni).toLocaleString());
console.log("Tiempo final:", tiempoFin, "-", new Date(tiempoFin).toLocaleString());

let registros = await RegModelSass.find({
  $and: [
    { Tiempo: { $gte: tiempoIni } },
    { Tiempo: { $lte: tiempoFin } },
  ]
});
registros.forEach(reg => {
  reg.Estado = false;
});

let compras = await ComprasModelSass.find({
  $and: [
    { Tiempo: { $gte: tiempoIni } },
    { Tiempo: { $lte: tiempoFin } },
  ]
});

let ventas = await VentaModelSass.find({
  $and: [
    { Tiempo: { $gte: tiempoIni } },
    { Tiempo: { $lte: tiempoFin } },
  ]
});

let registrosEliminados = await RegModelSassDelete.find({
  $and: [
    { Tiempo: { $gte: tiempoIni } },
    { Tiempo: { $lte: tiempoFin } },
  ]
});
registrosEliminados.forEach(reg => {
  reg.Estado = false;
});

    // Crear libro de Excel
    const workbook = new ExcelJS.Workbook();

    // Opcional: proteger todo el libro (requiere ExcelJS 4.4.0+)
    workbook.views = [{ password: process.env.PRIVATE_VALID_KEY }]; // No evita edición fuera de Excel

    const sheets = [
      { name: 'Registros', data: registros },
      { name: 'Compras', data: compras },
      { name: 'Ventas', data: ventas },
      { name: 'Eliminados', data: registrosEliminados },
    ];

    for (const sheet of sheets) {
      const ws = workbook.addWorksheet(sheet.name);
      if (sheet.data.length > 0) {
       // Unir todas las claves únicas de los objetos
const allKeys = new Set();
sheet.data.forEach(d => {
  const obj = d._doc || d;
  Object.keys(obj).forEach(key => allKeys.add(key));
});

// Crear columnas con todas las claves encontradas
ws.columns = Array.from(allKeys).map(key => ({ header: key, key }));

// Agregar las filas, usando solo las claves válidas
sheet.data.forEach(d => {
  const obj = d._doc || d;
  const row = {};
  allKeys.forEach(key => {
    row[key] = obj[key] ?? ''; // vacío si no existe esa propiedad
  });
  ws.addRow(row);
});

      } else {
        ws.addRow(['Sin datos']);
      }

      // Protege cada hoja
      await ws.protect(process.env.PRIVATE_VALID_KEY, {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
        pivotTables: false,
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=datos-${year}.xlsx`);

    // Escribe el archivo en la respuesta
    await workbook.xlsx.write(res);
    res.end(); // Finaliza la respuesta correctamente

  } catch (err) {
    console.error("Error al generar Excel:", err);
    res.status(500).json({ status: "error", error: "Error al generar el archivo Excel." });
  }
}




module.exports = {deleteNotaDebito,getVentaID,deleteDataYearRegs,findDataYearRegs,findYearRegs, editarPrecioCompra, getDbuserData,getAllClients, deleteCorreoConfigurado, getCorreoConfig,correoConfigVerify, getDatabaseSize,deleteNotaCredito,getClientData,downloadPDFbyHTML,sendSearch,deleteIcon,getIcons, addNewIcons,createSystemCats,masiveApplyTemplate,updateDTCarts,updateVersionSistemArts,updateVersionSistemCuentas,updateVersionSistemCats,researchArt,deleteTemplate,accountF4,addDefaultDataInv,inventarioDelete,updateUser, getHtmlArt,editHtmlArt,getTemplates,saveTemplate,getArtByTitle, validateCompraFact,generateFactCompra,uploadMasiveClients,downLoadFact,enviarCoti,tryToHelp,vendData, genOnlyArt, getAllCounts,editSeller,deleteSeller, uploadNewSeller,signatureCloudi,  uploadFirmdata, testingsend, uploadSignedXml,resendAuthFact,uploadFactData,deleteServComb,editCombo,generateCombo,editService, generateService, getUA, deleteArt,dataInv,editArtSalidaInv,editArtCompra, editArt,addArtIndividual, generateCompraMasiva, deleteCompra, deleteVenta, comprasList, ventasList, getArt,getArt_by_id,generateCompra };