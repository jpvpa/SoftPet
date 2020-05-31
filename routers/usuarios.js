const express = require('express');
const router = express.Router();
const User = require('../model/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require ('../config/keys');
const transporter = require("../config/correo");

router.post('/register', (req,res,next) => {
    let newUser = new User({
        nombre: req.body.nombre,
        apellidoPaterno: req.body.apellidoPaterno,
        apellidoMaterno: req.body.apellidoMaterno,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        direccion: req.body.direccion,
        colonia: req.body.colonia,
        ciudad: req.body.ciudad,
        estado: req.body.estado,
        pais: req.body.pais,
        cp: req.body.cp,
        telefono: req.body.telefono,
        bio: req.body.bio
    });
    User.addUser(newUser, (err,user)=>{
        if(err){
            res.json({success:false,msg: 'Error en registrar usuario'})
        } else{
            res.json({success:true, msg: 'Se registro el usuario exitosamente'});
            transporter.sendMail({
                to: newUser.correo, // list of receivers
                subject: "Verifica tu cuenta", // Subject line
                html: "<main><div style = ' background-color: #ffe082; width: 100%; height: 5rem; padding: 0; margin: 0; text-align: center;'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/logito.png' alt='Softpet-logo' style=' width: 12rem; height: 5rem;'></div><div style = 'display: table; text-align: center; width: 100%;'><div style='display:table-cell; text-align: center; font-size: large;'><h3><b><i>Hola, " + newUser.nombre + " </h3></i></b><p>Muchas gracias por integrarte a la familia SoftPet!</p><p>Por favor, verifica tu cuenta para continuar:</p><a href='http://localhost:4200/home' style = 'box-shadow:inset 0px 39px 0px -24px #e67a73;background:linear-gradient(to bottom, #e4685d 5%, #FF3300 100%);background-color:#e4685d;border-radius:10px;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:10px 20px;text-decoration:none;text-shadow:0px 1px 0px #b23e35;'>Verificar mi cuenta</a></div></div></main>" // html body
                });
        }
    });
});

router.post('/auth', (req,res,next) =>{
    const correo = req.body.correo; //get user password that has been submitted
    const contrasena = req.body.contrasena;
    //see if user email exists
    User.getUserByEmail(correo, (err,user) =>{ 
        if (err) throw err;
        if(!user){
            return res.json({success:false,msg: 'Correo no encontrado'});
        }
        //then if it exists, matches the password 
        User.comparePassword(contrasena, user.contrasena, (err,isMatch) => {
            if(err) throw err;//pass user type...hash....
            if(isMatch){
                const token = jwt.sign({data: user}, config.secret, { //if user hasnt logged out, email will be logged for a week
                    expiresIn: 604800 //1 week
                }); //send this response
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user:{
                        id:user._id,
                        nombre: user.nombre,
                        apellidoPaterno: user.apellidoPaterno,
                        apellidoMaterno: user.apellidoMaterno,
                        correo: user.correo,
                        contrasena: user.contrasena,
                        direccion: user.direccion,
                        colonia: user.colonia,
                        ciudad: user.ciudad,
                        estado: user.estado,
                        pais: user.pais,
                        cp: user.cp,
                        telefono: user.telefono,
                        bio: user.bio,
                        role:user.role
                    }
                });
            } else{ //if it doesnt match send this response
                return res.json({success: false, msg: 'Contraseña incorrecta'})
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session: false}),(req,res,next)=>{
    res.json({user: req.user})
})


router.put('/updateProfile', passport.authenticate('jwt', {session: false}),(req,res,next)=>{
    User.updateProfile(req.user._id, req.body)
})
/* router.put('/edit',(req,res,next)=>{
    
    var id = req.product._id;
    var callback = req.body
    Product.findOneAndUpdate({_id: id},{$set:callback},{new:true})
    
}) */

router.put('/recover-password',(req,res) => {
    User.recoverPassword(req.user._id, req.body.contrasena)
})

router.post('/forgot-password/:_id', (req,res,next) => {
    
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;
    console.log(correo);
    
    User.getUserByEmail(correo, (err,user) =>{ 
        if (err) throw err;
        console.log(correo)
        if(!user){
            return res.json({success:false,msg: 'Correo no encontrado'});
        }else{
        res.json({success:true, msg: 'Se envio un correo'});
        transporter.sendMail({
            to: correo, // list of receivers
            subject: "Recupera tu cuenta", // Subject line
            html: "<main><div style = ' background-color: #ffe082; width: 100%; height: 5rem; padding: 0; margin: 0; text-align: center;'><img src='https://raw.githubusercontent.com/jpvpa/SoftPet/master/ASoftPet/src/assets/images/logito.png' alt='Softpet-logo' style=' width: 12rem; height: 5rem;'></div><div style = 'display: table; text-align: center; width: 100%;'><div style='display:table-cell; text-align: center; font-size: large;'><h3><b><i>Hola, " + correo + " </h3></i></b><p>Para recuperar tu cuenta</p><p>por favor, persiona el boton recuperar mi cuenta para continuar:</p><a href='http://localhost:4200/recover-pass?_id=correo style = 'box-shadow:inset 0px 39px 0px -24px #e67a73;background:linear-gradient(to bottom, #e4685d 5%, #FF3300 100%);background-color:#e4685d;border-radius:10px;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:10px 20px;text-decoration:none;text-shadow:0px 1px 0px #b23e35;'>Recuperar mi cuenta</a></div></div></main>" // html body
            });
        }
    })
    
})


module.exports = router