// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt

//Definimos los esquemas
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   tipocat: {
      type: String,    

 },
 subCategoria: [],
 
 nombreCat:{
   type: String,    

},
imagen:{
   type: Array,   

},
urlIcono:{
   type: String,    

},   
idCat:{
         type:Number
      },
sistemCat:{
   type: Boolean,
   default:false    

},   

});

module.exports =UserSchema