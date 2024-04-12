// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt

//Definimos los esquemas
const Schema = mongoose.Schema;

const UserSchema = new Schema({

  reg: {
  
    
      },
      fechaEjecucion:{
         type: Number, 
       
         },
      
        


});

module.exports = mongoose.model('Repeticion', UserSchema);