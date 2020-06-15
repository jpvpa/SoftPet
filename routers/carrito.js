const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cart = require('../model/Cart');
const Products = require('../model/Product');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.use( '/generate', (req, res)=>{
    var cartID = ''
    
    //var userRole = req.user ? req.user.id : 'anonymousUser'
    var Carts;
    console.log(req.user)
    console.log(req.params);
    //Falta la búsqueda por usuario loggeado
    if( !req.cookies['cartID'] )
    {
        var randomSeed = new Date();
        cartID = randomSeed.getDay() + '-' + randomSeed.getMilliseconds();
        res.cookie( 'cartID', cartID , { maxAge: 99999999, httpOnly: false });
        var Carrito = new cart({
            id: cartID,
            user:  'anonymousUser',
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
            Carts = oldCart;
            res.send(Carts);
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
                newCart.carrito.splice(index, 1);
                newCart.total -= nuevoProducto.precio;
                newCart.cantidadTotal--;
                newCart.save();
            }
        })
        res.send(newCart);
    })
})
module.exports = router;