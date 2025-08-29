// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt
const bcrypt = require('bcrypt');
// Definimos el factor de costo, el cual controla cuánto tiempo se necesita para calcular un solo hash de BCrypt. Cuanto mayor sea el factor de costo, más rondas de hash se realizan. Cuanto más tiempo sea necesario, más difícil será romper el hash con fuerza bruta.
const saltRounds = 10;
//Definimos los esquemas
const Schema = mongoose.Schema;
// Creamos el objeto del esquema con sus correspondientes campos
const UserSchema = new Schema({
 SiSPagos: {
   TipoVentaMeM: { type: String, default: "" },
   BancoMEM: { type: String, default: "" },
   ComprobanteMeM: { type: String, default: "" },
   FirmaCortesia: { type: String, default: "" },
   FechaCompraFirma: { type: Date, default: null },
   TipoVentaFirma: { type: String, default: "" },
   ComprobanteFirma: { type: String, default: "" },
   BancoFirma: { type: String, default: "" }
 },
 DatosFacturacion: {
   Nombres: { type: String, default: "" },
   CedulaoRuc: { type: String, default: "" },
   Correo: { type: String, default: "" },
   Telefono: { type: String, default: "" },
   Direccion: { type: String, default: "" }
 },
 Fechas: {
   Creacion: { type: Date, default: Date.now },
   InicioMem: { type: Date, default: null },
   ExpiraMem: { type: Date, default: null },
   InicioFirma: { type: Date, default: null },
   ExpiraFirma: { type: Date, default: null }
 },
 Usuario: {
  type: String,
  trim: true,  
  required: true,
 },
 Tipo: {
  type: String,
  trim: true,  
  required: false,
 },
 Confirmacion:{
  type: Boolean,
  
  required: false
 },
 ContrasenaToken:{
  type: String,  
  required: false
 },
 ContrasenaTokenexpyre:{
  type: Date,  
  required: false
 },
 Telefono:{
  type: Number,
  trim: true,  
  required: false
 },

 Cuentas:{},
 Ciudad:{
  type: String,
  trim: true,
  required: false
 },
 Direccion:{
  type: String,
  trim: true,
  required: false
 },
 Cedula:{
  type: Number,
  trim: true,
  required: false
 },
 Coins:{
  type: Number,
  trim: true,
  required: false,
  default: 0
 },
 Email: {
  type: String,
  trim: true,
  required: true
 },
 Password: {
  type: String,
  trim: true,
  required: true
 },
ImagenP: {
  type: String,
  trim: true,
  required: false
 },
 RegistradoPor: {
  type: String,
  trim: true,
  required: false
 },

 Compras:[],
 SolicitudR:[], 
 IDcuenta: {
  type: String,
  trim: true,
  required: false
 },
 DBname: {
  type: String,
  trim: true,
  required: false,
  default: "sindb"
 },
 Membresia:{
  type: String,
  trim: true,
  default: "Gratuita"
 },
 Factura:{
            ruc:{  type: Number,  default: ""},
            razon:{  type: String,  default: ""},
   nombreComercial:{  type: String,  default: ""},
   dirMatriz:{  type: String,  default: ""},
   dirEstab:{  type: String,  default: ""},
   codigoEstab:{  type: String,  default: ""},
   codigoPuntoEmision:{  type: String,  default: ""},
   contriEspecial:{  type: Number,  default: ""},
   retencion:{  type: Number,  default: ""},
   rimpe:{  type: Boolean,  default: false},
   ObligadoContabilidad:{  type: Boolean,  default: false},   
   validateFact:{  type: Boolean,  default: false},
   logoEmp:{  type: String,  default: ""},
   populares:{  type: String,  default: false},
 },
 Firmdata:{
  url:{  type: String,  default: ""},
  pass:{  type: String,  default: ""},
  valiteFirma :{  type: Boolean,  default: false},
  publicId :{  type: String,  default: ""},
 },
 Vendedores:[]
});
// Antes de almacenar la contraseña en la base de datos la encriptamos con Bcrypt, esto es posible gracias al middleware de mongoose
UserSchema.pre('save', function(next){
  if(!this.isModified('Password')){
    return next();
} // Adding this statement solved the problem!!
  this.Password = bcrypt.hashSync(this.Password, saltRounds);
  next();
});
// Exportamos el modelo para usarlo en otros ficheros
module.exports = UserSchema