const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RepuestoSchema = new Schema({

    Eqid: {
        type: Number,
        trim: true,
        required: true
       },
       Grupo: {
        type: String,
        trim: true,  
        required: false,
        default: 'default'
       
       },
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
    Departamento: {
        type: String,
        trim: true,  
        required: false,
        default: 'default'
       
       },
    Titulo: {
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
    Existencia: {
        type: Number,
        trim: true,
        required: false,
        default: 0
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
       Precio_Alt: {
        type: Number,
        trim: true,
        required: false,
        default: 0
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
       Modelos:[],
       Precio_Compra: {
        type: Number,
        trim: true,
        required: false,
        default: 0
       },
       CantidadCompra: {
        type: Number,
        trim: true,
        required: false,
        default: 0
       },
 

   });

   module.exports = mongoose.model('Articulo', RepuestoSchema);