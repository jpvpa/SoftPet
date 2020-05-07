var mongoose = require('mongoose');

module.exports = 
mongoose.model( 'Product', new mongoose.Schema({
    id:Number,
    nombre: String,
    precio: Number,
    descripcion: String,
    departamento: String,
    categoria: String,
    cantidad: Number,
    marca: String,
    imagen: String,
}), 'Products' );


