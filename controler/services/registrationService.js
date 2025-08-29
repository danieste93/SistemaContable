// Utilidad para convertir fechas a la zona horaria de Ecuador
function fechaEcuador(date) {
  return new Date(date).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' });
}
// services/registrationService.js
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const userModel = require('../../models/users');
const accountSchema = require("../../models/cuentaSass")
const distriSchema = require('../../models/ditribuidorSass');
const ArticuloShema = require("../../models/articuloSass")
const regSchema= require("../../models/registrosSass")
const catSchema = require("../../models/catSass")
const tipoSchemaSass  = require("../../models/tiposSass")
const counterSchema= require("../../models/counterSass")
const UserSchema = require('../../models/usersSass');
const clientSchema = require('../../models/clientSass');
const ComprasShema =  require("../../models/comprasSass")
const ventasSchema = require("../../models/ventaSass")
// importa tus esquemas aquí (puedes ajustarlo según tu estructura real)

async function registerFullUser(userInput) {
  
  const newDbName = userInput.Usuario.trim() + "-" + Math.floor(Math.random() * 100000);
  const MainConn = mongoose.connection.useDb("datashop");
  const conn = mongoose.connection.useDb(newDbName);

  const UserModelSass = MainConn.model('usuarios', UserSchema);
  const CuentasModelSass = conn.model('Cuenta', accountSchema);
  const CatModelSass = conn.model('Categoria', catSchema);

  const CounterModelSass = conn.model('Counter', counterSchema);
  const TiposModelSass = conn.model('tiposmodel', tipoSchemaSass);
  const RegModelSass = conn.model('Reg', regSchema);


  const existingByEmail = await UserModelSass.findOne({ Email: userInput.Correo });
  const existingByUsername = await UserModelSass.findOne({ Usuario: userInput.Usuario });

  if (existingByEmail) return { success: false, status:"error", error: 'El correo ya esta registrado' };
  if (existingByUsername) return { success: false,status:"error", error: 'El Usuario ya esta registrado' };

  
  await RegModelSass.createCollection();
  

  const MAX_RETRIES = 5;

  for (let i = 0; i < MAX_RETRIES; i++) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const opts = { session };

      const getUser = await UserModelSass.create([
        {
          Usuario: userInput.Usuario,
          Tipo: "administrador",
          Telefono: userInput.TelefonoContacto,
          Confirmacion: userInput.Confirmacion,
          Email: userInput.Correo,
          ImagenP: userInput.Imagen,
          Password: userInput.Contrasena,
          RegistradoPor: userInput.RegistradoPor,
          DBname: newDbName,
          Membresia: "Gratuita",
          Fechas: {
            Creacion: Date.now(),
            InicioMem: null,
            ExpiraMem: null,
            InicioFirma: null,
            ExpiraFirma: null
          },
          SiSPagos: {
            TipoVentaMeM: "",
            BancoMEM: "",
            ComprobanteMeM: "",
            FirmaCortesia: "",
            FechaCompraFirma: null,
            TipoVentaFirma: "",
            ComprobanteFirma: "",
            BancoFirma: ""
          }
        }
      ], opts);

      
 const categoriasCreadas =  await CatModelSass.create([
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], urlIcono:"/iconscuentas/apertura.png", nombreCat:"Apertura", idCat:9999999, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Sueldo", urlIcono:"/iconscuentas/cash2.png", idCat:1 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Negocios", urlIcono:"/iconscuentas/negocio.png", idCat:2 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Inversiones", urlIcono:"/iconscuentas/inversion.png", idCat:3 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Tienda Virtual", urlIcono:"/iconscuentas/venta1.png", idCat:4 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Punto de venta", urlIcono:"/iconscuentas/venta.png", idCat:5, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Ingreso Inventario", urlIcono:"/iconscuentas/ingresoinv.png", idCat:23, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Compra Inventario", urlIcono:"/iconscuentas/compra1.png", idCat:17, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Perdida Inventario", urlIcono:"/iconscuentas/lostinv.png", idCat:18, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Salida Precio Compra Inventario", urlIcono:"/iconscuentas/salidainv.png", idCat:19, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Excedente Caja", urlIcono:"/iconscuentas/exedentecaja.png", idCat:24, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Cierre Caja", urlIcono:"/iconscuentas/cierrecaja.png", idCat:25, sistemCat:true },

  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Credito", urlIcono:"/iconscuentas/cre.png", idCat:20, sistemCat:true },
  { _id: new mongoose.Types.ObjectId(),tipocat: "Gasto", subCategoria: [], nombreCat:"Comida", urlIcono:"/iconscuentas/comida.png", idCat:6 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: ["Luz", "Agua", "Internet"], nombreCat:"Servicios Basicos", urlIcono:"/iconscuentas/casa.png", idCat:7 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Telefono", urlIcono:"/iconscuentas/celular.png", idCat:8 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Comida extra", urlIcono:"/iconscuentas/comida4.png", idCat:9 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Transporte", urlIcono:"/iconscuentas/taxi.png", idCat:10 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Transporte Propio", urlIcono:"/iconscuentas/auto.png", idCat:11 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Ropa", urlIcono:"/iconscuentas/ropa.png", idCat:12 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Salud", urlIcono:"/iconscuentas/salud1.png", idCat:13 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Lujos", urlIcono:"/iconscuentas/joyas.png", idCat:14 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Mascotas", urlIcono:"/iconscuentas/mascota2.png", idCat:15 },
  { _id: new mongoose.Types.ObjectId(),tipocat: "Gasto", subCategoria: [], nombreCat:"Viajes", urlIcono:"/iconscuentas/playa.png", idCat:16 },
    { _id: new mongoose.Types.ObjectId(),tipocat: "Gasto", subCategoria: [], nombreCat:"Faltante Caja", urlIcono:"/iconscuentas/faltantecaja.png", idCat:26, sistemCat:true  },
  { _id: new mongoose.Types.ObjectId(),tipocat: "Articulo", subCategoria: [], nombreCat:"GENERAL", urlIcono:"/iconscuentas/compra.png", idCat:21, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Articulo", subCategoria: [], nombreCat:"PANTALLA", urlIcono:"/iconscuentas/celular.png", idCat:22 }
], opts);

  const catApertura = categoriasCreadas.find(cat => cat.nombreCat === "Apertura");
let cuentasCreadas = await CuentasModelSass.create([
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Bancaria",
    FormaPago: "Transferencia",
    NombreC: "Pichincha",
    DineroActual: 0,
    iDcuenta: 1,
    Descrip: "",
    Permisos: ["administrador", "tesorero"],
    urlIcono: "/iconscuentas/bank.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/bp.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Bancaria",
    FormaPago: "Transferencia",
    NombreC: "Produbanco",
    DineroActual: 0,
    iDcuenta: 2,
    Descrip: "",
    Permisos: ["administrador", "tesorero"],
    urlIcono: "/iconscuentas/bank.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/bpro.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Bancaria",
    FormaPago: "Transferencia",
    NombreC: "Guayaquil",
    DineroActual: 0,
    iDcuenta: 6,
    Descrip: "",
    Permisos: ["administrador", "tesorero"],
    urlIcono: "/iconscuentas/bank.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/visa06.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Tarjeta de Crédito",
    FormaPago: "Tarjeta-de-Credito",
    NombreC: "Visa",
    DineroActual: 0,
    iDcuenta: 3,
    Descrip: "",
    Permisos: ["administrador"],
    urlIcono: "/iconscuentas/cardwallet.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/visa05.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Efectivo",
    FormaPago: "Efectivo",
    NombreC: "Billetera",
    DineroActual: 0,
    iDcuenta: 4,
    Descrip: "",
    Permisos: ["administrador"],
    urlIcono: "/iconscuentas/wallet.png",
    Background: {
      Seleccionado: "Solido",
      urlBackGround: "/fondoscuentas/amex1.png",
      colorPicked: "#ef4f29"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Efectivo",
    FormaPago: "Efectivo",
    NombreC: "Dinero en Casa",
    DineroActual: 0,
    iDcuenta: 7,
    Descrip: "",
    Permisos: ["administrador"],
    urlIcono: "/iconscuentas/moneybox.png",
    Background: {
      Seleccionado: "Solido",
      urlBackGround: "/fondoscuentas/amex1.png",
      colorPicked: "#3c8ae0"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Tarjeta de Débito",
    FormaPago: "Tarjeta-de-Debito",
    NombreC: "Amex",
    DineroActual: 0,
    iDcuenta: 5,
    Descrip: "",
    urlIcono: "/iconscuentas/amex.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/amex1.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
  CheckedA: false,
  CheckedP: false,
  Visibility: true,
  Tipo: "Inventario",
  FormaPago:"",
  NombreC: "Inventario",
  DineroActual: 0,
  iDcuenta: 9999998,
  Descrip: "",
  Permisos:["administrador", "tesorero", "vendedor"],
    Background: {
      Seleccionado: "Solido",
      urlBackGround: "/fondoscuentas/amex1.png",
      colorPicked: "#3c8ae0"
    }
  ,
                            }
  
], opts);

const registrosApertura = cuentasCreadas.map((cuenta, index) => {
  return {
    Accion: "Ingreso",
    Tiempo: new Date().getTime(),
    TiempoEjecucion: new Date().getTime(),
    IdRegistro: 1 + index, // Asegúrate de que no se repitan
    CuentaSelec: {
      idCuenta: cuenta._id,
      nombreCuenta: cuenta.NombreC,
    },
    CatSelect: {
      idCat: catApertura.idCat,
      urlIcono: catApertura.urlIcono,
      nombreCat: catApertura.nombreCat,
      subCatSelect: [],
      _id: catApertura._id
    },
    Descripcion: "",
    Importe: 0, // o el valor que quieras asignar en apertura
    Nota: "",
    Usuario: {
   Nombre:"Sistema",
    Id:"999999",
    Tipo:"Sistema",
    },
    FormaPago: [],
    LimiteCredito: 0
  };
});

// Crear todos los registros de apertura en una sola operación
await RegModelSass.insertMany(registrosApertura, { session });



 await CounterModelSass.create([
  {  _id: new mongoose.Types.ObjectId(), // ✅ nuevo ID
    Contador: 1,
    ContadorCat: 30,
    ContadorRep: 1,
    Contmascuenta: 8,
    ContRegs: cuentasCreadas.length + 1,
    ContVentas: 1,
    ContCompras: 1,
    ContVendedores: 3,
    ContSecuencial: 1,
    ContCotizacion: 1,
    ContPublicaciones: 1,
    ContArticulos: 1000,
    iDgeneral: 9999999
  },
  
  {
      _id: new mongoose.Types.ObjectId(), // ✅ nuevo ID
    Data: [
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
      "/fondoscuentas/bpro.png"
    ],
    iDgeneral: 9999996
  },
  { _id: new mongoose.Types.ObjectId(), // ✅ nuevo ID
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
 }
], opts);


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
}],opts)

 var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    
          user: 'iglassmailer2020@gmail.com',
          pass: process.env.REACT_MAILER_PASS,
     

  }
})
let subjectsting = `Verificacion a cuenta de usuario ${userInput.Usuario}`;
let textstingdev =
`<p>Su registro a Activos fue exitoso</p> <p>para verificar su cuenta  <a href="http://localhost:3000/usuarios/verificacion/${getUser[0]._id}">CLICK AQUÍ</a></p>`
  
var mailOptions = {
  from: 'iglassmailer2020@gmail.com',
  to: userInput.Correo,
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

      // Aquí se debe agregar toda la lógica que tenías para crear categorías, cuentas, registros, tipos y counters.
      // Debe incluir también el envío del correo, exactamente como estaba.
      // ⚠️ Se debe copiar el bloque completo de creación de categorías, cuentas, registros, y más dentro de este scope.

      await session.commitTransaction();
      session.endSession();
      return { success: true, user: getUser[0], db: newDbName };
    } 
    catch (error) {
     

      if (
        i < MAX_RETRIES - 1 &&
        error.hasErrorLabel &&
        error.hasErrorLabel("TransientTransactionError")
      ) {
        console.log("🔁 Intento fallido #" + (i + 1), error);
        continue; // reintentar
      }
       await session.abortTransaction();
      session.endSession();

      return { success: false, error: error.message };
    }
  }

  return { success: false, error: 'Error persistente tras múltiples intentos' };
}

async function registrarUsuarioOro(userInput) {
  
  const newDbName = userInput.Usuario.trim() + "-" + Math.floor(Math.random() * 100000);
  const MainConn = mongoose.connection.useDb("datashop");
  const conn = mongoose.connection.useDb(newDbName);

  const UserModelSass = MainConn.model('usuarios', UserSchema);
  const CuentasModelSass = conn.model('Cuenta', accountSchema);
  const CatModelSass = conn.model('Categoria', catSchema);
  const ComprasModelSass = conn.model('Compras', ComprasShema);
  const VentaModelSass = conn.model('Venta', ventasSchema);
  const CounterModelSass = conn.model('Counter', counterSchema);
  const TiposModelSass = conn.model('tiposmodel', tipoSchemaSass);
  const RegModelSass = conn.model('Reg', regSchema);
  const ArticuloModelSass = conn.model('Articulo', ArticuloShema);

  const existingByEmail = await UserModelSass.findOne({ Email: userInput.Correo });
  const existingByUsername = await UserModelSass.findOne({ Usuario: userInput.Usuario });

  if (existingByEmail) return { success: false, status:"error", error: 'El correo ya esta registrado' };
  if (existingByUsername) return { success: false,status:"error", error: 'El Usuario ya esta registrado' };

  await ComprasModelSass.createCollection();
  await VentaModelSass.createCollection();
  await RegModelSass.createCollection();
  await ArticuloModelSass.createCollection();

  const MAX_RETRIES = 5;

  for (let i = 0; i < MAX_RETRIES; i++) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const opts = { session };

      const getUser = await UserModelSass.create([
        {
          Usuario: userInput.Usuario,
          Tipo: "administrador",
          Telefono: userInput.TelefonoContacto,
          Confirmacion: userInput.Confirmacion,
          Email: userInput.Correo,
          ImagenP: userInput.Imagen,
          Password: userInput.Contrasena,
          RegistradoPor: userInput.RegistradoPor,
          DBname: newDbName,
          Membresia: "Premium"
        }
      ], opts);

      
 const categoriasCreadas =  await CatModelSass.create([
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], urlIcono:"/iconscuentas/apertura.png", nombreCat:"Apertura", idCat:9999999, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Sueldo", urlIcono:"/iconscuentas/cash2.png", idCat:1 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Negocios", urlIcono:"/iconscuentas/negocio.png", idCat:2 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Inversiones", urlIcono:"/iconscuentas/inversion.png", idCat:3 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Tienda Virtual", urlIcono:"/iconscuentas/venta1.png", idCat:4 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Punto de venta", urlIcono:"/iconscuentas/venta.png", idCat:5, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Ingreso Inventario", urlIcono:"/iconscuentas/ingresoinv.png", idCat:23, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Compra Inventario", urlIcono:"/iconscuentas/compra1.png", idCat:17, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Perdida Inventario", urlIcono:"/iconscuentas/lostinv.png", idCat:18, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Salida Precio Compra Inventario", urlIcono:"/iconscuentas/salidainv.png", idCat:19, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Excedente Caja", urlIcono:"/iconscuentas/exedentecaja.png", idCat:24, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Cierre Caja", urlIcono:"/iconscuentas/cierrecaja.png", idCat:25, sistemCat:true },

  {_id: new mongoose.Types.ObjectId(), tipocat: "Ingreso", subCategoria: [], nombreCat:"Credito", urlIcono:"/iconscuentas/cre.png", idCat:20, sistemCat:true },
  { _id: new mongoose.Types.ObjectId(),tipocat: "Gasto", subCategoria: [], nombreCat:"Comida", urlIcono:"/iconscuentas/comida.png", idCat:6 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: ["Luz", "Agua", "Internet"], nombreCat:"Servicios Basicos", urlIcono:"/iconscuentas/casa.png", idCat:7 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Telefono", urlIcono:"/iconscuentas/celular.png", idCat:8 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Comida extra", urlIcono:"/iconscuentas/comida4.png", idCat:9 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Transporte", urlIcono:"/iconscuentas/taxi.png", idCat:10 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Transporte Propio", urlIcono:"/iconscuentas/auto.png", idCat:11 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Ropa", urlIcono:"/iconscuentas/ropa.png", idCat:12 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Salud", urlIcono:"/iconscuentas/salud1.png", idCat:13 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Lujos", urlIcono:"/iconscuentas/joyas.png", idCat:14 },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Gasto", subCategoria: [], nombreCat:"Mascotas", urlIcono:"/iconscuentas/mascota2.png", idCat:15 },
  { _id: new mongoose.Types.ObjectId(),tipocat: "Gasto", subCategoria: [], nombreCat:"Viajes", urlIcono:"/iconscuentas/playa.png", idCat:16 },
    { _id: new mongoose.Types.ObjectId(),tipocat: "Gasto", subCategoria: [], nombreCat:"Faltante Caja", urlIcono:"/iconscuentas/faltantecaja.png", idCat:26, sistemCat:true  },
  { _id: new mongoose.Types.ObjectId(),tipocat: "Articulo", subCategoria: [], nombreCat:"GENERAL", urlIcono:"/iconscuentas/compra.png", idCat:21, sistemCat:true },
  {_id: new mongoose.Types.ObjectId(), tipocat: "Articulo", subCategoria: [], nombreCat:"PANTALLA", urlIcono:"/iconscuentas/celular.png", idCat:22 }
], opts);

  const catApertura = categoriasCreadas.find(cat => cat.nombreCat === "Apertura");
let cuentasCreadas = await CuentasModelSass.create([
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Bancaria",
    FormaPago: "Transferencia",
    NombreC: "Pichincha",
    DineroActual: 0,
    iDcuenta: 1,
    Descrip: "",
    Permisos: ["administrador", "tesorero"],
    urlIcono: "/iconscuentas/bank.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/bp.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Bancaria",
    FormaPago: "Transferencia",
    NombreC: "Produbanco",
    DineroActual: 0,
    iDcuenta: 2,
    Descrip: "",
    Permisos: ["administrador", "tesorero"],
    urlIcono: "/iconscuentas/bank.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/bpro.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Bancaria",
    FormaPago: "Transferencia",
    NombreC: "Guayaquil",
    DineroActual: 0,
    iDcuenta: 6,
    Descrip: "",
    Permisos: ["administrador", "tesorero"],
    urlIcono: "/iconscuentas/bank.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/visa06.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Tarjeta de Crédito",
    FormaPago: "Tarjeta-de-Credito",
    NombreC: "Visa",
    DineroActual: 0,
    iDcuenta: 3,
    Descrip: "",
    Permisos: ["administrador"],
    urlIcono: "/iconscuentas/cardwallet.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/visa05.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Efectivo",
    FormaPago: "Efectivo",
    NombreC: "Billetera",
    DineroActual: 0,
    iDcuenta: 4,
    Descrip: "",
    Permisos: ["administrador"],
    urlIcono: "/iconscuentas/wallet.png",
    Background: {
      Seleccionado: "Solido",
      urlBackGround: "/fondoscuentas/amex1.png",
      colorPicked: "#ef4f29"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Efectivo",
    FormaPago: "Efectivo",
    NombreC: "Dinero en Casa",
    DineroActual: 0,
    iDcuenta: 7,
    Descrip: "",
    Permisos: ["administrador"],
    urlIcono: "/iconscuentas/moneybox.png",
    Background: {
      Seleccionado: "Solido",
      urlBackGround: "/fondoscuentas/amex1.png",
      colorPicked: "#3c8ae0"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
    CheckedA: true,
    CheckedP: true,
    Visibility: true,
    Tipo: "Tarjeta de Débito",
    FormaPago: "Tarjeta-de-Debito",
    NombreC: "Amex",
    DineroActual: 0,
    iDcuenta: 5,
    Descrip: "",
    urlIcono: "/iconscuentas/amex.png",
    Background: {
      Seleccionado: "Imagen",
      urlBackGround: "/fondoscuentas/amex1.png",
      colorPicked: "#ffffff"
    }
  },
  {_id: new mongoose.Types.ObjectId(),
  CheckedA: false,
  CheckedP: false,
  Visibility: true,
  Tipo: "Inventario",
  FormaPago:"",
  NombreC: "Inventario",
  DineroActual: 0,
  iDcuenta: 9999998,
  Descrip: "",
  Permisos:["administrador", "tesorero", "vendedor"],
    Background: {
      Seleccionado: "Solido",
      urlBackGround: "/fondoscuentas/amex1.png",
      colorPicked: "#3c8ae0"
    }
  ,
                            }
  
], opts);

const registrosApertura = cuentasCreadas.map((cuenta, index) => {
  return {
    Accion: "Ingreso",
    Tiempo: new Date().getTime(),
    TiempoEjecucion: new Date().getTime(),
    IdRegistro: 1 + index, // Asegúrate de que no se repitan
    CuentaSelec: {
      idCuenta: cuenta._id,
      nombreCuenta: cuenta.NombreC,
    },
    CatSelect: {
      idCat: catApertura.idCat,
      urlIcono: catApertura.urlIcono,
      nombreCat: catApertura.nombreCat,
      subCatSelect: [],
      _id: catApertura._id
    },
    Descripcion: "",
    Importe: 0, // o el valor que quieras asignar en apertura
    Nota: "",
    Usuario: {
   Nombre:"Sistema",
    Id:"999999",
    Tipo:"Sistema",
    },
    FormaPago: [],
    LimiteCredito: 0
  };
});

// Crear todos los registros de apertura en una sola operación
await RegModelSass.insertMany(registrosApertura, { session });



 await CounterModelSass.create([
  {  _id: new mongoose.Types.ObjectId(), // ✅ nuevo ID
    Contador: 1,
    ContadorCat: 30,
    ContadorRep: 1,
    Contmascuenta: 8,
    ContRegs: cuentasCreadas.length + 1,
    ContVentas: 1,
    ContCompras: 1,
    ContVendedores: 3,
    ContSecuencial: 1,
    ContCotizacion: 1,
    ContPublicaciones: 1,
    ContArticulos: 1000,
    iDgeneral: 9999999
  },
  
  {
      _id: new mongoose.Types.ObjectId(), // ✅ nuevo ID
    Data: [
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
      "/fondoscuentas/bpro.png"
    ],
    iDgeneral: 9999996
  },
  { _id: new mongoose.Types.ObjectId(), // ✅ nuevo ID
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
 }
], opts);


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
}],opts)

 var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    
          user: 'iglassmailer2020@gmail.com',
          pass: process.env.REACT_MAILER_PASS,
     

  }
})
let subjectsting = `Verificacion a cuenta de usuario ${userInput.Usuario}`;
let textstingdev =
`<p>Su registro a Activos fue exitoso</p> <p>para verificar su cuenta  <a href="http://localhost:3000/usuarios/verificacion/${getUser[0]._id}">CLICK AQUÍ</a></p>`
  
var mailOptions = {
  from: 'iglassmailer2020@gmail.com',
  to: userInput.Correo,
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

      // Aquí se debe agregar toda la lógica que tenías para crear categorías, cuentas, registros, tipos y counters.
      // Debe incluir también el envío del correo, exactamente como estaba.
      // ⚠️ Se debe copiar el bloque completo de creación de categorías, cuentas, registros, y más dentro de este scope.

      await session.commitTransaction();
      session.endSession();
      return { success: true, user: getUser[0], db: newDbName };
    } 
    catch (error) {
     

      if (
        i < MAX_RETRIES - 1 &&
        error.hasErrorLabel &&
        error.hasErrorLabel("TransientTransactionError")
      ) {
        console.log("🔁 Intento fallido #" + (i + 1), error);
        continue; // reintentar
      }
       await session.abortTransaction();
      session.endSession();

      return { success: false, error: error.message };
    }
  }

  return { success: false, error: 'Error persistente tras múltiples intentos' };
}

module.exports = { registerFullUser, registrarUsuarioOro };
