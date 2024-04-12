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
});

module.exports = mongoose.model('Compras', UserSchema);