const express = require('express');
const router = express.Router();
const Utils = require('../Utils/utils')
const Product = require('../model/Product');

router.get('/search', async (req, res) => {
    var params = req.query;
    var required = req.params;
    var criterio;
    
    if (params.nombre ||  params.marca|| params.precio || params.categoria || params.descripcion || params.departamento) {
        var filter = {};
        var encontrados
        var product = []
        var orden = params.order ? params.order : null;
        var valor1 = params.valor1 ? parseInt(params.valor1) : null;
        var valor2 = params.valor2 ? parseInt(params.valor2) : null;
        //var marca = params.marca ? params.marca : null;
        var max = params.max ? parseInt(params.max) : null;

        if (params.nombre) {
            filter.nombre = {
                $regex: Utils.ToRegex(params.nombre)
            };
        }
        if (params.precio) {
            filter.precio = {
                $regex: Utils.ToRegex(params.precio)  
            };
        }
        if (params.descripcion) {
            filter.descripcion = {
                $regex: Utils.ToRegex(params.descripcion)
            };
        }
        if (params.marca) {
            filter.marca = {
                $in: params.marca
            };
            
        } 
        if (params.categoria) {
            filter.categoria = {
                $regex: Utils.ToRegex(params.categoria)
            };
        }
        if (params.departamento) {
            filter.departamento = {
                $regex: Utils.ToRegex(params.departamento)
            };
        }
        
        if(valor1 && valor2){
            product.push({precio : {$gte: valor1,
                $lte: valor2}})
        }
        if (orden != null) {
            if (orden === "asc") {
                criterio = 1;
            } else {
                criterio = -1;
            }
        } else {
            criterio = 1;
            console.log("cae aqui")
        }



        filter ?  product.push(filter) : null;
        var filter2 = {$and: product};

        encontrados = await Product.find(filter2)
            .sort({nombre: criterio})

        if (max != null) {
            encontrados = await encontrados.limit(max)
        }
        
        res.send(encontrados);
        console.log(encontrados)
        console.log(filter)
        console.log(params.marca);
    }
});
//localhost:2020/product/:id
router.get('/list',async(req,res)=>{
    var params = req.query;
    var orden = params.order ? params.order : null;
    if (orden != null) {
        if (orden === "asc") {
            criterio = 1;
        } else {
            criterio = -1;
        }
    } else {
        criterio = 1;
        console.log("cae aqui")
    }
    var filter = {};
    var encontrados = await Product.find(filter).sort({nombre:criterio})
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
    const {file,body}=req;//req.file existe gracias al middleware de multer
    res.status(200).json({
        body:body,
        file:file
    })
    newProduct.save((err, doc) => {
        if (!err) { res.send({success:true, msg: 'Se añadio el producto',doc}); }
        else { console.log('Error en guardar el producto: ' + JSON.stringify(err, undefined, 2)); }
    });
})
router.post('/:id', async (req, res) =>{
    var required = req.params;
    var filter = {};
    filter.id = parseInt(required.id);
    //var found = await Product.findOne(filter);
    /* if(found){
        res.send({error : 'Este estudiante ya existe con el id: '+required.id+ '\nEstá dado de alta a nombre: '+found.nombre});
        return;
    } */
    var producto = req.body;
    producto.id = filter.id;

    if( !producto.nombre || !producto.precio || !producto.descripcion || !producto.departamento || !producto.categoria || !producto.cantidad || !producto.marca){
        res.send({mensaje: 'Debe cumplir con las características minimas del producto'});
        return;
    }

    var insertado = await  Product.create(producto);
    if(insertado){
        res.send({mensaje : 'Se inserto Correctamente'});
    }else{
        res.send({mensaje : 'No se inserto Correctamente'});
    }
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