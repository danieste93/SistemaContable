// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt

//Definimos los esquemas
const Schema = mongoose.Schema;

const UserSchema = new Schema({

 CompraNumero: {
  type: Number, 

 },

 ArtComprados: {   },
 Tiempo: {
  type: Number, 

 },
 Usuario:{},
 ValorTotal: {
    type: Number, 
  
   },
    Proveedor:{
      type: String, 
   },
Fpago:{

},
idReg:{
   type: Number, 
 
  },
  arrRegs:[],
  IvaEC: {
   type: Number,
   trim: true,  
   required: false,
  },
  Doctype:{
   type: String, 
   default: "Nota de venta"
  },
  Factdata:{
   ruc:{  type: Number,  default: 0},
   nombreComercial:{  type: String,  default: ""},
   numeroFactura:{  type: String,  default: ""},
   numeroAutorizacion:{  type: String,  default: ""},
   fechaAutorizacion:{  type: String,  default: ""},
  },

  Validada:{
   type: Boolean, 
   default: false,
  },
  ClaveAcceso:{
   type: String, 
   default: "0000"
  },

});

module.exports =  UserSchema;