const express = require('express');
const router = express.Router();
const Product = require('../model/Product');


router.get('/list', (req, res) => {
    Product.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error: ' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/add', async(req,res)=>{
    var newProduct = new Product({
        id: req.body.id,
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        departamento: req.body.departamento,
        categoria: req.body.categoria,
        cantidad: req.body.cantidad,
        marca: req.body.marca,
        imagen: req.body.imagen
    });
    newProduct.save((err, doc) => {
        if (!err) { res.send({success:true, msg: 'Se añadio el producto',doc}); }
        else { console.log('Error en guardar el producto: ' + JSON.stringify(err, undefined, 2)); }
    });
    var producto = newProduct;
    if( !producto.nombre || !producto.precio || !producto.descripcion || !producto.departamento || !producto.categoria || !producto.cantidad || !producto.marca){
        res.send({mensaje: 'Debe cumplir con las características minimas del producto'});
        return;
    }
})

module.exports = router;