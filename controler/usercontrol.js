// Cargamos el modelo recien creado
const userModel = require('../models/users');
const accountSchema = require("../models/cuentaSass")
const nodemailer = require('nodemailer');
const distriSchema = require('../models/ditribuidorSass');
const ArticuloShema = require("../models/articuloSass")
const regSchema= require("../models/registrosSass")
const catSchema = require("../models/catSass")
const tipoSchemaSass  = require("../models/tiposSass")
const counterSchema= require("../models/counterSass")
const UserSchema = require('../models/usersSass');
const clientSchema = require('../models/clientSass');
const ComprasShema =  require("../models/comprasSass")
const ventasSchema = require("../models/ventaSass")
// Cargamos el módulo de bcrypt
const bcrypt = require('bcrypt'); 
// Cargamos el módulo de jsonwebtoken
const jwt = require('jsonwebtoken');
const crypto = require("crypto")
const mongoose = require('mongoose')
// Codificamos las operaciones que se podran realizar con relacion a los usuarios


module.exports = {
 create: async function(req, res, next) {
  

  let newDbName =  req.body.Usuario.trim() +"-"+ Math.floor(Math.random() * 100000);
  
  let conn = await mongoose.connection.useDb(newDbName);    
  let MainConn = await mongoose.connection.useDb("datashop");  
  let UserModelSass = await MainConn.model('usuarios', UserSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let CatModelSass = await conn.model('Categoria', catSchema);
  let ComprasModelSass = await conn.model('Compras', ComprasShema);
  let VentaModelSass = await conn.model('Venta', ventasSchema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let TiposModelSass = await conn.model('tiposmodel', tipoSchemaSass)
  let RegModelSass = await conn.model('Reg', regSchema);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloShema);

  let previousUsers = await UserModelSass.find({ Email: req.body.Correo })
  
if (previousUsers.length > 0) {
      return res.status(200).send({
        success: false,
        status:"error",
                message: 'El correo ya esta registrado'
      });

    }
 

    await ComprasModelSass.createCollection()
    await VentaModelSass.createCollection()
    await RegModelSass.createCollection()
    await ArticuloModelSass.createCollection()
    const session = await mongoose.startSession();  
    session.startTransaction();

    try {
    
    const opts2 = { session};
    const opts= { session, new:true};
let getUser = await UserModelSass.create([{
      Usuario: req.body.Usuario,
      Tipo:"administrador",
      Telefono: req.body.TelefonoContacto, 
      Confirmacion:req.body.Confirmacion,
      Email: req.body.Correo,
       Password: req.body.Contrasena,
       RegistradoPor:req.body.RegistradoPor,
       DBname:newDbName,
       Membresia:"Premium"
        }], opts)

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
    tipocat: "Gasto",
    subCategoria: [],
    nombreCat:"Viajes",
    urlIcono:"/iconscuentas/playa.png",
    idCat:16
  }],opts2 )


  await  CatModelSass.create([{
    tipocat: "Articulo",
    subCategoria: [],
    nombreCat:"GENERAL",
    urlIcono:"/iconscuentas/compra.png",
    idCat:21,
    sistemCat:true,
  }],opts2 )
  await  CatModelSass.create([{
    tipocat: "Articulo",
    subCategoria: [],
    nombreCat:"PANTALLA",
    urlIcono:"/iconscuentas/celular.png",
    idCat:22
  }],opts2 )
  
  await  CuentasModelSass.create([{
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Bancaria",
    FormaPago:"Transferencia",
    NombreC: "Pichincha",
    DineroActual: 0,
    iDcuenta: 1,
    Descrip: "",
    Permisos:["administrador","tesorero"],
    urlIcono:"/iconscuentas/bank.png",
    Background:{Seleccionado:"Imagen",
      urlBackGround:"/fondoscuentas/bp.png",
      colorPicked:"#ffffff"}
      }], opts2 )

      await  CuentasModelSass.create([{
        CheckedA: true,
        CheckedP: true,
        Visibility: true,
        FormaPago:"Transferencia",
        Tipo: "Bancaria",
        NombreC: "Produbanco",
        DineroActual: 0,
        iDcuenta: 2,
        Descrip: "",
        Permisos:["administrador","tesorero"],
        urlIcono:"/iconscuentas/bank.png",
        Background:{Seleccionado:"Imagen",
        urlBackGround:"/fondoscuentas/bpro.png",
        colorPicked:"#ffffff"}
          }], opts2 )

          await  CuentasModelSass.create([{
            CheckedA: true,
            CheckedP: true,
            Visibility: true,
            FormaPago:"Transferencia",
            Tipo: "Bancaria",
            NombreC: "Guayaquil",
            DineroActual: 0,
            iDcuenta: 6,
            Descrip: "",
            Permisos:["administrador","tesorero"],
            urlIcono:"/iconscuentas/bank.png",
            Background:{Seleccionado:"Imagen",
            urlBackGround:"/fondoscuentas/visa06.png",
            colorPicked:"#ffffff"}
              }], opts2 )
          await  CuentasModelSass.create([{
            CheckedA: true,
            CheckedP: true,
            Visibility: true,
            Tipo: "Tarjeta de Crédito",
            FormaPago:"Tarjeta-de-Credito",
            NombreC: "Visa",
            DineroActual: 0,
            iDcuenta: 3,
            Descrip: "",
            Permisos:["administrador"],
            urlIcono:"/iconscuentas/cardwallet.png",
            Background:{Seleccionado:"Imagen",
            urlBackGround:"/fondoscuentas/visa05.png",
            colorPicked:"#ffffff"}
              }], opts2 )
              
              await  CuentasModelSass.create([{
                CheckedA: true,
                CheckedP: true,
                Visibility: true,
                FormaPago:"Efectivo",
                Tipo: "Efectivo",
                NombreC: "Billetera",
                DineroActual: 0,
                iDcuenta: 4,
                Descrip: "",
                Permisos:["administrador"],
                urlIcono:"/iconscuentas/wallet.png",
                Background:{Seleccionado:"Solido",
                urlBackGround:"/fondoscuentas/amex1.png",
                colorPicked:"#ef4f29"}
                  }], opts2 )
                  await  CuentasModelSass.create([{
                    CheckedA: true,
                    CheckedP: true,
                    Visibility: true,
                    FormaPago:"Efectivo",
                    Tipo: "Efectivo",
                    NombreC: "Dinero en Casa",
                    DineroActual: 0,
                    iDcuenta: 7,
                    Descrip: "",
                    Permisos:["administrador"],
                    urlIcono:"/iconscuentas/moneybox.png",
                    Background:{Seleccionado:"Solido",
                    urlBackGround:"/fondoscuentas/amex1.png",
                    colorPicked:"#3c8ae0"}
                      }], opts2 )
                  await  CuentasModelSass.create([{
                    CheckedA: true,
                    CheckedP: true,
                    Visibility: true,
                    Tipo: "Tarjeta de Débito",
                    FormaPago:"Tarjeta-de-Debito",
                    NombreC: "Amex",
                    DineroActual: 0,
                    iDcuenta: 5,
                    Descrip: "",
                    urlIcono:"/iconscuentas/amex.png",
                    Background:{Seleccionado:"Imagen",
                    urlBackGround:"/fondoscuentas/amex1.png",
                    colorPicked:"#ffffff"},
                    Permisos:["administrador"],
                      }], opts2 )

                      await  CuentasModelSass.create([{
                        CheckedA: false,
                        CheckedP: false,
                        Visibility: true,
                        Tipo: "Inventario",
                        FormaPago:"",
                        NombreC: "Inventario",
                        DineroActual: 0,
                        iDcuenta: 9999998,
                        Descrip: "",
                        Permisos:["administrador","tesorero","vendedor"],
                        urlIcono:"/iconscuentas/icon.png",
                        Background:{Seleccionado:"Solido",
                        urlBackGround:"/fondoscuentas/visa05.png",
                        colorPicked:"#daa520"}
                          }], opts2 )


 await CounterModelSass.create([{
  Contador:1,
  ContadorCat:30,
  ContadorRep:1,
  Contmascuenta:8,
  ContRegs:1,
  ContVentas:1,
  ContCompras:1,
  ContVendedores:3,
  ContSecuencial:1,
  ContCotizacion:1,
  ContPublicaciones:1,
  ContArticulos:1000,
  iDgeneral:9999999
 }],opts2)
 await CounterModelSass.create([{
  Data:{},
  iDgeneral:9999998
 }],opts2)

 await CounterModelSass.create([{
  Data:[
    "/iconscuentas/amex.png",
    "/iconscuentas/visa.png",
    "/iconscuentas/mastercard.png",
    "/iconscuentas/bill.png",
    "/iconscuentas/blockchain.png",
    "/iconscuentas/cardwallet.png",
    "/iconscuentas/cash1.png",
    "/iconscuentas/cash2.png",
    "/iconscuentas/coins.png",
    "/iconscuentas/icon.png",
    "/iconscuentas/moneybox.png",
    "/iconscuentas/paypal.png",
    "/iconscuentas/wallet.png",
    "/iconscuentas/walletcoin.png",
    "/iconscuentas/venta.png",
    "/iconscuentas/venta1.png",
    "/iconscuentas/venta2.png",
    "/iconscuentas/compra.png",
    "/iconscuentas/compra1.png",
    "/iconscuentas/negocio.png",
    "/iconscuentas/negocios.png",
    "/iconscuentas/negocios1.png",
    "/iconscuentas/negocios2.png",
    "/iconscuentas/tecnologia.png",
    "/iconscuentas/tecnologia1.png",
    "/iconscuentas/comida.png",
    "/iconscuentas/comida1.png",
    "/iconscuentas/comida2.png",
    "/iconscuentas/comida3.png",
    "/iconscuentas/comida4.png",
    "/iconscuentas/comida5.png",
    "/iconscuentas/comida6.png",
    "/iconscuentas/comida7.png",
    "/iconscuentas/comida8.png",
    "/iconscuentas/internet.png",
    "/iconscuentas/internet1.png",
    "/iconscuentas/agua.png",
    "/iconscuentas/luz.png",
    "/iconscuentas/telefono.png",
    "/iconscuentas/casa.png",
    "/iconscuentas/mascota.png",
    "/iconscuentas/mascota1.png",
    "/iconscuentas/mascota2.png",
    "/iconscuentas/auto.png",
    "/iconscuentas/moto.png",
    "/iconscuentas/gasolina.png",
    "/iconscuentas/personas.png",
    "/iconscuentas/personas1.png",
    "/iconscuentas/personas2.png",
    "/iconscuentas/playa.png",
    "/iconscuentas/joyas.png",
    "/iconscuentas/ropa.png",
    "/iconscuentas/salud.png",
    "/iconscuentas/deporte.png",
    "/iconscuentas/entretenimiento.png",
    "/iconscuentas/salud1.png",
    "/iconscuentas/medico.png",
    "/iconscuentas/pastillas.png",
    "/iconscuentas/seguridad.png",
    "/iconscuentas/tabaco.png",
    "/iconscuentas/unicornio.png"
  ],
  iDgeneral:9999997
 }],opts2)

 await CounterModelSass.create([{
 Data:[
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

  ],
  iDgeneral:9999996
 }],opts2)

 

 await TiposModelSass.create([{
  Tipos:[
   "Cuentas por Pagar",
   "Cuentas por Cobrar",
   "Familia",
   "Bancaria",  
   "Efectivo",
   "Trabajadores", 
   "Distribuidores", 
   "Préstamos",
   "Inventario",
   "Tarjeta de Crédito",
   "Tarjeta de Débito"
 ],
 iDtipe:9999999
}],opts2)

 var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    
          user: 'iglassmailer2020@gmail.com',
          pass: process.env.REACT_MAILER_PASS,
     

  }
})
let subjectsting = `Verificacion a cuenta de usuario ${req.body.Usuario}`;
let textstingdev =
`<p>Su registro a Activos fue exitoso</p> <p>para verificar su cuenta  <a href="http://localhost:3000/usuarios/verificacion/${getUser[0]._id}">CLICK AQUÍ</a></p>`
  
var mailOptions = {
  from: 'iglassmailer2020@gmail.com',
  to: req.body.Correo,
  subject: subjectsting,
  html: textstingdev,
}

transporter.sendMail(mailOptions, function (err, res) {
  if(err){
      console.log(err);
  } else {
      console.log('Email Sent');
  }
})

        await session.commitTransaction();
        
      return res.json({status: "Ok", message: "Exito en el registro", }); 
         
      }
      catch(error){
        console.log(error)
        await session.abortTransaction();
        return res.json({status: "error", message: "error al registrar", error });
      }finally {
        session.endSession();
      }
   




 },

 registerDistri: async function(req, res, next) {
console.log(req.body)
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);

  let DistribuidorModelSass = await conn.model('Distribuidor', distriSchema);
  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let CounterModelSass = await conn.model('Counter', counterSchema);

  let Counterx =     await CounterModelSass.find({iDgeneral:9999999} )

  const session = await mongoose.startSession();  
    session.startTransaction();
    try {
      const opts= { session, new:true};
      let nuevoDistriCuenta =  await  CuentasModelSass.create([{
        CheckedA: false,
        CheckedP: false,
        Visibility: true,
        Tipo: "Distribuidores",
        FormaPago:"Transferencia",
        NombreC: req.body.nombreComercial,
        DineroActual: 0,
        iDcuenta: Counterx[0].Contmascuenta,
        Descrip: "",
        Permisos:["administrador","tesorero"],
        urlIcono:"/iconscuentas/negocios.png",
        Background:{Seleccionado:"Solido",
        urlBackGround:"",
        colorPicked:"#09cda4"}
          }], opts )


          let nuevoDistribuidor = await DistribuidorModelSass.create([{
            Usuario:req.body.nombreComercial,
            Telefono:req.body.telefono,
            Direccion:req.body.direccion,
            Ruc:req.body.Ruc,
            Ciudad:req.body.ciudad,
            Email:req.body.correoDistri,
            RegistradoPor:req.body.Vendedor.Nombre,
            MongoIdCuenta:nuevoDistriCuenta[0]._id,
            iDcuenta: nuevoDistriCuenta[0].iDcuenta,

          }], opts)

          let updatecounter = { $inc: { Contmascuenta: 1 } }

          await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session, new:true} )

          res.json({status: "Ok", message: "Exito en el registro", nuevoDistribuidor, nuevoDistriCuenta}); 
          await session.commitTransaction();
          session.endSession();


    }catch(error){
        console.log(error)
        await session.abortTransaction();
        session.endSession();
        return res.json({status: "Error", message: "error al registrar", error });
      }


},
editDistri:async function(req,res){
 
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
  let DistribuidorModelSass = await conn.model('Distribuidor', distriSchema);
  
  let update = {
    Usuario: req.body.usuario,
    Telefono: req.body.telefono,
    Email:req.body.correoDistri,
    Ciudad:req.body.ciudad,
    Direccion:req.body.direccion,
    Ruc:req.body.Ruc,
   
  }

  let updateDistri = await DistribuidorModelSass.findByIdAndUpdate(req.body.id,update,{new:true})

  res.status(200).send({updateDistri})
 },
 registerSeller: async function(req, res, next) {
  try {
      let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
      let ClienteModelSass = await conn.model('Cliente', clientSchema);

      // Verificamos si existe un usuario con el mismo Email, Cedula, Usuario o Telefono
      const existingUser = await ClienteModelSass.findOne({
          $or: [
              { Email: req.body.Correo },
              { Cedula: req.body.Cedula },
              { Usuario: req.body.Usuario },
              { Telefono: req.body.TelefonoContacto }
          ]
      });

      if (existingUser) {
          let field = "";
          if (existingUser.Email === req.body.Correo) field = "Email";
          else if (existingUser.Cedula === req.body.Cedula) field = "Cédula";
          else if (existingUser.Usuario === req.body.Usuario) field = "Usuario";
          else if (existingUser.Telefono === req.body.TelefonoContacto) field = "Teléfono";

          return res.status(200).send({
              success: false,
              status: "error",
              message: `El ${field} ya está registrado, por favor use otro.`
          });
      }

      // Crear nuevo usuario
      const newUser = new ClienteModelSass({
          Usuario: req.body.Usuario,
          Tipo: "cliente",
          Telefono: req.body.TelefonoContacto,
          Confirmacion: req.body.Confirmacion,
          Email: req.body.Correo,
          Password: req.body.Contrasena,
          RegistradoPor: req.body.RegistradoPor,
          Ciudad: req.body.Ciudad,
          Direccion: req.body.Direccion,
          Cedula: req.body.Cedula,
          TipoID: req.body.TipoID
      });

      await newUser.save();
      return res.json({ status: "Ok", message: "Usuario agregado exitosamente!!!", user: newUser });
  } catch (error) {
      return res.json({ status: "error", message: "Error al registrar", error });
  }
},


logOut: function(req,res){


 
   

 },
 authenticate: async function(req, res, next) {
  let MainConn = await mongoose.connection.useDb("datashop");  
    let UserModelSass = await MainConn.model('usuarios', UserSchema);

  UserModelSass.findOne({Email:req.body.Correo}, function(err, userInfo){

    if(err) return res.status(500).send({status: "error",message:"erroneo"})
    if(!userInfo) return res.status(404).send({status: "error",message:"no existe el correo"})
   
      if(bcrypt.compareSync(req.body.Contrasena, userInfo.Password)) {
     

        const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), { expiresIn: '8h' });

        let decodificado = jwt.decode(token)
        res.json({status:"Ok", message: "El usuario ha sido autenticado!!!", data:{user: userInfo, token:token, decodificado}});
      }else{
        res.json({status:"error", message: "Invalid password!!", data:null});
      }


    });


 },
 authenticateClient: async function(req, res, next) {
  console.log(req.body)
  let MainConn = await mongoose.connection.useDb(req.body.User.DBname);  
    let ClientModelSass = await MainConn.model('Cliente', clientSchema);

    ClientModelSass.findOne({Email:req.body.Correo}, function(err, userInfo){

    if(err) return res.status(500).send({status: "error",message:"erroneo"})
    if(!userInfo) return res.status(404).send({status: "error",message:"no existe el correo"})
   
      if(bcrypt.compareSync(req.body.Contrasena, userInfo.Password)) {
     

        const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), { expiresIn: '8h' });

        let decodificado = jwt.decode(token)
        res.json({status:"Ok", message: "El usuario ha sido autenticado!!!", data:{user: userInfo, token:token, decodificado}});
      }else{
        res.json({status:"error", message: "Invalid password!!", data:null});
      }


    });


 },


 uploadArrorder:async function(req,res){
 
  let conn = await mongoose.connection.useDb(req.body.Userdata.DBname); 

  
  let TiposModelSass = await conn.model('tiposmodel', tipoSchemaSass)
 
  let Tipodata = await TiposModelSass.findOne({iDtipe:9999999}, null)
  if (!Tipodata)  return res.json({status: "Error", message: "error al registrar" });
  
 
  let update = {Tipos:req.body.genToUp}


  
  let arrOrdenado = await TiposModelSass.findByIdAndUpdate(Tipodata._id, update, {new:true})

  res.status(200).send({message:"Todo ok",tipes:arrOrdenado})

},

 updateBySeller:async function(req,res){

let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
  let ClienteModelSass = await conn.model('Cliente', clientSchema);
let options = {new:true} 

let update = {
  Usuario: req.body.Usuario,
  Telefono: req.body.Telefono,
  Email:req.body.Correo,
  Ciudad:req.body.Ciudad,
  Direccion:req.body.Direccion,
  Cedula:req.body.Cedula,
  TipoID:req.body.TipoID
}
ClienteModelSass.findByIdAndUpdate(req.body.Id, update, options, (err, userUpdated) =>{
  if(err) return res.status(500).send({message:"error al actualizar"})

  res.status(200).send({user: userUpdated})
})
 },

 update: function(req,res, next){
   
    let productoId = req.body.Id
   let update = req.body

   let options = {new:true} 

 
 userModel.findByIdAndUpdate(productoId, update, options, (err, userUpdated) =>{
   if(err) return res.status(500).send({message:"error al actualizar"})
 
   res.status(200).send({user: userUpdated})
 })

 },

addpurchase:function (req, res, next){

let updatee = req.body.Compras[0]
let update = {$push: {Compras:  {
  $each: [updatee] ,
  $position: 0
} }}


let options = {new:true} 
  userModel.findByIdAndUpdate(req.body.Id, update, options, (err,user)=>{
  
    if(err) res.status(500).send({"message":"error al buscar usuario"})

    res.status(200).send({user})
  })
},

addrequest:function (req, res, next){

  let updatee = req.body.SolicitudR[0]
  let update = {$push: {SolicitudR :  {
    $each: [updatee] ,
    $position: 0
  } }}
  
  
  let options = {new:true} 
    userModel.findByIdAndUpdate(req.body.Id, update, options, (err,user)=>{
    
      if(err) res.status(500).send({"message":"error al buscar usuario"})
  
      res.status(200).send({user})
    })
  },
updatepayment:function (req, res, next){



  let productoId= req.body.Id
  userModel.findOne({ _id: productoId}, (err, doc)=>{
   if(err){
       console.log(err);
       return;
   }
 
   let compraIndex = doc.Compras.findIndex(element => element.CarritoNumero === req.body.CarritoNumero)
   let update ;
   let updateval =`Compras.${compraIndex}.EstadoPago`
 if(req.body.Estado === "Cliente-envia-Comprobante"){
 
   update = {[updateval]:"Revision-de-pago"}
 }
 else if(req.body.Estado === "Cliente-recibe-productos"){
   update = {[updateval]:"Concluido"}
 }
 else if(req.body.Estado === "Revicion_Cliente"){
  update = {[updateval]:"Revicion_Cliente"}
}

 else if(req.body.Estado === "Pagado"){
  update = {[updateval]:"Pagado"}
}
else if(req.body.Estado === "No-pagado"){
  update = {[updateval]:"default"}
}
else if(req.body.Estado === "Revicion"){
  update = {[updateval]:"Revision-de-pago"}
}
else if(req.body.Estado === "Concluido"){
  update = {[updateval]:"Concluido"}
}

 let options = {new:true} 
 userModel.findByIdAndUpdate(req.body.Id, update, options, (err,user)=>{
 
   if(err) res.status(500).send({"message":"error al buscar usuario"})

   res.status(200).send({user})
 })

  
  })

  },

  updaterep:function (req, res, next){


    c
    let productoId= req.body.Id
    userModel.findOne({ _id: productoId}, (err, doc)=>{
     if(err){
         console.log(err);
         return;
     }
  
     let compraIndex = doc.SolicitudR.findIndex(element => element.SolicitudNumero === req.body.Solicitud)
     let update ;
     let updateval =`SolicitudR.${compraIndex}.Estatus`
   if(req.body.Estado === "Disponible"){
   
     update = {[updateval]:"Disponible"}
   }
   else if(req.body.Estado === "No-disponible"){
     update = {[updateval]:"No disponible"}
   }
  
   else if(req.body.Estado === "Revicion-rep"){
    update = {[updateval]:"Revicion"}
  }
  
  
   let options = {new:true} 
   userModel.findByIdAndUpdate(req.body.Id, update, options, (err,user)=>{
   
     if(err) res.status(500).send({"message":"error al buscar usuario"})
  
     res.status(200).send({user})
   })
  
    
    })
  
    },

 
 activator:async function (req, res, next){
  let MainConn = await mongoose.connection.useDb("datashop");  
  let UserModelSass = await MainConn.model('usuarios', UserSchema);


  let update = {Confirmacion:true, }
  let options = {new:true} 
  UserModelSass.findByIdAndUpdate(req.body.userid, update, options, (err,user)=>{
  
    if(err) res.status(500).send({message:"error al buscar usuario"})
 
    res.status(200).send({user})
  })
 


  },

  checkFBdata: async function (req, res, next){
   
    let MainConn = await mongoose.connection.useDb("datashop");  
    let UserModelSass = await MainConn.model('usuarios', UserSchema);

    let UsuarioFind = await UserModelSass.find({Email: req.body.Correo})
console.log(UsuarioFind)
    if(UsuarioFind.length == 0){
      let newDbName =  req.body.Usuario.replace(/ /g, "")+"-"+ Math.floor(Math.random() * 100000);
  
    let conn = await mongoose.connection.useDb(newDbName);    

  let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let CatModelSass = await conn.model('Categoria', catSchema);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let TiposModelSass = await conn.model('tiposmodel', tipoSchemaSass)
      console.log("no encontrado")

    const session = await mongoose.startSession();  
    session.startTransaction();

    try {
    
      const opts2 = { session};
      const opts= { session, new:true};
      let getUser = await UserModelSass.create([{
        Usuario: req.body.Usuario,
        Tipo:"administrador",
        Telefono: "", 
        Confirmacion:req.body.Confirmacion,
        Email: req.body.Correo,
         Password: req.body.Contrasena   + process.env.REACT_PASS_GENERATOR,
         RegistradoPor:req.body.RegistradoPor,
         DBname:newDbName,
         Membresia:"Gratuita"
          }], opts)
  
  await  CatModelSass.create([{
      tipocat: "Ingreso",
      subCategoria: [],
      nombreCat:"Apertura",
      idCat:9999999,
      sistemCat:true,
    }],opts2 )
  
    await  CatModelSass.create([{
      tipocat: "Ingreso",
      subCategoria: [],
      nombreCat:"Sueldo",
      idCat:1
    }],opts2 )
  
    await  CatModelSass.create([{
      tipocat: "Gasto",
      subCategoria: [],
      nombreCat:"Personal",
      idCat:2
    }],opts2 )
    
    await  CuentasModelSass.create([{
      CheckedA: true,
      CheckedP: true,
      Visibility: true,
      Tipo: "Bancaria",
      FormaPago:"Transferencia",
      NombreC: "Pichincha",
      DineroActual: 0,
      iDcuenta: 1,
      Descrip: "",
      Permisos:["administrador"],
        }], opts2 )
  
        await  CuentasModelSass.create([{
          CheckedA: true,
          CheckedP: true,
          Visibility: true,
          FormaPago:"Transferencia",
          Tipo: "Bancaria",
          NombreC: "Produbanco",
          DineroActual: 0,
          iDcuenta: 2,
          Descrip: "",
        Permisos:["administrador"],
            }], opts2 )
  
  
            await  CuentasModelSass.create([{
              CheckedA: true,
              CheckedP: true,
              Visibility: true,
              Tipo: "Tarjeta de Crédito",
              FormaPago:"Tarjeta de Crédito",
              NombreC: "Visa",
              DineroActual: 0,
              iDcuenta: 3,
              Descrip: "",
              Permisos:["administrador"],
                }], opts2 )
                
                await  CuentasModelSass.create([{
                  CheckedA: true,
                  CheckedP: true,
                  Visibility: true,
                  FormaPago:"Efectivo",
                  Tipo: "Efectivo",
                  NombreC: "Billetera",
                  DineroActual: 0,
                  iDcuenta: 4,
                  Descrip: "",
                  Permisos:["administrador"],
                    }], opts2 )
                    await  CuentasModelSass.create([{
                      CheckedA: true,
                      CheckedP: true,
                      Visibility: true,
                      Tipo: "Tarjeta de Débito",
                      FormaPago:"Tarjeta de Débito",
                      NombreC: "Xperta",
                      DineroActual: 0,
                      iDcuenta: 5,
                      Descrip: "",
                      Permisos:["administrador"],
                        }], opts2 )

                        await  CuentasModelSass.create([{
                          CheckedA: false,
                          CheckedP: false,
                          Visibility: true,
                          Tipo: "Inventario",
                          FormaPago:"",
                          NombreC: "Inventario",
                          DineroActual: 0,
                          iDcuenta: 9999998,
                          Descrip: "",
                          Permisos:["administrador"],
                            }], opts2 )
  
  
   await CounterModelSass.create([{
    Contador:1,
    ContadorRep:1,
    Contmascuenta:6,
    ContRegs:1,
    ContVentas:1,
    ContCompras:1,
    ContArticulos:1000,
    iDgeneral:9999999
   }],opts2)
  
   await TiposModelSass.create([{
     Tipos:[
      "Cuentas por Pagar",
      "Cuentas por Cobrar",
      "Familia",
      "Efectivo",
      "Bancaria",   
      "Préstamos",
      "Inventario",    
      "Tarjeta de Crédito",
      "Tarjeta de Débito",
      "Trabajadores",
      "Distribuidores",
    ],
    iDtipe:9999999
   }],opts2)
   
   const token = jwt.sign({id: getUser[0]._id}, req.app.get('secretKey'), { expiresIn: '8h' });

  let decodificado = jwt.decode(token)


res.json({status: "Ok", message: "Exito en el registro",data:{user:getUser[0], token:token, decodificado} }); 
 await session.commitTransaction();
 session.endSession();
    }  catch(error){
        console.log(error)
        await session.abortTransaction();
        session.endSession();
        return res.json({status: "error", message: "error al registrar", error });
      }
    }else{
   console.log("encontrado")
let pass = req.body.Contrasena   + process.env.REACT_PASS_GENERATOR
if(bcrypt.compareSync(pass, UsuarioFind[0].Password)) {
  const token = jwt.sign({id:UsuarioFind[0]._id}, req.app.get('secretKey'), { expiresIn: '8h' });

  let decodificado = jwt.decode(token)
  res.json({status:"Ok", message: "Exito en el login", data:{user:  UsuarioFind[0], token:token, decodificado}});
}else{
  res.json({status:"error", message: "Invalid password!!", data:null});
}

    }

  },

  resetpassword: async function (req, res, next){
    let MainConn = await mongoose.connection.useDb("datashop");  
    let UserModelSass = await MainConn.model('usuarios', UserSchema);

 
    UserModelSass.findOne({Email:req.body.Correo}, function(err, userInfo){
    
      if(err) return res.status(500).send({status: "error",message:"erroneo"})
      if(!userInfo) return res.status(404).send({status: "error",message:"no existe el correo"})
     

      if(userInfo.RegistradoPor==="usuario"){
 
        const token = crypto.randomBytes(20).toString('hex');
        var today = new Date();
today.setSeconds(today.getSeconds() + 600);
        
        let update = {ContrasenaToken:token, ContrasenaTokenexpyre: today}
        const options ={new:true}
        userModel.findByIdAndUpdate(userInfo._id, update, options, (err,user)=>{
    
          if(err) res.status(500).send({"message":"error al buscar usuario"})
       
          return res.status(200).send({status: "ok",user} )
        })
      

  
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            
                  user: 'iglassmailer2020@gmail.com',
                  pass: process.env.REACT_MAILER_PASS,
             
      
          }
      })
      
      let subjectsting = `Solicitud de reinicio de contraseña en Contaluxe`;
     
      let deplytextsting =
      `<p>Se solicito reiniciar su contraseña</p> <p>Si usted lo realizo ingrese al sigiente  <a href="https://www.contaluxe.com/usuarios/reset/${token}">ENLACE</a></p>`
        
      let textsting =
      `<p>Se solicito reiniciar su contraseña</p> <p>Si usted lo realizo ingrese al sigiente  <a href="http://localhost:3000/usuarios/reset/${token}">ENLACE</a></p>`
        
      let mailOptions = {
        from: 'iglassmailer2020@gmail.com',
        to: req.body.Correo,
        subject: subjectsting,
        html: deplytextsting,
      
      }
      transporter.sendMail(mailOptions, function (err, res) {
        if(err){
            console.log(err);
        } else {
            console.log('Email reset password Sent');
        }
      })

      }
     else if(userInfo.RegistradoPor==="facebook"){
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          
                user: 'iglassmailer2020@gmail.com',
                pass: process.env.REACT_MAILER_PASS,
           
    
        }
    })

    let subjectsting = `Solicitud de reinicio de contraseña en Contaluxe`;
    let textsting =
    `<p>Estimado Usuario, usted se ha registrado mediante Facebook, por lo cual su contraseña solo puede ser desbloqueada mediante la red social  </p>`
      
    let mailOptions = {
      from: 'iglassmailer2020@gmail.com',
      to: req.body.Correo,
      subject: subjectsting,
      html: textsting,
    
    }
    transporter.sendMail(mailOptions, function (err, res) {
      if(err){
          console.log(err);
      } else {
          console.log('Email reset password Sent');
      }
    })

        return res.status(200).send({status: "ok",message:"usuario Facebok"} )
      }

   
  
  
      });

    
    
  
  
    },


    confirmResetPassword:async function (req, res, next){

let MainConn = await mongoose.connection.useDb("datashop");  
let UserModelSass = await MainConn.model('usuarios', UserSchema);

UserModelSass.findOne({ 
  
  
    ContrasenaToken:req.body.PassToken,
    ContrasenaTokenexpyre:{$gt:Date.now()}
  

  }, (err, doc)=>{
    if(err) return res.status(500).send({status: "error",message:"server error"})
    if(!doc) return res.status(404).send({status: "error",message:"Usuario no encontrado"})

    let pass = bcrypt.hashSync(req.body.Newpass, 10);
    let update = {Password:pass,
      ContrasenaToken:null,
      ContrasenaTokenexpyre:null
                  }

    const options ={new:true}
    UserModelSass.findByIdAndUpdate(doc._id, update, options, (err,user)=>{

      if(err) res.status(500).send({"message":"error al actualizar contraseña"})
   
      return res.status(200).send({status: "contraseña actualizada",Usuario:user} )
    })

   
})
    },
    deleteUser:async function (req, res, next){
   
      let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
      let ClienteModelSass = await conn.model('Cliente', clientSchema);
      let CuentasModelSass = await conn.model('Cuenta', accountSchema);
      let usuario  = req.body
      if(req.body.idCuenta == ""){
        ClienteModelSass.findOneAndDelete({_id:usuario.Id},  (err,user)=>{

          if(err) res.status(500).send({message:"error al eliminare el usuario"})
       
          return res.status(200).send({status: "usuario eliminado",Usuario:user} )
        })
       }else{
        let cuentaData = await CuentasModelSass.findById(req.body.idCuenta, null)
      

        if(cuentaData.DineroActual == 0 ){
          ClienteModelSass.findOneAndDelete({_id:usuario.Id},  (err,user)=>{
            if(err) res.status(500).send({message:"error al eliminare el usuario",err})

            CuentasModelSass.findOneAndDelete({_id:usuario.idCuenta},  (err,cuenta)=>{

              if(err) res.status(500).send({message:"error al cuenta"})
                      
            })
 
            return res.status(200).send({status: "usuario eliminado",Usuario:user} ) 
          })
       
        }else{
          return res.status(401).send({status: "error",message:"Cuentas no 0"} ) 
        }
       
       }
   
     

  

    },
    getUserCoins:function(req, res, next){
      
      let id = req.body.Id

      userModel.findById(id, (err, user) => {

        if(err) res.status(500).send({"message":"error al obtener coins"})
        return res.status(200).send({status: "exito get coins",Coins:user.iGlassCoins} )

      })
    
    },
    getUserData:function(req, res, next){
      
      let id = req.body.Id

      userModel.findById(id, (err, user) => {

        if(err) res.status(500).send({"message":"error al obtener coins"})
        return res.status(200).send({status: "exito get user",Usuario:user} )

      })
    
    },
    updateUserCoins:function(req, res, next){

      let id = req.body.Id

      let update = {iGlassCoins:req.body.Coins
           
                    }
                    const options ={new:true}

      userModel.findByIdAndUpdate(id, update, options, (err,user)=>{

        if(err) res.status(500).send({"message":"error al actualizar usuario"})
     
        return res.status(200).send({status: "usuario Actualizado",Usuario:user} )
      })


    },
  
             getUsers:function(req, res, next){
      
                userModel.find({},(err, user)=>{
                  if(err) res.status(500).send({"message":"error al obtener coins"})
                  
                  return res.status(200).send({status: "exito get user",Usuarios:user} )

                })
              
              },
              updateCuentaid:async function(req, res, next){
                
                let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
                let ClienteModelSass = await conn.model('Cliente', clientSchema);

                let update = {IDcuenta:req.body.idcuenta}
               
              
                let options = {new:true} 
                ClienteModelSass.findByIdAndUpdate(req.body.Id, update, options, (err,user)=>{
                
                  if(err) res.status(500).send({"message":"error al buscar usuario"})
               console.log(user)
                  res.status(200).send({user})
                })
              },

              
 
}

