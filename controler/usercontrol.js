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
const { registerFullUser } = require('./services/registrationService');
// Cargamos el módulo de bcrypt
const bcrypt = require('bcrypt'); 
// Cargamos el módulo de jsonwebtoken
const jwt = require('jsonwebtoken');
const crypto = require("crypto")
const mongoose = require('mongoose')
// Codificamos las operaciones que se podran realizar con relacion a los usuarios


module.exports = {
 create: async function(req, res, next) {

 const result = await registerFullUser(req.body);
console.log(result)
  if (!result.success) {
    return res.status(400).json({ status: "error", message: result.error });
  }
  const token = jwt.sign({id: result.user._id}, req.app.get('secretKey'), { expiresIn: '8h' });

  let decodificado = jwt.decode(token)

return res.json({ status: "Ok", message: "Éxito en el registro", data:{user:result.user, token:token, decodificado}});

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



      let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
      let ClienteModelSass = await conn.model('Cliente', clientSchema);
 let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
       let CounterModelSass = await conn.model('Counter', counterSchema);
       let CatModelSass = await conn.model('Categoria', catSchema);
     let Counterx =   await CounterModelSass.find({iDgeneral:9999999})
      
    

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

      const session = await mongoose.startSession();  
            
      session.startTransaction();

  try {

      let idCuentaUser = ""
      let aperturaReg =[]
      let newCount=[]
      if(req.body.Cuenta){

 function normalizeText(text) {

  if(text == undefined){
    return text
  }else{
  return text
    .normalize("NFD") // Descompone los caracteres con tilde
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos/diacríticos
    .toLowerCase() // Convierte a minúsculas
    .trim(); // Elimina espacios al inicio y al final
    }
}
const allC = await CuentasModelSass.find({}, 'NombreC'); // Solo traemos los nombres

const yaExiste = allC.some(c =>
  normalizeText(c.NombreC) === normalizeText(req.body.Usuario)
);
if (yaExiste) {
  return res.send({
    status: "error",
    message: "Nombre ya elegido, elija otro nombre para la cuenta."
  });
}
 let cuentaActualizada = await  CuentasModelSass.create([{
    CheckedA: false,
    CheckedP: false,
    Visibility: true,
    Tipo:"Cuentas por Cobrar",
    NombreC: req.body.Usuario,
    DineroActual: 0,
    Clase:req.body.Clase,
    iDcuenta: Counterx[0].Contmascuenta,
    Descrip: "",
    Permisos: ["administrador","vendedor","tesorero"],
    LimiteCredito:0,
    FormaPago:"Efectivo",
    Background:{
      Seleccionado:'Solido',
    urlBackGround:'',
    colorPicked:"#ffffff"},
    urlIcono:"/iconscuentas/icon.png"
  
      }], {session} )
        console.log(cuentaActualizada)
  idCuentaUser = cuentaActualizada[0]._id
newCount.push(cuentaActualizada[0])
  let tiempo =new Date()
  
  let catApertura = await CatModelSass.findOne({idCat:9999999}, null,{session})
 
  let datatosend={
    Accion:"Ingreso",
    Tiempo: tiempo.getTime(),
    TiempoEjecucion:tiempo.getTime(),
    IdRegistro:Counterx[0].ContRegs,
    CuentaSelec:{
      idCuenta:cuentaActualizada[0]._id,
      nombreCuenta: cuentaActualizada[0].NombreC,
    
    },
  
  
      CatSelect:{idCat:catApertura.idCat,
        urlIcono:catApertura.urlIcono,
          nombreCat:catApertura.nombreCat,
        subCatSelect:[],
      _id:catApertura._id
      },
  
      
    Descripcion:"",
    Importe:0,
    Nota:"",
    Usuario:{
      Nombre:req.body.vendedorCont.Nombre,
      Id:req.body.vendedorCont.Id,
      Tipo:req.body.vendedorCont.Tipo,
  
    },
    FormaPago:"Efectivo",
    LimiteCredito:0
    
  }

 let regApe = await RegModelSass.create([datatosend], {session})
  aperturaReg.push(regApe[0])
  
 let updatecounter = { $inc: { Contmascuenta:1, ContRegs:1 } }

  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session}  )
 
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
          TipoID: req.body.TipoID,
          IDcuenta:idCuentaUser
      });

        await newUser.save({ session });
            await session.commitTransaction();    
    session.endSession();
      return res.json({ status: "Ok", message: "Usuario agregado exitosamente!!!", user: newUser,regs:aperturaReg,cuenta:newCount });
  } catch (error) {
    console.log(error)
      return res.json({ status: "error", message: "Error al registrar", error:error.message });
      
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
   let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
       let CounterModelSass = await conn.model('Counter', counterSchema);
       let CatModelSass = await conn.model('Categoria', catSchema);
     let Counterx =   await CounterModelSass.find({iDgeneral:9999999})
     
 const session = await mongoose.startSession();  
            
      session.startTransaction();

 try {

   const cliente = await ClienteModelSass.findById(req.body.Id, null, { session });

  if (!cliente) throw new Error('Cliente no encontrado');
console.log(cliente)


 let idCuentaUser = cliente.IDcuenta
      let aperturaReg =[]
      let newCount=[]
      if(req.body.Cuenta && (cliente.IDcuenta == "" || cliente.IDcuenta == null )){

 function normalizeText(text) {

  if(text == undefined){
    return text
  }else{
  return text
    .normalize("NFD") // Descompone los caracteres con tilde
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos/diacríticos
    .toLowerCase() // Convierte a minúsculas
    .trim(); // Elimina espacios al inicio y al final
    }
}
const allC = await CuentasModelSass.find({}, 'NombreC'); // Solo traemos los nombres

const yaExiste = allC.some(c =>
  normalizeText(c.NombreC) === normalizeText(req.body.Usuario)
);
if (yaExiste) {
  return res.send({
    status: "error",
    message: "Nombre ya elegido, elija otro nombre para la cuenta."
  });
}
 let cuentaActualizada = await  CuentasModelSass.create([{
    CheckedA: false,
    CheckedP: false,
    Visibility: true,
    Tipo:"Cuentas por Cobrar",
    NombreC: req.body.Usuario,
    DineroActual: 0,
    Clase:req.body.Clase,
    iDcuenta: Counterx[0].Contmascuenta,
    Descrip: "",
    Permisos: ["administrador","vendedor","tesorero"],
    LimiteCredito:0,
    FormaPago:"Efectivo",
    Background:{
      Seleccionado:'Solido',
    urlBackGround:'',
    colorPicked:"#ffffff"},
    urlIcono:"/iconscuentas/icon.png"
  
      }], {session} )
        
  idCuentaUser = cuentaActualizada[0]._id
newCount.push(cuentaActualizada[0])
  let tiempo =new Date()
  
  let catApertura = await CatModelSass.findOne({idCat:9999999}, null,{session})
 
  let datatosend={
    Accion:"Ingreso",
    Tiempo: tiempo.getTime(),
    TiempoEjecucion:tiempo.getTime(),
    IdRegistro:Counterx[0].ContRegs,
    CuentaSelec:{
      idCuenta:cuentaActualizada[0]._id,
      nombreCuenta: cuentaActualizada[0].NombreC,
    
    },
  
  
      CatSelect:{idCat:catApertura.idCat,
        urlIcono:catApertura.urlIcono,
          nombreCat:catApertura.nombreCat,
        subCatSelect:[],
      _id:catApertura._id
      },
  
      
    Descripcion:"",
    Importe:0,
    Nota:"",
    Usuario:{
      Nombre:req.body.vendedorCont.Nombre,
      Id:req.body.vendedorCont.Id,
      Tipo:req.body.vendedorCont.Tipo,
  
    },
    FormaPago:"Efectivo",
    LimiteCredito:0
    
  }

 let regApe = await RegModelSass.create([datatosend], {session})
  aperturaReg.push(regApe[0])
  
 let updatecounter = { $inc: { Contmascuenta:1, ContRegs:1 } }

  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session}  )
 
      }
  
      // Actualizar campos directamente
  cliente.Usuario = req.body.Usuario;
  cliente.Telefono = req.body.Telefono;
  cliente.Email = req.body.Correo;
  cliente.Ciudad = req.body.Ciudad;
  cliente.Direccion = req.body.Direccion;
  cliente.Cedula = req.body.Cedula;
  cliente.TipoID = req.body.TipoID;
  cliente.IDcuenta = idCuentaUser;

  // Guardar con la sesión activa
  await cliente.save({ session });

  await session.commitTransaction();
  session.endSession();
  return res.json({ status: "Ok", message: "Usuario editado exitosamente!!!", user: cliente,regs:aperturaReg,cuenta:newCount });
  

 }catch (error) {
    console.log(error)
      return res.json({ status: "error", message: "Error al registrar", error:error.message });
      
  }
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
    console.log(req.body)
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
      `<p>Se solicito reiniciar su contraseña</p> <p>Si usted lo realizo ingrese al sigiente  <a href="https://www.activos.ec/usuarios/reset/${token}">ENLACE</a></p>`
        
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
console.log(req.body)
      let conn = await mongoose.connection.useDb(req.body.User.DBname);
      let ClienteModelSass = await conn.model('Cliente', clientSchema);
      let CuentasModelSass = await conn.model('Cuenta', accountSchema);
      let usuario  = req.body.item
   
      if(req.body.idcuenta == ""){
        ClienteModelSass.findOneAndDelete({_id:usuario.id},  (err,user)=>{

          if(err) res.status(500).send({message:"error al eliminare el usuario"})
       
          return res.status(200).send({status: "usuario eliminado",Usuario:user, Cuenta:[]} )
        })
       }else{
        let cuentaData = await CuentasModelSass.findById(req.body.idCuenta, null)
      console.log(cuentaData)

        if(cuentaData.DineroActual == 0 ){
          ClienteModelSass.findOneAndDelete({_id:usuario.id},  (err,user)=>{
            if(err) res.status(500).send({message:"error al eliminare el usuario",err})

            CuentasModelSass.findOneAndDelete({_id:usuario.idcuenta},  (err,cuenta)=>{

              if(err) res.status(500).send({message:"error al cuenta"})
                      
            })
 
            return res.status(200).send({status: "usuario eliminado",Usuario:user, Cuenta:cuenta} ) 
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
               googleLogin:async function (req, res, next){
      
                 let MainConn = await mongoose.connection.useDb("datashop");  
    let UserModelSass = await MainConn.model('usuarios', UserSchema);
  let UsuarioFind = await UserModelSass.find({Email: req.body.email})

                console.log(req.body)


                 if(UsuarioFind.length == 0){
                     console.log("registrando")

     let newbody = {Usuario:req.body.name.trim().replace(" ", "-"),
               TelefonoContacto:"",
               Correo:req.body.email,
               Imagen:req.body.picture,
               Contrasena:req.body.sub + process.env.REACT_PASS_GENERATOR,
               RegistradoPor:"Google",
               Confirmacion:true,
               }
      

      const result = await registerFullUser(newbody);
 if (!result.success) {
    return res.status(400).json({ status: "error", message: result.error });
  }

const token = jwt.sign({id:result.user._id}, req.app.get('secretKey'), { expiresIn: '8h' });
  let decodificado = jwt.decode(token)
  
return res.json({ status: "Ok", message: "Exito en el registro",data:{user:  result.user, token:token, decodificado} });


                  }else{
   console.log("encontrado")
let pass = req.body.sub  + process.env.REACT_PASS_GENERATOR
if(bcrypt.compareSync(pass, UsuarioFind[0].Password)) {
  const token = jwt.sign({id:UsuarioFind[0]._id}, req.app.get('secretKey'), { expiresIn: '8h' });

  let decodificado = jwt.decode(token)
  res.json({status:"Ok", message: "Exito en el login", data:{user:  UsuarioFind[0], token:token, decodificado}});
}else{
  res.json({status:"error", message: "Invalid password!!", data:null});
}

    }
              
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

