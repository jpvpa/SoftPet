var mongoose = require('mongoose');

module.exports = 
mongoose.model( 'Cart', new mongoose.Schema({
    id: String,
    user: String,
    carrito: [Object],
    total: Number,
    cantidadTotal: Number,
    },
    {versionKey: false}),
    'Carts' );
