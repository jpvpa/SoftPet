const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cart = require('../model/Cart');
const Products = require('../model/Product');

const enCarrito = [];

router.use( '/generate', (req, res)=>{
    var cartID = '';
    var Carts;
    //Falta la búsqueda por usuario loggeado
    if( !req.cookies['cartID'] )
    {
        var randomSeed = new Date();
        cartID = randomSeed.getDay() + '-' + randomSeed.getMilliseconds();
        res.cookie( 'cartID', cartID , { maxAge: 99999999, httpOnly: false });
        var Carrito = new cart({
            id: cartID,
            user: 'anonymousUser',
            carrito: [],
            total: 0,
            cantidadTotal: 0,
        });
        Carrito.save(function(err){
            if(err)
                console.log(err);
            else
                console.log("This should be saved");
        })
        res.send(Carrito);
    }
    //Si ya existe, buscar el carrito de esa sesión
    else
    {
        cartID = req.cookies['cartID'] + '';
        cart.findOne({id: cartID}, (err, oldCart) =>{
            res.send(oldCart);
        })
    }
});

router.get('/add/:id', (req, res) =>{
    cartID = req.cookies['cartID']
    reqID = req.params.id;
    var indexCarrito;
    var nuevoProducto;

    Products.findOne({id: reqID}, (err, product) =>{
        nuevoProducto = product;
    })

    cart.findOne({id: cartID}, (err, newCart) =>{
        if(err)
            console.log(err);
        
        newCart.carrito.push({id: nuevoProducto.id, precio: nuevoProducto.precio, nombre: nuevoProducto.nombre, imagen: nuevoProducto.imagen});
        newCart.total += nuevoProducto.precio;
        newCart.cantidadTotal++;
        newCart.save();                
        res.send(newCart);
    });
});

router.post('/remove/:id', (req, res) => {
    var cartID = req.cookies['cartID'];
    var productID = req.params.id;
    var nuevoProducto;

    Products.findOne({id: productID}, (err, product) =>{
        nuevoProducto = product;
    })
    
    cart.findOne({id: cartID}, (err, newCart) =>{
        newCart.carrito.some(function(product, index){
            if(product.id == productID){
                try{
                    newCart.carrito.splice(index, 1);
                    newCart.total -= nuevoProducto.precio;
                    newCart.cantidadTotal--;
                }catch(e){
                    res.redirect('/');
                }
                newCart.save();
            }
        })
        res.send(newCart);
    })
})

router.get('/show', async (req, res) =>{
    cartID = req.cookies['cartID'];
    let cantidadProductos;
    let counter = {}
    var llaves = []
    var finalCart = []
    let newCart = await cart.findOne({id: cartID});
    
    newCart.carrito.forEach( (obj) => {
        var key = JSON.stringify(obj.id) 
        counter[key] = (counter[key] || 0) + 1;
    });
    
    cantidadProductos = JSON.parse(JSON.stringify(counter));        

    Object.keys(cantidadProductos).forEach( (key) =>{
        llaves.push(key);
    });

    for(var i = 0; i <= llaves.length - 1; i++){
        producto = await Products.findOne({id: llaves[i]});
        finalCart.push({producto: producto, enCarrito: cantidadProductos[llaves[i]]});
        if(i == llaves.length - 1){
            finalCart.push({totalAPagar: newCart.total});
            finalCart.push({cantidadProductos: newCart.cantidadTotal})
            res.send(finalCart);
        }
    }
})

module.exports = router;