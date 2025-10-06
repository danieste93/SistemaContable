// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt

//Definimos los esquemas
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 
 Documento: {
   type: String, 
   default:"Reg"
  
   },
   Accion: {
      type: String, 
    
      },
      TipoRep:{
         type: String, 
       
         },
      Valrep: {
         type: String, 
       
         },
   IdRegistro: {
      type: Number, 
     
      },
      Usuario: { },
      CuentaSelec:{},
      CuentaSelec2:{},
      CatSelect:{},
      IdRep: {      
       
        },
        
         urlImg:[],
         Nota: {
            type: String, 
          
            },
            Descripcion: {
               type: String, 
             },
             Tiempo: {
               type: Number, 
             },
             Importe: {
               type: Number, 
             },
             Estado:{
               type: Boolean, 
             },
             CuentaVal:{
              type: Number, 
            }


});

module.exports = mongoose.model('Reg', UserSchema);