// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt

//Definimos los esquemas
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   CheckedA: {
  type: Boolean, 

 },
 CheckedP: {
   type: Boolean, 
  
   },
   Visibility: {
      type: Boolean, 
     
      },
      Tipo: {
         type: String, 
        
         },
         NombreC: {
            type: String, 
           
            },
            DineroIni: {
               type: Number, 
              
               },
               DineroActual: {
                  type: Number, 
                 
                  },
                  LimiteCredito: {
                     type: Number, 
                   },
                   FormaPago:{
                     type: String, 
                   },
                  iDcuenta: {
                     type: Number, 
                    
                     },
                  
                     Descrip: {
                        type: String, 
                       
                        },
                        Permisos: [],
                        Registros:{},

                      
});

module.exports = (mongoose.models && mongoose.models.Cuenta) || mongoose.model('Cuenta', UserSchema);