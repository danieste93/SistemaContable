// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt
const bcrypt = require('bcrypt');
// Definimos el factor de costo, el cual controla cuánto tiempo se necesita para calcular un solo hash de BCrypt. Cuanto mayor sea el factor de costo, más rondas de hash se realizan. Cuanto más tiempo sea necesario, más difícil será romper el hash con fuerza bruta.
const saltRounds = 10;
//Definimos los esquemas
const Schema = mongoose.Schema;
// Creamos el objeto del esquema con sus correspondientes campos
const UserSchema = new Schema({
 SiSPagos: {
   TipoVentaMeM: { type: String, default: "" },
   BancoMEM: { type: String, default: "" },
   ComprobanteMeM: { type: String, default: "" },
   FirmaCortesia: { type: String, default: "" },
   FechaCompraFirma: { type: Date, default: null },
   TipoVentaFirma: { type: String, default: "" },
   ComprobanteFirma: { type: String, default: "" },
   BancoFirma: { type: String, default: "" }
 },
 DatosFacturacion: {
   Nombres: { type: String, default: "" },
   CedulaoRuc: { type: String, default: "" },
   Correo: { type: String, default: "" },
   Telefono: { type: String, default: "" },
   Direccion: { type: String, default: "" }
 },
 Fechas: {
   Creacion: { type: Date, default: Date.now },
   InicioMem: { type: Date, default: null },
   ExpiraMem: { type: Date, default: null },
   InicioFirma: { type: Date, default: null },
   ExpiraFirma: { type: Date, default: null }
 },
 Usuario: {
  type: String,
  trim: true,  
  required: true,
 },
 Tipo: {
  type: String,
  trim: true,  
  required: false,
 },
 Confirmacion:{
  type: Boolean,
  
  required: false
 },
 ContrasenaToken:{
  type: String,  
  required: false
 },
 ContrasenaTokenexpyre:{
  type: Date,  
  required: false
 },
 Telefono:{
  type: Number,
  trim: true,  
  required: false
 },

 Cuentas:{},
 Ciudad:{
  type: String,
  trim: true,
  required: false
 },
 Direccion:{
  type: String,
  trim: true,
  required: false
 },
 Cedula:{
  type: Number,
  trim: true,
  required: false
 },
 Coins:{
  type: Number,
  trim: true,
  required: false,
  default: 0
 },
 Email: {
  type: String,
  trim: true,
  required: true
 },
 Password: {
  type: String,
  trim: true,
  required: true
 },
ImagenP: {
  type: String,
  trim: true,
  required: false
 },
 RegistradoPor: {
  type: String,
  trim: true,
  required: false
 },

 Compras:[],
 SolicitudR:[], 
 IDcuenta: {
  type: String,
  trim: true,
  required: false
 },
 DBname: {
  type: String,
  trim: true,
  required: false,
  default: "sindb"
 },
 Membresia:{
  type: String,
  trim: true,
  default: "Gratuita"
 },
 Factura:{
            ruc:{  type: Number,  default: ""},
            razon:{  type: String,  default: ""},
   nombreComercial:{  type: String,  default: ""},
   dirMatriz:{  type: String,  default: ""},
   dirEstab:{  type: String,  default: ""},
   codigoEstab:{  type: String,  default: ""},
   codigoPuntoEmision:{  type: String,  default: ""},
   contriEspecial:{  type: Number,  default: ""},
   retencion:{  type: Number,  default: ""},
   rimpe:{  type: Boolean,  default: false},
   ObligadoContabilidad:{  type: Boolean,  default: false},   
   validateFact:{  type: Boolean,  default: false},
   logoEmp:{  type: String,  default: ""},
   populares:{  type: String,  default: false},
 },
 Firmdata:{
  url:{  type: String,  default: ""},
  pass:{  type: String,  default: ""},
  valiteFirma :{  type: Boolean,  default: false},
  publicId :{  type: String,  default: ""},
 },
 // Campo para guardar configuraciones personalizadas del usuario
 ConfiguracionPersonalizada: {
   // Configuración de widgets del dashboard
   widgetConfig: {
     showIncomeChart: { type: Boolean, default: true },
     showExpenseChart: { type: Boolean, default: true },
     showPieChart: { type: Boolean, default: true },
     showBarChart: { type: Boolean, default: true },
     showLiquidityChart: { type: Boolean, default: true },
     showTimeFilter: { type: Boolean, default: true },
     incomeChartType: { type: String, default: 'line' },
     expenseChartType: { type: String, default: 'line' },
     pieChartType: { type: String, default: 'pie' },
     barChartType: { type: String, default: 'bar' },
     liquidityChartType: { type: String, default: 'line' },
     customColors: {
       income: { type: String, default: '#8cf73a' },
       expense: { type: String, default: '#f1586e' },
       liquidity: { type: String, default: '#00d4aa' },
       pieColors: { type: [String], default: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }
     }
   },
   // Valores de filtros de tiempo para widgets
   tiempoValue: { type: String, default: 'diario' },
   pieValue: { type: String, default: 'gastos' },
   // Orden de los widgets en el dashboard
   widgetOrder: { 
     type: [String], 
     default: ['showTimeFilter', 'showIncomeChart', 'showExpenseChart', 'showPieChart', 'showBarChart', 'showLiquidityChart'] 
   },
   // Configuración del registro contable
   registroContableConfig: {
     Cuentas: { type: Boolean, default: false },
     Categorias: { type: Boolean, default: true },
     Pie: { type: Boolean, default: true },
     Line: { type: Boolean, default: false },
     tiempo: { type: String, default: 'mensual' },
     InvOption: { type: String, default: 'categoria' },
     allData: { type: Boolean, default: true },
     tiempoFiltro: { type: String, default: 'mensual' },
     vistaPreferida: { type: String, default: 'categorias' },
     categoriasExcluidas: { type: [String], default: [] },
     ordenPreferido: { type: String, default: 'fecha' },
     mostrarOcultas: { type: Boolean, default: false }
   },
   // Configuración de vista de cuentas (menú de 3 puntos)
   cuentasVistaConfig: {
     visualtipos: { type: Boolean, default: true },
     visibility: { type: Boolean, default: false },
     cuentas0: { type: Boolean, default: false },
     vistaFormato: { type: String, default: 'cuadros' },
     ordenCuentas: { type: Schema.Types.Mixed, default: {} }
   },
   // Configuraciones generales de UI
   uiConfig: {
     tema: { type: String, default: 'default' },
     idioma: { type: String, default: 'es' },
     notificaciones: { type: Boolean, default: true }
   }
 },
 Vendedores:[]
});
// Antes de almacenar la contraseña en la base de datos la encriptamos con Bcrypt, esto es posible gracias al middleware de mongoose
UserSchema.pre('save', function(next){
  if(!this.isModified('Password')){
    return next();
} // Adding this statement solved the problem!!
  this.Password = bcrypt.hashSync(this.Password, saltRounds);
  next();
});
// Exportamos el modelo para usarlo en otros ficheros
module.exports = UserSchema