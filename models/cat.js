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

}
     
                      
});

module.exports = mongoose.model('Categoria', UserSchema);