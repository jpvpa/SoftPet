const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cart = require('../model/Cart');
const Products = require('../model/Product');

const enCarrito = [];

<<<<<<< Updated upstream
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
=======
router.use('/generate',(req, res)=>{
    passport.authenticate("jwt", { session: false }, (error, user, userRole) => {
        var cartID = ''
        var Carts;
        var userRole;
        
        if (error) { //Si hay error cualquiera se dirige hacia la pagina inicial.
            console.log(error);
            res.redirect('/');
        } else if(user){ //Si hay un usuario
            userRole=user.correo
            cart.findOne({user: userRole}, (err, carrito) =>{ //Buscar carrito por username
                if(err || carrito == null){ //Si no hay carrito con ese username
                    err != null ? console.log(err) : console.log("No hay error");
                    if(req.cookies['cartID']){ //Existe alguna cookie en el navegador?
                        cartID = req.cookies['cartID'] + '';
                        cart.findOne({id: cartID}, (err, oldCart) =>{ //Buscar el carrito a traves de la cookie
                            if(err || oldCart == null){ //Si hay cookie pero no hay carrito creamos nueva cookie y carrito                                
                                var randomSeed = new Date();
                                cartID = randomSeed.getDay() + '-' + randomSeed.getMilliseconds();
                                res.cookie( 'cartID', cartID , { maxAge: 99999999, httpOnly: false });
                                var Carrito = new cart({
                                    id: cartID,
                                    user: userRole,
                                    carrito: [],
                                    total: 0,
                                    cantidadTotal: 0,
                                });
                                Carrito.save(function(err){
                                    if(err)
                                        console.log(err);
                                })
                                res.send(Carrito);
                            }else{
                            //Si hay cookie y tambien carrito
                                Carts = oldCart;
                                Carts.user = userRole;
                                res.send(Carts);
                            }
                        })
                    }else{
                        var randomSeed = new Date();
                        cartID = randomSeed.getDay() + '-' + randomSeed.getMilliseconds();
                        res.cookie( 'cartID', cartID , { maxAge: 99999999, httpOnly: false });
                        var Carrito = new cart({
                            id: cartID,
                            user: userRole,
                            carrito: [],
                            total: 0,
                            cantidadTotal: 0,
                        });
                        Carrito.save(function(err){
                        if(err)
                            console.log(err);
                        else
                            console.log("Cart Saved!");
                        })
                        console.log(Carrito);
                        res.send(Carrito);
                    }
                }
                //Si el carrito existe, devolvemos ese carrito
                if(carrito != null){
                    res.cookie(carrito.id);
                    res.send(carrito);
                }
            })
        } else if( req.cookies['cartID'] == null){ //Si no hay cookie ni usuario
            userRole = 'anonymousUser';
            var randomSeed = new Date();
            cartID = randomSeed.getDay() + '-' + randomSeed.getMilliseconds();
            res.cookie( 'cartID', cartID , { maxAge: 99999999, httpOnly: false });
            var Carrito = new cart({
                id: cartID,
                user: userRole,
                carrito: [],
                total: 0,
                cantidadTotal: 0,
            });
            Carrito.save(function(err){
                if(err)
                    console.log(err);
                else
                    console.log("Cart Saved!");
            })
            res.send(Carrito);
        } else //Si si hay cookie
        {
            cartID = req.cookies['cartID'] + '';
            cart.findOne({id: cartID}, (err, oldCart) =>{
                Carts = oldCart;
                res.send(Carts);
            })
        }
    })(req, res);
>>>>>>> Stashed changes
});

router.get('/add/:id', (req, res) =>{    
    passport.authenticate("jwt", { session: false }, async (error, user, userRole) => {
        cartID = req.cookies['cartID']
        reqID = req.params.id;
        var nuevoProducto;
        var userRole = user.correo;


<<<<<<< Updated upstream
    cart.findOne({id: cartID}, (err, newCart) =>{
        if(err)
            console.log(err);

        newCart.carrito.push({id: nuevoProducto.id});
        newCart.total += nuevoProducto.precio;
        newCart.cantidadTotal++;
        newCart.save();                
        res.send(newCart);
    });
=======
        if(user){
            nuevoProducto = await Products.findOne({id: reqID});
            cart.findOne({user: userRole}, (err, newCart) =>{
                if(err)
                    console.log(err);

                newCart.carrito.push({id: nuevoProducto.id, precio: nuevoProducto.precio, nombre: nuevoProducto.nombre, imagen: nuevoProducto.imagen});
                newCart.total += nuevoProducto.precio;
                newCart.cantidadTotal++;
                newCart.save();                
                console.log("newCart\n" + newCart);
                res.send(newCart);
            });
        }else if(cartID){
            nuevoProducto = await Products.findOne({id: reqID});
            
            cart.findOne({id: cartID}, (err, newCart) =>{
                if(err)
                    console.log(err);
                
                newCart.carrito.push({id: nuevoProducto.id, precio: nuevoProducto.precio, nombre: nuevoProducto.nombre, imagen: nuevoProducto.imagen});
                newCart.total += nuevoProducto.precio;
                newCart.cantidadTotal++;
                newCart.save();         
                console.log("newCart\n" + newCart)       
                res.send(newCart);
            });
        }else if(error){
            console.log("F en el shat shavales\n" + error );
        }
    })(req, res);
>>>>>>> Stashed changes
});

router.post('/remove/:id', (req, res) => {
    passport.authenticate("jwt", { session: false }, async (error, user, userRole) => {
        cartID = req.cookies['cartID']
        productID = req.params.id;
        var nuevoProducto;
        var userRole = user.correo;


<<<<<<< Updated upstream
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
=======
        if(user){
            nuevoProducto = await Products.findOne({id: productID});
            cart.findOne({user: userRole}, (err, newCart) =>{
                if(err)
                    console.log(err);
            
                newCart.carrito.some(function(product, index){
                    if(product.id == productID){
                        newCart.carrito.splice(index, 1);
                        newCart.total -= nuevoProducto.precio;
                        newCart.cantidadTotal--;
                        newCart.save();
                    }
                })
                res.send(newCart);
            });
        }else if(cartID){
            nuevoProducto = await Products.findOne({id: productID});
            
            cart.findOne({id: cartID}, (err, newCart) =>{
                if(err)
                    console.log(err);
                newCart.carrito.some(function(product, index){
                    if(product.id == productID){
                        newCart.carrito.splice(index, 1);
                        newCart.total -= nuevoProducto.precio;
                        newCart.cantidadTotal--;
                        newCart.save();
                    }
                })
                res.send(newCart)
            });
        }else if(error){
            console.log("F en el shat shavales\n" + error );
        }
    })(req, res);
>>>>>>> Stashed changes
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