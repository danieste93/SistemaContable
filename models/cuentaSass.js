// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt

//Definimos los esquemas
const Schema = mongoose.Schema;

const accountSchema = new Schema({
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
                  type: mongoose.Types.Decimal128, 
                 
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
                        urlIcono:  {
                           type: String,
                           default: ""
                         },
                         Background:  {

                           Seleccionado:"",
                           urlBackGround:"",
                           colorPicked:"",
                       
                         }

                      
});

module.exports = accountSchema