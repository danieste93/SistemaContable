// Cargamos el modelo recien creado
const regSchema= require("../models/registrosSass")
const OrdenCompra =  require("../models/ordencompraSass")
const counterSchema= require("../models/counterSass")
// Cargamos el módulo de bcrypt
const accountSchema = require("../models/cuentaSass")
const ArticuloSchema = require("../models/articuloSass")
const ventasSchema = require("../models/ventaSass")
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const catSchema = require("../models/catSass")
const  HtmlArtSchema = require('../models/articuloHTMLSass');
// Codificamos las operaciones que se podran realizar con relacion a los usuarios
module.exports = {
  ordenDeCompra: async function(req, res, next) {
    console.log(req.body)
    console.log(req.body.Envio)
    let conn = await mongoose.connection.useDb(req.body.Userdata.DBname)
    let OrdenCompraSass = await conn.model('OrdenCompra', OrdenCompra);
    let CounterModelSass = await conn.model('Counter', counterSchema);

const session = await mongoose.startSession();  
session.startTransaction();
try{
  let updatecounter = { $inc: { ContCarrito: 1 } }
  let counterobtenido = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{ session } )

  let IngresoOrden = new OrdenCompraSass()
 
  IngresoOrden.carritoNumero = counterobtenido.ContCarrito
  IngresoOrden.idCliente = req.body.Id
  IngresoOrden.nombreCliente = req.body.Nombre
  IngresoOrden.telefonoCliente = req.body.Telefono
  IngresoOrden.direccionCliente = req.body.Direccion
  IngresoOrden.correoCliente = req.body.Correo
  IngresoOrden.ciudadCliente = req.body.Ciudad
  IngresoOrden.cedulaCliente = req.body.Cedula
  IngresoOrden.bancoCliente = req.body.Banco
  IngresoOrden.formadePago = req.body.Pago
  IngresoOrden.valorFinal= req.body.Valorfinal
  IngresoOrden.envio.status = req.body.Envio
  IngresoOrden.envio.tipo = req.body.TipoEnv
  IngresoOrden.envio.valor = req.body.ValorEnv
  IngresoOrden.estatus.pago.EstadoPago = req.body.EstadoPago
  IngresoOrden.estatus.pago.Formaspago = []
  IngresoOrden.estatus.realizado = false
  IngresoOrden.carrito = req.body.carrito
  IngresoOrden.formadePago = req.body.Pago
  IngresoOrden.tiempo = req.body.tiempo
  IngresoOrden.coinsAntes = req.body.CoinsAntes
  IngresoOrden.coinsDespues = req.body.CoinsDespues
  IngresoOrden.coinsUsadas = req.body.CoinsUsadas
  
  
  let ingresoGenerado = await  IngresoOrden.save({ session })

 
  await session.commitTransaction();
  session.endSession();

  res.status(200).send({status: "ok", message: "Orden generada", carrito:counterobtenido.ContCarrito});

}catch(error){
  await session.abortTransaction();
  session.endSession();
  console.log(error, "errr")
  return res.json({status: "Error", message: "error al registrar", error });
}


 }, 
 getAllOrdenesCompra: async function(req, res, next) {
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname)
  let OrdenCompraSass = await conn.model('OrdenCompra', OrdenCompra);
 
  let ordenesHabiles = await OrdenCompraSass.find().sort({ $natural: -1 })
  res.status(200).send({status: "getOrdenes", message: "OrderData",ordenesHabiles });
},
updateOrdenCompraPago: async function(req, res, next) {
  
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname)
  let OrdenCompraSass = await conn.model('OrdenCompra', OrdenCompra);
 
  const session = await mongoose.startSession();   
  session.startTransaction();
  try{
    console.log(req.body)

 let data = req.body

  let ordenActualizado = await OrdenCompraSass.findById(data.AllData._id,null,{session} )    
  ordenActualizado.estatus.pago.EstadoPago = "Pagado"
  ordenActualizado.estatus.pago.FormasPago = data.FormasPago
  ordenActualizado.estatus.pago.estado = true
  ordenActualizado.estatus.pago.idMongoVenta = data.Venta[0]._id
  ordenActualizado.estatus.pago.idVenta = data.Venta[0].iDVenta
  let updateOrden = await ordenActualizado.save({ session })

  await session.commitTransaction();
  session.endSession();

res.json({status: "Ok", message: "Venta Virtual generada", orden:updateOrden});

  }  catch(error){
      await session.abortTransaction();
      session.endSession();
      console.log(error, "errr")

      return res.json({status: "Error", message: "error al registrar", error:error.message });
    }
},
updateOrdenCompra: async function(req, res, next) {
  console.log(req.body)
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname)
  let OrdenCompraSass = await conn.model('OrdenCompra', OrdenCompra);
  const session = await mongoose.startSession();   
  session.startTransaction();
  try{
    let data = req.body
    let ordenActualizado = await OrdenCompraSass.findById(data.idOrden,null,{session} )    
    ordenActualizado.estatus.pago.EstadoPago = req.body.EstadoPago


    let updateOrden = await ordenActualizado.save(({ session }))
    await session.commitTransaction();
    session.endSession();
    res.json({status: "Ok", message: "ordenupdate",orden:updateOrden });
  
  }  catch(error){
    await session.abortTransaction();
    session.endSession();
    console.log(error, "errr")

    return res.json({status: "Error", message: "error al registrar", error:error.message });
  }
},
getClienteOrders: async function(req, res, next) {
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname)
  let OrdenCompraSass = await conn.model('OrdenCompra', OrdenCompra);
  let VentaModelSass = await conn.model('Venta', ventasSchema);
  console.log(req.body)
  let ordenesClienteHabiles = await OrdenCompraSass.find({idCliente:req.body.user.id}).sort({ $natural: -1 })
  let ventasClienteHabiles = await VentaModelSass.find({idCliente:req.body.user.id}).sort({ $natural: -1 })
  res.status(200).send({status: "ok", message: "Orden generada", ordenes:ordenesClienteHabiles, ventas:ventasClienteHabiles});
  

},
getUptadeOrder: async function(req, res, next) {
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname)
  let OrdenCompraSass = await conn.model('OrdenCompra', OrdenCompra);
console.log(req.body)
let ordenEncontrada = await OrdenCompraSass.findById(req.body.idCompra)

if(ordenEncontrada == null){
  return res.json({status: "Error", message: "Orden no encontrada en el sistema" });
}else{
  res.status(200).send({status: "ok", message: "Orden generada", orden:ordenEncontrada});
}



},
 sendTransfer:async (req, res) =>{
console.log("hit send trans")
let conn = await mongoose.connection.useDb(req.body.Userdata)
let OrdenCompraSass = await conn.model('OrdenCompra', OrdenCompra);
let ordenActualizado = await OrdenCompraSass.findById(req.body._id)  
if(ordenActualizado == null){
  return res.json({status: "Error", message: "Orden no encontrada en el sistema" });
}  
ordenActualizado.estatus.pago.EstadoPago = "Revision-de-pago"
ordenActualizado.urlComprobante = req.body.imgComprobante

let updateOrden = await ordenActualizado.save()

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
          user: 'iglassmailer2020@gmail.com',
          pass: process.env.REACT_MAILER_PASS,
        }

})
var attachmentsFiles=[];
for (var i=0; i<req.body.imgComprobante.length;i++){
  attachmentsFiles.push({path:req.body.imgComprobante[i]})
}
mailOptions = {
  from: 'iglassmailer2020@gmail.com',
  to: req.body.DireccionMail,
  subject: `Comprobante de transferencia del carrito Nº${req.body.carritoNumero} `,
  text: `Transferencia del cliente:${req.body.nombreCliente}`,
  attachments:attachmentsFiles
 
}


transporter.sendMail(mailOptions, function (err, response) {
if(err){
  console.log(err)
  return res.json({status: "Error", message: "email no se pudo enviar" });
} else {
    console.log('Email Sent');
    return  res.json({status: "Ok", message: "actualizacion generada",orden:updateOrden });
}
})

  
  },
  addPubliHtml:async (req, res) =>{
 console.log(req.body)
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
    let CounterModelSass = await conn.model('Counter', counterSchema);
    let Counterx =     await CounterModelSass.find({iDgeneral:9999999} )
    const session = await mongoose.startSession();  
    session.startTransaction();
 
    try{
      console.log(Counterx[0])
    let newHtmlArt = {
      Eqid:Counterx[0].ContPublicaciones,
      Titulo:req.body.Titulo,
      Categoria:req.body.Categoria,
      SubCategoria:req.body.SubCategoria,
      publicHtml:req.body.HTMLdata,
      Diseno:req.body.Diseno,
      Tipo:req.body.Tipo,
      Tiempo:req.body.Tiempo,
      Imagen:req.body.Imagen
    }

  let newArt = await HtmlArtModel.create([newHtmlArt])
   
  let updateCounterVenta = { 
    $inc: { ContPublicaciones: 1, },
          }
          
  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updateCounterVenta,{session} )

  res.status(200).send({message:"Articulo actualizado o creado ", Publicacion:newArt[0] })
    }catch(error){
      await session.abortTransaction();
      session.endSession();
      console.log(error, "errr")
      return res.json({status: "Error", message: "Error al crear articulo", error });
    }


  },
  editPubliHtml:async (req, res) =>{
    console.log(req.body)
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);

    const session = await mongoose.startSession();  
    session.startTransaction();
 
    try{
  
      let update = {
   
        Titulo:req.body.Titulo,
        Categoria:req.body.Categoria,
        SubCategoria:req.body.SubCategoria,
        publicHtml:req.body.HTMLdata,
        Diseno:req.body.Diseno,
        Imagen:req.body.Imagen,
    
      }

      let updateArt =  await HtmlArtModel.findByIdAndUpdate(req.body._id, update,{new:true})
 
  res.status(200).send({message:"Articulo actualizado ", Publicacion:updateArt })
    }catch(error){
      await session.abortTransaction();
      session.endSession();
      console.log(error, "errr")
      return res.json({status: "Error", message: "Error al crear articulo", error });
    }


  },
  deletePubliHtml:async (req, res) =>{
    console.log(req.body)
    let conn = await mongoose.connection.useDb(req.body.User.DBname);

    const session = await mongoose.startSession();  
    session.startTransaction();
    let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
    try{

 let deleteArtHTml = await HtmlArtModel.findByIdAndDelete(req.body.item._id)


  res.status(200).send({message:"Articulo eliminado ", Publicacion:deleteArtHTml })
  
    }catch(error){
      await session.abortTransaction();
      session.endSession();
      console.log(error, "errr")
      return res.json({status: "Error", message: "Error al crear articulo", error });
    }


  },
  getPubliHtml:async (req, res) =>{
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
    let allPublic = await HtmlArtModel.find({Tipo:"Publicacion"})
    res.status(200).send({message:"getpublicaciones ", Publicaciones:allPublic })


  },
  configBlog:async (req, res) =>{
    let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
    let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);
    let CatModelSass = await conn.model('Categoria', catSchema);
   let CounterModelSass = await conn.model('Counter', counterSchema);
   let counterx =     await CounterModelSass.findOne({iDgeneral:9999998})

   let allCats = await CatModelSass.find({tipocat:"Publicacion"})
    let allPublic = await HtmlArtModel.find({Tipo:"Publicacion"})
    res.status(200).send({message:"getpublicaciones ", Publicaciones:allPublic, Categorias:allCats,Configuracion:counterx, })


  },
  updateConfigPubli:async (req, res) =>{
    console.log(req.body)
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let CounterModelSass = await conn.model('Counter', counterSchema);
    let counterx =     await CounterModelSass.findOne({iDgeneral:9999998} )

if(counterx){
  counterx.Data = {
    Publicacionprimera: req.body.Publicacionprimera,
    Publicacionsegunda: req.body.Publicacionsegunda,
    Publicaciontercera: req.body.Publicaciontercera,
    Publicacioncuarta: req.body.Publicacioncuarta,
  }
  let updateCounter = await counterx.save()

  res.status(200).send({status:"ok",message:"Actualizado ", updateCounter })
}
else{
  res.status(200).send({status:"error",message:"Eroor " })
}



  },
  getPubliByname:async (req, res) =>{



let conn = await mongoose.connection.useDb(req.body.Userdata.DBname)
let HtmlArtModel = await conn.model('htmlArt', HtmlArtSchema);

let pubAts = await HtmlArtModel.find({Tipo:"Publicacion"}).sort({$natural:1}).limit(5);
let findArt = await HtmlArtModel.findOne({Titulo:req.body.Titulo})

res.status(200).send({status:"ok",message:"Actualizado ", findArt, pubAts })


  }
}



