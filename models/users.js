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
 ModeloTel:[],
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
 iGlassCoins:{
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
});
// Antes de almacenar la contraseña en la base de datos la encriptamos con Bcrypt, esto es posible gracias al middleware de mongoose
UserSchema.pre('save', function(next){
  if(!this.isModified('Password')){
    return next();
} // Adding this statement solved the problem!!
  this.Password = bcrypt.hashSync(this.Password, saltRounds);
  next();
});
// Exportamos solo el esquema para usarlo en otros ficheros
module.exports = UserSchema;