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
        required: true
       },
              
       telefonoCliente: {
        type: Number,
        trim: true,  
        required: false,
       },
       carritoNumero: {
        type: Number,
        trim: true,  
        required: true,
       },
       correoCliente: {
        type: String,
        trim: true,  
        required: true,
       },

       direccionCliente: {
        type: String,
        trim: true,  
        required: false,
       },
       cedulaCliente: {
        type: Number,
        trim: true,  
        required: false,
       },
       ciudadCliente: {
        type: String,
        trim: true,  
        required: false,
       },
       bancoCliente: {
        type: String,
        trim: true,  
        required: false,
       },
       formadePago: {
        type: String,
        trim: true,  
        required: true,
       },
       valorFinal: {
        type: Number,
        trim: true,  
        required: true,
       },
 
   estatus:{
                pago: {
                    EstadoPago :{
                        type: String,                      
                        required: false,
                        default:"default",
                    },
                    FormasPago:[],
                    estado:{
                        type: Boolean,                      
                        required: false,
                        default:false,
                    },
                  
                    idMongoVenta:"",
                    idVenta:"",

                   
                },
                realizado: {
                    type: Boolean,                    
                    required: false,
                    default:false,
                }
   },
   tiempo: {
    type: String, 
    trim: true,  
    required: true,
},
  carrito: [], 

   coinsAntes: {
    type: Number,
    trim: true,  
    required: false,

   }
   ,
   coinsDespues: {
    type: Number,
    trim: true,  
    required: false,

   } ,
   envio:{
   status: {
        type: String, 
        trim: true,  
        required: false,
    },
    tipo: {
        type: String, 
        trim: true,  
        required: false,
    },
    valor: {
        type: Number,
        required: false,
    },

   },
   coinsUsadas: {
    type: Number,
    trim: true,  
    required: false,
  
   },
   urlComprobante:  {
    type: Array,
    default: []
  }

   });

   module.exports = OrderSchema;