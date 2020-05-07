var mongoose = require('mongoose');
const bcrypt = require ('bcryptjs');
const ObjectID = require('mongodb').ObjectID;

const User =
module.exports = 
mongoose.model( 'User', new mongoose.Schema({
    id:Number,
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    correo: String,
    contrasena: String,
    direccion: String,
    colonia: String,
    ciudad: String,
    estado: String,
    pais: String,
    cp: Number,
    telefono: Number,
    photoURL: String,
    bio: String
}), 'Users' );


module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}
module.exports.getUserByEmail = function(correo,callback){
    const query = {correo: correo};
    User.findOne(query,callback);
}
//Encrypt Password
module.exports.addUser = function(newUser,callback){
    console.log(newUser);
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.contrasena, salt, (err,hash)=>{
            if(err) throw err;
            newUser.contrasena = hash;
            newUser.save(callback);
        })
    });
}


module.exports.comparePassword = function(candidatePassword, hash,callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};
module.exports.updateProfile = function(id,callback){
    User.findOneAndUpdate({_id: id},{$set:callback},{new:true}) 
    .then((docs)=>{
        if(docs) {
           resolve({success:true,msg:docs});
        } else {
           reject({success:false,msg:"Existe ese usuario"});
        }
    }).catch((err)=>{
       reject(err);
    })
}
module.exports.recoverUser = function(req,callback){
    User.findOne({correo,callback})
}
