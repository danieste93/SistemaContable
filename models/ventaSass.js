const mongoose = require('mongoose');
var moment = require('moment');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    idCliente:{
        type: String,
        trim: true,  
        required: false
    },


    nombreCliente: {
        type: String,
        trim: true,  
        required: false

       },
              
       telefonoCliente: {
        type: Number,
        trim: true,  
        required: false,
       },
      
       correoCliente: {
        type: String,
        trim: true,  
        required: false

       },

       direccionCliente: {
        type: String,
        trim: true,  
        required: false,
       },
       cedulaCliente: {
        type: String,
        trim: true,  
        required: false,
       },
       ciudadCliente: {
        type: String,
        trim: true,  
        required: false,
       },
       iDVenta: {
        type: Number,
        trim: true,  
        required: true,
       },
       formasdePago: {        },
       articulosVendidos:{},
       adicionalInfo:[],
       PrecioCompraTotal: {
        type: Number,
        trim: true,  
        required: true,
       },
       valorDescuento: {
        type: Number,
        trim: true,  
        required: true,
       },
     
  
        tiempo: {},
        TipoVenta:{
            type: String,
            trim: true,  
            required: false,
        },
        FormasCredito:{},
        
        Vendedor:{},
        CreditoTotal:{
            type: Number,
            trim: true,  
            required: false,
           },

           iDRegistro:{
            type: Number,
            trim: true,  
            required: false,
           },
           Doctype:{
            type: String,
            trim: true,  
            required: false,
           },
           CuentaCredito:{
            type: String,
            trim: true,  
            required: false,
           },
           IvaEC: {
            type: Number,
            trim: true,  
            required: false,
           },
           baseImponible: {
            type: Number,
            trim: true,  
            required: false,
           },
           FactAutorizacion: {
            type: String,
            trim: true,  
            required: false,
           },
           FactFechaAutorizacion: {
            type: String,
            trim: true,  
            required: false,
           },
           Estado:{
            type: String,
            trim: true,  
            required: false,
           },
           Secuencial: {
            type: Number,
            trim: true,  
            required: false,
           }, 
           ClaveAcceso:{
            type: String,
            trim: true,  
            required: false,
           },
           carritoNumero:{
            type: Number,
            trim: true,  
            required: false,
            default:0
           },
           arrRegs:[],
           NotaCredito:{

        
           },
           Html:{
            type: String,
           },
         

   });

   module.exports = OrderSchema;