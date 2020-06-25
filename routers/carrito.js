const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cart = require('../model/Cart');
const Products = require('../model/Product');
const Order = require('../model/Order');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const transporter = require("../config/correo");
var hbs = require('nodemailer-express-handlebars');
transporter.use('compile', hbs({
    viewEngine: 'express-handlebars',
    viewPath:'../Views/'
}));

router.get('/generate',(req, res)=>{
    passport.authenticate("jwt", { session: false }, (error, user) => {
        var cartID = ''
        var Carts;
        console.log('-----------------generate-------------')
        //--------------------------NOT LOGGED -----------------------
        if (error || !user) {
            console.log('not logged')
            if( !req.cookies['cartAnonym'] )
            {
                var randomSeed = new Date();
                cartID = randomSeed.getDay() + '-' + randomSeed.getMilliseconds();
                res.cookie( 'cartAnonym', cartID , { maxAge: 99999999, httpOnly: false });
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
            else
            {
                cartID = req.cookies['cartAnonym'] + '';
                cart.findOne({id: cartID}, (err, oldCart) =>{
                    Carts = oldCart;
                    res.send(Carts);
                })
            }
        }
        //-------------------------- LOGGED ------------------------
        else {
            //userRole=user.correo
            console.log('logged')
            if( !req.cookies['cartUser'] )
            {
                var randomSeed = new Date();
                cartID = randomSeed.getDay() + '-' + randomSeed.getMilliseconds();
                res.cookie( 'cartUser', cartID , { maxAge: 99999999, httpOnly: false });
                var Carrito = new cart({
                    id: cartID,
                    user: user.correo,
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
            else
            {
                cartID = req.cookies['cartUser'] + '';
                cart.findOne({id: cartID}, (err, oldCart) =>{
                    Carts = oldCart;
                    res.send(Carts);
                })
            }
        }
    })(req, res);
});

router.get('/add/:id', (req, res) =>{
    passport.authenticate("jwt", { session: false }, (error, user) => {

        console.log('-----------------add-------------')
        if(error || !user){
            console.log('not logged')
            cartID = req.cookies['cartAnonym']
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
            
        }else{
            console.log('logged')
            cartID = req.cookies['cartUser']
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
        }

    })(req, res);
});

router.post('/remove/:id', (req, res) => {
    passport.authenticate("jwt", { session: false }, (error, user) => {

        console.log('-----------------remove-------------')
        if(error || !user){
            console.log('not logged')
            var cartID = req.cookies['cartAnonym']
            
        }else{
            console.log('logged')
            var cartID = req.cookies['cartUser']
        }
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

    })(req, res);
})

router.get('/checkout', (req,res)=>{
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if(err || !user){
            if(req.cookies['cartAnonym']){
                var cartID = req.cookies['cartAnonym']
                cart.findOne({id: cartID},(err,shoppingCart)=>{
                    console.log(shoppingCart.id)
                    var order = new Order({
                        cart: shoppingCart.carrito,
                        id: shoppingCart.id,
                        total: shoppingCart.total,
                        cantidadTotal: shoppingCart.cantidadTotal
                    });
                    if (shoppingCart.length){
                        console.log('already exists')
                    }else{
                        order.save({id:shoppingCart},function(err){
                            if(err)
                                console.log(err);
                            else
                                console.log("This should be saved");
                        })
                    }
                    res.send(order)
                    console.log(order)
                }) 
            }else{
                cartID = req.cookies['cartAnonym'] + '';
                Order.findOne({id: cartID}, (err, oldOrder) =>{
                    Orders = oldOrder;
                    res.send(Orders);
                })
            }
            
        }else{
            if(req.cookies['cartUser']){
                var cartID = req.cookies['cartUser']
                cart.findOne({id: cartID},(err,shoppingCart)=>{
                    
                    var order = new Order({
                        id:shoppingCart.id,
                        user: [{nombre: user.nombre, apellidoPaterno: user.apellidoPaterno,apellidoMaterno: user.apellidoMaterno, correo: user.correo}],
                        cart: shoppingCart.carrito,
                        total: shoppingCart.total,
                        cantidadTotal: shoppingCart.cantidadTotal,
                        address: [{direccion: user.direccion, colonia: user.colonia,ciudad: user.ciudad, estado: user.estado,pais: user.pais, cp: user.cp, telefono: user.telefono }]
                    });
                    if (shoppingCart.length){
                        console.log('already exists')
                    }else{
                        order.save({id:shoppingCart},function(err){
                            if(err)
                                console.log(err);
                            else
                                console.log("This should be saved");
                        })
                    }
                        
                    res.send(order)
                    console.log(order)
                }) 
            }else{

            
                cartID = req.cookies['cartUser'] + '';
                Order.findOne({id: cartID}, (err, oldOrder) =>{
                    Orders = oldOrder;
                    res.send(Orders);
                })
            } 
        }
    })(req, res);
})
router.post('/checkout', (req,res)=>{
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if(err || !user){
            var cartID = req.cookies['cartAnonym']
            var orderId = req.params._id
            Order.findOne({id:cartID}, (err,shopCart)=>{
                var anonym = req.body
                console.log(anonym)
                shopCart.user.unshift({nombre: anonym.nombre, apellidoPaterno: anonym.apellidoPaterno,apellidoMaterno: anonym.apellidoMaterno, correo: anonym.correo});
                shopCart.address.unshift({direccion: anonym.direccion, colonia: anonym.colonia,ciudad: anonym.ciudad, estado: anonym.estado,pais: anonym.pais, cp: anonym.cp, telefono: anonym.telefono });
                shopCart.payment.unshift({cNumber: anonym.cNumber, cNombre: anonym.cNombre, cCVC: anonym.cCVC, cExp: anonym.cExp});
                console.log(shopCart.payment)
                if(shopCart.payment.length > 1)
                {
                    shopCart.payment.pop();
                }
                if( shopCart.user.length > 1){
                    shopCart.user.pop();
                }
                if(shopCart.address.length > 1){
                    shopCart.address.pop();
                }
                shopCart.save()
                res.send(shopCart);
            })
        }else{
            var cartID = req.cookies['cartUser']
            var orderID = req.params._id
            Order.findOne( {id:cartID},(err,shoppingCart)=>{
                var pago = req.body
                console.log(pago)
                shoppingCart.payment.unshift({cNumber: pago.cNumber, cNombre: pago.cNombre, cCVC: pago.cCVC, cExp: pago.cExp});
                if(shoppingCart.payment.length > 1)
                {
                    shoppingCart.payment.pop();
                }
                shoppingCart.save()
                res.send(shoppingCart);
            }) 
        }
    })(req, res);
})
router.get('/order', (req,res)=>{
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if(err || !user){
            console.log('not logged')
        }else{
            Order.find({},function(error, documents) {
                if (err) throw error;
                res.send(documents);
            });
        }
    })(req, res);
})
router.post('/email',(req,res)=>{
    passport.authenticate("jwt",{session:false},(err,user)=>{
        if(err || !user){
            var cartID = req.cookies['cartAnonym']
            Order.findOne({id: cartID},(err,shoppingCart)=>{
                correo =req.params
                console.log(correo)
                console.log(shoppingCart.user[0])
                if(err) {
                    
                    res.json({success:false,msg: 'Error en enviar el correo'})
                    transporter.sendMail({
                        to: shoppingCart.user[0].correo, // list of receivers
                        subject: "Recibo de Compra", // Subject line
                        html: 'index',
                    });
                }else{
                    transporter.sendMail({
                        to: shoppingCart.user[0].correo, // list of receivers
                        subject: "Recibo de Compra", // Subject line
                        html: 'index',
                    });
                }
                //res.send(shoppingCart);
            })

        }else{
            var cartID = req.cookies['cartUser']
            Order.findOne({id:cartID},(err,shoppingCart)=>{
                console.log(shoppingCart)
                transporter.sendMail({
                    to: shoppingCart.user.correo, // list of receivers
                    subject: "Recibo de Compra", // Subject line
                    html: 'index',
                });
                res.send(shoppingCart);
            })
        }
    })(req,res);
})
router.get('/finalize',(req,res)=>{
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if(err || !user){
            console.log('not logged')
            var cartID = req.cookies['cartAnonym']
            Order.findOne({id:cartID},(err,shoppingCart)=>{
                /* var main = document.getElementById('prod');
                for(var i = 0; i < shoppingCart.cart.length; i++){
                    var email = shoppingCart.cart[i]
                    main.innerHTML += "<table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'>  <tr style='border-collapse:collapse'> <td class='es-m-p0r es-m-p20b' width='178' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;font-size:0'><a target='_blank' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#D48344'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/producto'"+email.id+"'.jpg' alt='Natural Balance L.I.D., sale 30%' class='adapt-img' title='Natural Balance L.I.D., sale 30%' width='125' style='display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic'></a></td> </tr> </table></td>  </tr> </table> <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='362' align='left' style='padding:0;Margin:0'><table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'><tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p> <table style='border-collapse:collapse;border-spacing:0px;width:100%' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0'>"+email.nombre+"</td> <td style='padding:0;Margin:0;text-align:center' width='100'>"+email.precio+"</td> </tr></table><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p></td> </tr> </table></td> </tr> </table>"
                } */
                console.log(shoppingCart)
                /* transporter.sendMail({
                    to: shoppingCart.user.correo, // list of receivers
                    subject: "Recibo de Compra", // Subject line
                    html: "<table cellpadding='0' cellspacing='0' class='es-header' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-header-body' style='border-collapse:collapse;border-spacing:0px;background-color:#ffe082' width='600' cellspacing='0' cellpadding='0' bgcolor='#ffe082' align='center'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;width: 100%;'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'> <tr style='border-collapse:collapse'> <td class='es-m-p0r' width='180' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;display:none'></td> </tr> </table></td> </tr> </table>  <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='370' align='left' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td class='es-m-p0l es-m-txt-c' align='left' style='padding:0;Margin:0;padding-left:15px;font-size:0'><a href='https://viewstripo.email/' target='_blank' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#999999'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/logito.png' alt='Petshop logo' title='Petshop logo' width='150' style='display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic'></a></td> </tr> </table></td> </tr> </table> </td> </tr> </table></td> </tr> </table> <table class='es-content' cellspacing='0' cellpadding='0' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-content-body' width='100%' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center' style='border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='560' valign='top' align='center' style='padding:0;Margin:0'> <table style='border-collapse:separate;border-spacing:0px;border-radius:0px' width='100%' cellspacing='0' cellpadding='0' role='presentation'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;padding-top:10px;padding-bottom:15px'><h1 style='Margin:0;line-height:36px;font-family:'trebuchet ms', helvetica, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#333333'>¡Gracias por ordenar con nosotros!</h1></td> </tr> </table></td> </tr> </table></td> </tr> </table></td> </tr> </table> <table class='es-content' cellspacing='0' cellpadding='0' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-content-body' width='600' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center' style='border-collapse:collapse;border-spacing:0px;background-color:#FEF9EF'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:30px'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'> <tr style='border-collapse:collapse'> <td class='es-m-p20b' width='280' align='left' style='padding:0;Margin:0'> <table style='border-collapse:separate;border-spacing:0px;background-color:#FEF9EF;border-color:#FEF9EF;border-width:1px 0px 1px 1px;border-style:solid' width='100%' cellspacing='0' cellpadding='0' bgcolor='#fef9ef' role='presentation'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-bottom:10px;padding-top:20px;padding-left:20px;padding-right:20px'><h4 style='Margin:0;line-height:120%;font-family:'trebuchet ms', helvetica, sans-serif'>Datos del usuario:</h4></td> </tr> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px'> <table style='border-collapse:collapse;border-spacing:0px;width:100%' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' align='left' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'>Orden ID:</td> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'>"+ shoppingCat.id +"</td> </tr> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'>Orden Total:</td> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'>"+shoppingCat.total +"</td> </tr> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'><br></td> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'><br></td> </tr> </table><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p></td> </tr> </table></td> </tr> </table>  <table class='es-right' cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px;float:right'> <tr style='border-collapse:collapse'> <td width='280' align='left' style='padding:0;Margin:0'> <table style='border-collapse:separate;border-spacing:0px;background-color:#FEF9EF;border-width:1px;border-style:solid;border-color:#FEF9EF' width='100%' cellspacing='0' cellpadding='0' bgcolor='#fef9ef' role='presentation'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-bottom:10px;padding-top:20px;padding-left:20px;padding-right:20px'><h4 style='Margin:0;line-height:120%;font-family:'trebuchet ms', helvetica, sans-serif'>Dirección:</h4></td> </tr> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>"+ shoppingCat.user.nombre +"</p><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>"+ address.direccion +"</p><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>"+ shoppingCat.address.pais +", "+ shoppingCat.address.estado +", "+ shoppingCat.address.ciudad +"</p></td> </tr> </table></td> </tr> </table> </td> </tr> </table></td> </tr> </table> <table class='es-content' cellspacing='0' cellpadding='0' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-content-body' width='600' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center' style='border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'> <tr style='border-collapse:collapse'> <td class='es-m-p0r es-m-p20b' width='270' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0;padding-left:20px'><h4 style='Margin:0;line-height:120%;font-family:'trebuchet ms', helvetica, sans-serif'>PRODUCTOS ORDENADOS</h4></td> </tr> </table></td> </tr> </table> <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='270' align='left' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0'> <table style='border-collapse:collapse;border-spacing:0px;width:100%' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;font-size:13px'>NOMBRE</td> <td style='padding:0;Margin:0;text-align:center;font-size:13px;line-height:13px' width='100'>PRECIO</td> </tr> </table></td> </tr> </table></td> </tr> </table> </td> </tr> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0;padding-left:20px;padding-right:20px'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='560' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;padding-bottom:10px;font-size:0'> <table width='100%' height='100%' cellspacing='0' cellpadding='0' border='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0px;border-bottom:1px solid #EFEFEF;background:#FFFFFFnone repeat scroll 0% 0%;height:1px;width:100%;margin:0px'></td> </tr> </table></td>  </tr> </table></td> </tr> </table></td> </tr> <tr style='border-collapse:collapse'> <td id='prod' align='left' style='Margin:0;padding-top:5px;padding-bottom:10px;padding-left:20px;padding-right:20px'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'>  <tr style='border-collapse:collapse'> <td class='es-m-p0r es-m-p20b' width='178' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;font-size:0'><a target='_blank' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#D48344'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/producto'"+ shoppingCat.cart.id +"'.jpg' alt='Natural Balance L.I.D., sale 30%' class='adapt-img' title='Natural Balance L.I.D., sale 30%' width='125' style='display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic'></a></td> </tr> </table></td>  </tr> </table> <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='362' align='left' style='padding:0;Margin:0'><table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'><tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p> <table style='border-collapse:collapse;border-spacing:0px;width:100%' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0'>"+ shoppingCat.cart.nombre +"</td> <td style='padding:0;Margin:0;text-align:center' width='100'>"+ shoppingCat.cart.precio +"</td> </tr></table><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p></td> </tr> </table></td> </tr> </table></td> </tr> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:5px;padding-left:20px;padding-bottom:30px;padding-right:40px'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='540' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='right' style='padding:0;Margin:0'> <table style='border-collapse:collapse;border-spacing:0px;width:500px' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' align='right' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;text-align:right;font-size:18px;line-height:27px'>Subtotal ("+ shoppingCat.cantidadTotal +" items):</td> <td style='padding:0;Margin:0;text-align:right;font-size:18px;line-height:27px'>"+shoppingCat.total +"</td> </tr> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;text-align:right;font-size:18px;line-height:27px'><strong>Orden Total:</strong></td> <td style='padding:0;Margin:0;text-align:right;font-size:18px;line-height:27px;color:#D48344'><strong>"+ total +"</strong></td> </tr> </table><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p></td> </tr> </table></td> </tr> </table></td> </tr>  </table></td> </tr> </table><table cellpadding='0' cellspacing='0' class='es-footer' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-footer-body' width='600' cellspacing='0' cellpadding='0' align='center' style='border-collapse:collapse;border-spacing:0px;background-color:#ffe082'> <tr style='border-collapse:collapse'> <td align='left' style='padding:20px;Margin:0'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'> <tr style='border-collapse:collapse'> <td class='es-m-p0r es-m-p20b' width='178' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td class='es-m-p0l es-m-txt-c' align='left' style='padding:0;Margin:0;font-size:0'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/logito.png' alt='Petshop logo' title='Petshop logo' width='150' style='display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic'></td> </tr> <tr style='border-collapse:collapse'> <td class='es-m-txt-c' align='left' style='padding:0;Margin:0;padding-bottom:5px;padding-top:10px'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>Monterrey</p><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>Nuevo Leon</p></td> </tr> <tr style='border-collapse:collapse'> <td class='es-m-txt-c' align='left' style='padding:0;Margin:0;padding-top:5px'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><a target='_blank' href='tel:123456789' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#333333'>123456789</a><br><a target='_blank'  style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#333333'>Softpet.</a></p></td> </tr> </table></td> </tr> </table> <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='362' align='left' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;display:none'></td> </tr> </table></td> </tr> </table> </td> </tr> </table></td> </tr> </table> " // html body
                }); */
                res.send(shoppingCart);
            })
            res.clearCookie('cartAnonym');
        }else{
            var cartID = req.cookies['cartUser']
            Order.findOne({id:cartID},(err,shoppingCart)=>{
                /* var main = document.getElementById('prod');
                for(var i = 0; i < shoppingCart.cart.length; i++){
                    var email = shoppingCart.cart[i]
                    main.innerHTML += "<table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'>  <tr style='border-collapse:collapse'> <td class='es-m-p0r es-m-p20b' width='178' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;font-size:0'><a target='_blank' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#D48344'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/producto'"+email.id+"'.jpg' alt='Natural Balance L.I.D., sale 30%' class='adapt-img' title='Natural Balance L.I.D., sale 30%' width='125' style='display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic'></a></td> </tr> </table></td>  </tr> </table> <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='362' align='left' style='padding:0;Margin:0'><table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'><tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p> <table style='border-collapse:collapse;border-spacing:0px;width:100%' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0'>"+email.nombre+"</td> <td style='padding:0;Margin:0;text-align:center' width='100'>"+email.precio+"</td> </tr></table><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p></td> </tr> </table></td> </tr> </table>"
                } */
                console.log(shoppingCart)
                /* transporter.sendMail({
                    to: shoppingCart.user.correo, // list of receivers
                    subject: "Recibo de Compra", // Subject line
                    html: "<table cellpadding='0' cellspacing='0' class='es-header' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-header-body' style='border-collapse:collapse;border-spacing:0px;background-color:#ffe082' width='600' cellspacing='0' cellpadding='0' bgcolor='#ffe082' align='center'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;width: 100%;'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'> <tr style='border-collapse:collapse'> <td class='es-m-p0r' width='180' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;display:none'></td> </tr> </table></td> </tr> </table>  <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='370' align='left' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td class='es-m-p0l es-m-txt-c' align='left' style='padding:0;Margin:0;padding-left:15px;font-size:0'><a href='https://viewstripo.email/' target='_blank' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#999999'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/logito.png' alt='Petshop logo' title='Petshop logo' width='150' style='display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic'></a></td> </tr> </table></td> </tr> </table> </td> </tr> </table></td> </tr> </table> <table class='es-content' cellspacing='0' cellpadding='0' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-content-body' width='100%' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center' style='border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='560' valign='top' align='center' style='padding:0;Margin:0'> <table style='border-collapse:separate;border-spacing:0px;border-radius:0px' width='100%' cellspacing='0' cellpadding='0' role='presentation'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;padding-top:10px;padding-bottom:15px'><h1 style='Margin:0;line-height:36px;font-family:'trebuchet ms', helvetica, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#333333'>¡Gracias por ordenar con nosotros!</h1></td> </tr> </table></td> </tr> </table></td> </tr> </table></td> </tr> </table> <table class='es-content' cellspacing='0' cellpadding='0' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-content-body' width='600' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center' style='border-collapse:collapse;border-spacing:0px;background-color:#FEF9EF'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:30px'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'> <tr style='border-collapse:collapse'> <td class='es-m-p20b' width='280' align='left' style='padding:0;Margin:0'> <table style='border-collapse:separate;border-spacing:0px;background-color:#FEF9EF;border-color:#FEF9EF;border-width:1px 0px 1px 1px;border-style:solid' width='100%' cellspacing='0' cellpadding='0' bgcolor='#fef9ef' role='presentation'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-bottom:10px;padding-top:20px;padding-left:20px;padding-right:20px'><h4 style='Margin:0;line-height:120%;font-family:'trebuchet ms', helvetica, sans-serif'>Datos del usuario:</h4></td> </tr> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px'> <table style='border-collapse:collapse;border-spacing:0px;width:100%' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' align='left' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'>Orden ID:</td> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'>"+ shoppingCat.id +"</td> </tr> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'>Orden Total:</td> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'>"+shoppingCat.total +"</td> </tr> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'><br></td> <td style='padding:0;Margin:0;font-size:14px;line-height:21px'><br></td> </tr> </table><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p></td> </tr> </table></td> </tr> </table>  <table class='es-right' cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px;float:right'> <tr style='border-collapse:collapse'> <td width='280' align='left' style='padding:0;Margin:0'> <table style='border-collapse:separate;border-spacing:0px;background-color:#FEF9EF;border-width:1px;border-style:solid;border-color:#FEF9EF' width='100%' cellspacing='0' cellpadding='0' bgcolor='#fef9ef' role='presentation'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-bottom:10px;padding-top:20px;padding-left:20px;padding-right:20px'><h4 style='Margin:0;line-height:120%;font-family:'trebuchet ms', helvetica, sans-serif'>Dirección:</h4></td> </tr> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>"+ shoppingCat.user.nombre +"</p><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>"+ address.direccion +"</p><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>"+ shoppingCat.address.pais +", "+ shoppingCat.address.estado +", "+ shoppingCat.address.ciudad +"</p></td> </tr> </table></td> </tr> </table> </td> </tr> </table></td> </tr> </table> <table class='es-content' cellspacing='0' cellpadding='0' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-content-body' width='600' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center' style='border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF'> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'> <tr style='border-collapse:collapse'> <td class='es-m-p0r es-m-p20b' width='270' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0;padding-left:20px'><h4 style='Margin:0;line-height:120%;font-family:'trebuchet ms', helvetica, sans-serif'>PRODUCTOS ORDENADOS</h4></td> </tr> </table></td> </tr> </table> <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='270' align='left' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0'> <table style='border-collapse:collapse;border-spacing:0px;width:100%' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;font-size:13px'>NOMBRE</td> <td style='padding:0;Margin:0;text-align:center;font-size:13px;line-height:13px' width='100'>PRECIO</td> </tr> </table></td> </tr> </table></td> </tr> </table> </td> </tr> <tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0;padding-left:20px;padding-right:20px'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='560' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;padding-bottom:10px;font-size:0'> <table width='100%' height='100%' cellspacing='0' cellpadding='0' border='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0px;border-bottom:1px solid #EFEFEF;background:#FFFFFFnone repeat scroll 0% 0%;height:1px;width:100%;margin:0px'></td> </tr> </table></td>  </tr> </table></td> </tr> </table></td> </tr> <tr style='border-collapse:collapse'> <td id='prod' align='left' style='Margin:0;padding-top:5px;padding-bottom:10px;padding-left:20px;padding-right:20px'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'>  <tr style='border-collapse:collapse'> <td class='es-m-p0r es-m-p20b' width='178' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;font-size:0'><a target='_blank' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#D48344'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/producto'"+ shoppingCat.cart.id +"'.jpg' alt='Natural Balance L.I.D., sale 30%' class='adapt-img' title='Natural Balance L.I.D., sale 30%' width='125' style='display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic'></a></td> </tr> </table></td>  </tr> </table> <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='362' align='left' style='padding:0;Margin:0'><table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'><tr style='border-collapse:collapse'> <td align='left' style='padding:0;Margin:0'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p> <table style='border-collapse:collapse;border-spacing:0px;width:100%' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0'>"+ shoppingCat.cart.nombre +"</td> <td style='padding:0;Margin:0;text-align:center' width='100'>"+ shoppingCat.cart.precio +"</td> </tr></table><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p></td> </tr> </table></td> </tr> </table></td> </tr> <tr style='border-collapse:collapse'> <td align='left' style='Margin:0;padding-top:5px;padding-left:20px;padding-bottom:30px;padding-right:40px'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='540' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='right' style='padding:0;Margin:0'> <table style='border-collapse:collapse;border-spacing:0px;width:500px' class='cke_show_border' cellspacing='1' cellpadding='1' border='0' align='right' role='presentation'> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;text-align:right;font-size:18px;line-height:27px'>Subtotal ("+ shoppingCat.cantidadTotal +" items):</td> <td style='padding:0;Margin:0;text-align:right;font-size:18px;line-height:27px'>"+shoppingCat.total +"</td> </tr> <tr style='border-collapse:collapse'> <td style='padding:0;Margin:0;text-align:right;font-size:18px;line-height:27px'><strong>Orden Total:</strong></td> <td style='padding:0;Margin:0;text-align:right;font-size:18px;line-height:27px;color:#D48344'><strong>"+ total +"</strong></td> </tr> </table><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><br></p></td> </tr> </table></td> </tr> </table></td> </tr>  </table></td> </tr> </table><table cellpadding='0' cellspacing='0' class='es-footer' align='center' style='border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0'> <table class='es-footer-body' width='600' cellspacing='0' cellpadding='0' align='center' style='border-collapse:collapse;border-spacing:0px;background-color:#ffe082'> <tr style='border-collapse:collapse'> <td align='left' style='padding:20px;Margin:0'> <table class='es-left' cellspacing='0' cellpadding='0' align='left' style='border-collapse:collapse;border-spacing:0px;float:left'> <tr style='border-collapse:collapse'> <td class='es-m-p0r es-m-p20b' width='178' valign='top' align='center' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' role='presentation' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td class='es-m-p0l es-m-txt-c' align='left' style='padding:0;Margin:0;font-size:0'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/logito.png' alt='Petshop logo' title='Petshop logo' width='150' style='display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic'></td> </tr> <tr style='border-collapse:collapse'> <td class='es-m-txt-c' align='left' style='padding:0;Margin:0;padding-bottom:5px;padding-top:10px'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>Monterrey</p><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'>Nuevo Leon</p></td> </tr> <tr style='border-collapse:collapse'> <td class='es-m-txt-c' align='left' style='padding:0;Margin:0;padding-top:5px'><p style='Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333'><a target='_blank' href='tel:123456789' style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#333333'>123456789</a><br><a target='_blank'  style='-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#333333'>Softpet.</a></p></td> </tr> </table></td> </tr> </table> <table cellspacing='0' cellpadding='0' align='right' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td width='362' align='left' style='padding:0;Margin:0'> <table width='100%' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0px'> <tr style='border-collapse:collapse'> <td align='center' style='padding:0;Margin:0;display:none'></td> </tr> </table></td> </tr> </table> </td> </tr> </table></td> </tr> </table> " // html body
                }); */
                res.send(shoppingCart);
            })
            res.clearCookie('cartUser');
        }
    })(req, res);

})

module.exports = router;
