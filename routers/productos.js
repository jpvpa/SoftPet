const express = require('express');
const router = express.Router();
const Utils = require('../Utils/utils')
const Product = require('../model/Product');


router.get('/search', async (req, res) => {
    var params = req.query;
    var required = req.params;
    if (params.nombre || params.precio || params.marca || params.categoria || params.descripcion || params.departamento) {
        var filter = {};
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
                $regex: Utils.ToRegex(params.marca)
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
        var encontrados = await Product.find(filter)
            .sort({
                nombre: 1
            })
        if (max != null) {
            encontrados = await encontrados.limit(max)
        }

        res.send(encontrados);
    }
});
router.get('/searchRange', async (req, res) => {
    var params = req.query;
    var required = req.params;
    var marcas = params.marcas.split(',');
    var parametros = new Array(11);
    var arreglo = new Array(11);
    var criterio;
    var filter = {};
    var orden = params.order ? params.order : null;
    var valor1 = params.valor1 ? parseInt(params.valor1) : null;
    var valor2 = params.valor2 ? parseInt(params.valor2) : null;
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
    parametros[0] = marcas[0];
    parametros[1] = marcas[1];
    parametros[2] = marcas[2];
    parametros[3] = marcas[3];
    parametros[4] = marcas[4];
    parametros[5] = marcas[5];
    parametros[6] = marcas[6];
    parametros[7] = marcas[7];
    parametros[8] = marcas[8];
    parametros[9] = marcas[9];
    parametros[10] = marcas[10];

    if (parametros[0] == 1) {
        arreglo[0] = "Royal Canin";
    } else {
        arreglo[0] = "";
    }
    if (parametros[1] == 1) {
        arreglo[1] = "Pedigree";
    } else {
        arreglo[1] = "";
    }
    if (parametros[2] == 1) {
        arreglo[2] = "Profine";
    } else {
        arreglo[2] = "";
    }
    if (parametros[3] == 1) {
        arreglo[3] = "Whiskas";
    } else {
        arreglo[3] = "";
    }
    if (parametros[4] == 1) {
        arreglo[4] = "Sera";
    } else {
        arreglo[4] = "";
    }
    if (parametros[5] == 1) {
        arreglo[5] = "Ferplast";
    } else {
        arreglo[5] = "";
    }
    if (parametros[6] == 1) {
        arreglo[6] = "SaniCat";
    } else {
        arreglo[6] = "";
    }
    if (parametros[7] == 1) {
        arreglo[7] = "Mars";
    } else {
        arreglo[7] = "";
    }
    if (parametros[8] == 1) {
        arreglo[8] = "Greenies";
    } else {
        arreglo[8] = "";
    }
    if (parametros[9] == 1) {
        arreglo[9] = "Frolic";
    } else {
        arreglo[9] = "";
    }
    if (parametros[10] == 1) {
        arreglo[10] = "Beco";
    } else {
        arreglo[10] = "";
    }

    if (params.departamento) {
        filter.departamento = {
            $regex: Utils.ToRegex(params.departamento)
        };
    }
    if (params.categoria) {
        filter.categoria = {
            $regex: Utils.ToRegex(params.categoria)
        };
    }
    if (params.nombre) {
        filter.nombre = {
            $regex: Utils.ToRegex(params.nombre)
        };
    }
    var encontrados = await Product.find({
        departamento: filter.departamento,
        categoria: filter.categoria,
        $or: [{
                marca: arreglo[0]
            },
            {
                marca: arreglo[1]
            },
            {
                marca: arreglo[2]
            },
            {
                marca: arreglo[3]
            },
            {
                marca: arreglo[4]
            },
            {
                marca: arreglo[5]
            },
            {
                marca: arreglo[6]
            },
            {
                marca: arreglo[7]
            },
            {
                marca: arreglo[8]
            },
            {
                marca: arreglo[9]
            },
            {
                marca: arreglo[10]
            },
            {
                nombre:filter.nombre
            }

        ],
        "precio": {
            $gte: valor1,
            $lte: valor2
        }
    }).sort({
        nombre: criterio
    }); //CadenaConexion.collection()
    res.send(encontrados);

    res.end();
});

router.get('/searchbar', async (req, res) => {
    var params = req.query;
    var marcas = params.marcas.split(',');
    var parametros = new Array(11);
    var arreglo = new Array(11);
    var criterio;
    var filter = {};
    var orden = params.order ? params.order : null;
    var valor1 = params.valor1 ? parseInt(params.valor1) : null;
    var valor2 = params.valor2 ? parseInt(params.valor2) : null;
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
    parametros[0] = marcas[0];
    parametros[1] = marcas[1];
    parametros[2] = marcas[2];
    parametros[3] = marcas[3];
    parametros[4] = marcas[4];
    parametros[5] = marcas[5];
    parametros[6] = marcas[6];
    parametros[7] = marcas[7];
    parametros[8] = marcas[8];
    parametros[9] = marcas[9];
    parametros[10] = marcas[10];

    if (parametros[0] == 1) {
        arreglo[0] = "Royal Canin";
    } else {
        arreglo[0] = "";
    }
    if (parametros[1] == 1) {
        arreglo[1] = "Pedigree";
    } else {
        arreglo[1] = "";
    }
    if (parametros[2] == 1) {
        arreglo[2] = "Profine";
    } else {
        arreglo[2] = "";
    }
    if (parametros[3] == 1) {
        arreglo[3] = "Whiskas";
    } else {
        arreglo[3] = "";
    }
    if (parametros[4] == 1) {
        arreglo[4] = "Sera";
    } else {
        arreglo[4] = "";
    }
    if (parametros[5] == 1) {
        arreglo[5] = "Ferplast";
    } else {
        arreglo[5] = "";
    }
    if (parametros[6] == 1) {
        arreglo[6] = "SaniCat";
    } else {
        arreglo[6] = "";
    }
    if (parametros[7] == 1) {
        arreglo[7] = "Mars";
    } else {
        arreglo[7] = "";
    }
    if (parametros[8] == 1) {
        arreglo[8] = "Greenies";
    } else {
        arreglo[8] = "";
    }
    if (parametros[9] == 1) {
        arreglo[9] = "Frolic";
    } else {
        arreglo[9] = "";
    }
    if (parametros[10] == 1) {
        arreglo[10] = "Beco";
    } else {
        arreglo[10] = "";
    }

    if (params.departamento) {
        filter.departamento = {
            $regex: Utils.ToRegex(params.departamento)
        };
    }
    if(params.nombre){
        filter.nombre = {
            $regex: Utils.ToRegex(params.nombre)
        };
    }
    var encontrados = await Product.find({
        departamento: filter.departamento,
        nombre: filter.nombre,
        $or: [{
                marca: arreglo[0]
            },
            {
                marca: arreglo[1]
            },
            {
                marca: arreglo[2]
            },
            {
                marca: arreglo[3]
            },
            {
                marca: arreglo[4]
            },
            {
                marca: arreglo[5]
            },
            {
                marca: arreglo[6]
            },
            {
                marca: arreglo[7]
            },
            {
                marca: arreglo[8]
            },
            {
                marca: arreglo[9]
            },
            {
                marca: arreglo[10]
            }

        ],
        "precio": {
            $gte: valor1,
            $lte: valor2
        }
    }).sort({
        nombre: criterio
    }); //CadenaConexion.collection()


    res.send(encontrados);

    res.end();
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