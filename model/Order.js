var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = 
mongoose.model( 'Order', new mongoose.Schema({
    id: String,
    user: [Object],
    cart: [Object],
    cantidadTotal: Number,
    total: Number,
    address: [Object],
    payment:[Object]
}), 'Orders' );