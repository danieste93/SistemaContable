// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt

//Definimos los esquemas
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 Contador: {
  type: Number, 

 },
 ContadorRep: {
    type: Number, 
  
   },
   Contmascuenta: {
      type: Number, 
    
     },
     ContRegs: {
      type: Number, 
    
     },
     ContVentas: {
      type: Number, 
    
     },
     ContCompras: {
      type: Number
    
     },
     ContArticulos: {
      type: Number
    
     },
     ContadorCat: {
      type: Number,
   
     },
     iDgeneral: {
      type: Number
    
     },
     Data:[],
     ContSecuencial: {
      type: Number,
     
    
     },
     ContVendedores: {
      type: Number,
      
    
     },
     ContCotizacion: {
      type: Number,
    
     },
     ContCarrito: {
      type: Number,
    
     },
     ContPublicaciones: {
      type: Number,
    
     },
     
});

module.exports = UserSchema