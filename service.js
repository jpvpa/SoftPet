const express = require ('express');
const BodyParser = require ('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const multer  = require('multer')
const cookieParser = require ('cookie-parser');

const app = express(); //initilize variable with express
const cors = require('cors');
app.use(BodyParser.urlencoded({extended:true}));
app.use(BodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true, 
    origin: 'http://localhost:4200'
}))

mongoose.connect('mongodb://localhost:27017/SoftPet', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
},(error) =>{
    if(error){
        console.log('Error al conectarse a la base de datos');
        console.log(error);
    }else{
        console.log('Se ha conectado a la base de datos satisfactoriamente ');
        console.log('Conectado en el server: '+mongoose.connection.host);
        console.log('Conectado en el puerto: '+mongoose.connection.port);
    }
});

//Index Route
app.get('/', (re,res)=>{
    res.send('Invalid Endpoint')
})
//Set Static Folder
var _dirname = path.resolve();
app.use(express.static(path.join(_dirname,'client')));
//Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session()); 
require('./config/passport')(passport);



//Endpoint
var endpointUser = require('./routers/usuarios')
var endpointProduct = require('./routers/productos')
var endpointCart = require('./routers/carrito')
app.use( endpointUser);
app.use('/product', endpointProduct);
app.use('/cart', endpointCart);

app.listen(2020);