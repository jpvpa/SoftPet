const express = require('express');
const router = express.Router();
const Utils = require('../Utils/utils')
const Product = require('../model/Product');


/* router.get('/list', (req, res) => {
    Product.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error: ' + JSON.stringify(err, undefined, 2)); }
    });
});*/


router.get('/search',async(req,res)=>{
    var params = req.query;
    var required = req.params;
    if(params.nombre || params.precio || params.marca || params.categoria || params.descripcion || params.departamento ){
        var filter = {};
        var max = params.max ? parseInt(params.max) : null;
        if(params.nombre){
            filter.nombre ={$regex: Utils.ToRegex(params.nombre)};
        }
        if(params.precio){
            filter.precio = {$regex: Utils.ToRegex(params.precio)};
        }
        if(params.descripcion){
            filter.descripcion =  {$regex: Utils.ToRegex(params.descripcion)};
        }
        if(params.marca){
            filter.marca =  {$regex: Utils.ToRegex(params.marca)};
        }
        if(params.categoria){
            filter.categoria =  {$regex: Utils.ToRegex(params.categoria)};
        }
        if(params.departamento){
            filter.departamento = {$regex: Utils.ToRegex(params.departamento)};
        }
        var encontrados = await Product.find(filter)
                                    .sort({nombre:1})
        if( max!=null ){
            encontrados = await encontrados.limit(max)
        }

    res.send(encontrados);
    } 
});
router.get('/catalog',async(req,res)=>{
    var params = req.query;
    var required = req.params;
    if( params.categoria || params.departamento ){
        var filter = {};
        var max = params.max ? parseInt(params.max) : null;
        if(params.categoria){
            filter.categoria =  {$regex: Utils.ToRegex(params.categoria)};
        }
        if(params.departamento){
            filter.departamento = {$regex: Utils.ToRegex(params.departamento)};
        }
        var encontrados = await Product.find(filter)
                                    .sort({nombre:1})
        if( max!=null ){
            encontrados = await encontrados.limit(max)
        }

    res.send(encontrados);
    } 
});
//localhost:2020/product/:id
router.get('/list',async(req,res)=>{
    var parmeters = req.query;
    var filter = {};
    var encontrados = await Product.find(filter)
    res.send(encontrados);
    res.end();
}); 
router.get('/:id',async(req,res)=>{
    var parmeters = req.query;
    var required = req.params;
    var filter = {};
    filter.id = parseInt(required.id)
    var encontrados = await Product.findOne(filter)
    res.send(encontrados);
    res.end();
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
    var producto = newProduct;
    if( !producto.nombre || !producto.precio || !producto.descripcion || !producto.departamento || !producto.categoria || !producto.cantidad || !producto.marca){
        res.send({mensaje: 'Debe cumplir con las características minimas del producto'});
        return;
    }
    newProduct.save((err, doc) => {
        if (!err) { res.send({success:true, msg: 'Se añadio el producto',doc}); }
        else { console.log('Error en guardar el producto: ' + JSON.stringify(err, undefined, 2)); }
    });
})
router.put('/:id', async (req, res) =>{
    var required = req.params;
    var filter = {};
    filter.id = parseInt(required.id);
    var encontrados = await Product.findOne(filter);
    if(!encontrados){
        res.send({mensaje : 'Producto no existente'});
    }
    var producto = req.body;
    producto.id = filter.id;
    var insertado = await  Product.updateOne(filter,{$set : producto});
    if(insertado){
        res.send({mensaje : 'Se actualizo correctamente'});
    }else{
        res.send({mensaje : 'No se actualizo Correctamente'});
    }
})
router.delete('/:id', async (req, res) =>{
    var required = req.params;
    var filter = {};
    filter.id = parseInt(required.id);
    var encontrados = await Product.findOne(filter);
    if(!encontrados){
        res.send({mensaje : 'Producto no existente'});
    }
    var insertado = await  Product.deleteOne(filter);
    if(insertado){
        res.send({mensaje : 'Se elimino correctamente'});
    }else{
        res.send({mensaje : 'No se elimino Correctamente'});
    }
});


module.exports = router;