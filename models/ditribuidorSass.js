// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt
// Definimos el factor de costo, el cual controla cuánto tiempo se necesita para calcular un solo hash de BCrypt. Cuanto mayor sea el factor de costo, más rondas de hash se realizan. Cuanto más tiempo sea necesario, más difícil será romper el hash con fuerza bruta.
//Definimos los esquemas
const Schema = mongoose.Schema;
// Creamos el objeto del esquema con sus correspondientes campos
const UserSchema = new Schema({
 Usuario: {
  type: String,
  trim: true,  
  required: true,
 },

 Telefono:{
  type: Number,
  trim: true,  
  required: false
 },


 Direccion:{
  type: String,
  trim: true,
  required: false
 },
 Ruc:{
  type: Number,
  trim: true,
  required: true
 },

 Email: {
  type: String,
  trim: true,
  required: false
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
 MongoIdCuenta:{
  type: String,
  trim: true,
  required: true
 },
 Ciudad:{
  type: String,
  trim: true,
  required: false
 },
 iDcuenta: {
  type: String,
  trim: true,
  required: true
 },
 
 
});
// Antes de almacenar la contraseña en la base de datos la encriptamos con Bcrypt, esto es posible gracias al middleware de mongoose

// Exportamos el modelo para usarlo en otros ficheros
module.exports = UserSchema