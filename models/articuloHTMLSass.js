const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ArtSchema = new Schema({

    Eqid: {
        type: String,
        trim: true,
        required: true
       },
       Titulo: {
        type: String,
        trim: true,
        required: true,
        default: 'default'
              }, 
       idArt:{
        type: String,
        trim: true,
        required: false
       },
       publicHtml:{
        
       },
       Diseno:{
        
       },
       Imagen:[],
       Categoria: {
        type: String,
        trim: true,
        required: false,
        default: 'default'
              }, 
              SubCategoria: {
                type: String,
                trim: true,
                required: false,
                default: 'default'
                      }, 
       Tipo:{
        type: String,
        trim: true,
        required: false,
        default:"HtmlArt"
       },

    Tiempo:{
        type: Number,
     
    
       },
     
  
      
   

   });

   module.exports = ArtSchema;