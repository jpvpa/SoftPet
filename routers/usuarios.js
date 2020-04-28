const express = require('express');
const router = express.Router();
const User = require('../model/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require ('../config/keys');

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
        telefono: req.body.telefono
    })
    User.addUser(newUser, (err,user)=>{
        if(err){
            res.json({success:false,msg: 'Error en registrar usuario'})
        } else{
            res.json({success:true, msg: 'Se registro el usuario exitosamente'})
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
                        telefono: user.telefono
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

module.exports = router