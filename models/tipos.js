// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
// Cargamos el módulo de bcrypt

//Definimos los esquemas
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 Tipos: [],
 
});

module.exports = mongoose.model('tiposmodel', UserSchema);