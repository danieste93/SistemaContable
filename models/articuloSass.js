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
        required: false,
        default: 'default'
              }, 
                Tipo: {
                type: String,
                required: false,
                default: 'Producto'
               },
               Medida: {
                type: String,       
                required: true,
                default: "Unidades",
               },
                 
       Iva: {
        type: Boolean,
  
        required: true,
        default: true,
       },
       CantidadCompra: {
        type: Number,
        trim: true,
        required: false,
        default: 1
       },
       Existencia: {
        type: Number,
        trim: true,
        required: false,
        default: 0
       },
       Precio_Venta: {
        type: Number,
        trim: true,
        required: false,
        default: 0
       },
       Precio_Alt: {
        type: Number,
        trim: true,
        required: false,
        default: 0
       },

       Grupo: {
        type: String,
        trim: true,  
        required: false,
        default: 'default'
       
       },
       Departamento: {
        type: String,
        trim: true,  
        required: false,
        default: 'default'
       
       },
       Categoria: {
        type: Object,
        trim: true,  
        required: true,
       },
   
       SubCategoria: {
        type: String,
        trim: true,  
        required: false,
        default: 'default'
       
       },

       Marca: {
        type: String,
        trim: true,
        required: false,
        default: 'default'
       
       },
     
        Calidad: {
           type: String,
           trim: true,
           required: false,
           default: 'default'
         
          },
          Color: {
            type: String,
            trim: true,
            required: false, 
            default: 'default'
           },

          Descripcion: {
            type: String,
            required: false,
            default: 'default'
          
           },
           Garantia: {
            type: String,
            required: false,
            default: 'default'
           },
        
           MiniDescrip: {
            type: String,
            required: false,
            default: 'Aqui una pequeña descripción'
           },
           Imagen: [],      
     
           Caduca: {
      
           },
           TiempoReq:{
    
           },
           Producs: {
      
           },
           Diid: {
            type: String,
            trim: false,
            required: false
           },
           Barcode: {
            type: String,
            trim: false,
            required: false
           },
 
       Proveedor: {
        type: String,
        trim: true,
        required: false, 
        default: 'default'     
       },
      
       Precio_Compra: {
        type: Number,
        trim: true,
        required: false,
        default: 0
      
       },
       Precio_Venta: {
        type: Number,
        trim: true,
        required: false,
        default: 0
       },
       
       Bodega_Inv: {
        type: Number,
        trim: true,
        required: true,
        default:9999998
       
       },
    
      
  
       Valor_Total: {
        type: Number,
        trim: true,
        required: false,
        default: 0
       },
      
       
       PrecioCompraTotal: {
        type: Number,
        trim: true,
        required: false,
        default: 0
       },
    
     
  
      
   

   });

   module.exports = ArtSchema;