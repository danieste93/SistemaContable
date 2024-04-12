// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt

//Definimos los esquemas
const Schema = mongoose.Schema;

const regSchema = new Schema({
 
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
      CuentaSelec:{
        idCuenta:{ type: String, },
        nombreCuenta:{ type: String, },
      },
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
              default:""
             },
             Descripcion2: {
            
              
            },
             Tiempo: {
               type: Number, 
             },
             TiempoEjecucion: {
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
            },
            Versiones:  {
              type: Array,
              default: []
            }

});

module.exports = regSchema