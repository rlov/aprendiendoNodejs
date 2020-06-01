const express = require('express');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const StorageMYSQL = require('express-mysql-session');
const bodyParser = require('body-parser');
const {database} = require('../lib/keys');
const SocketIO = require('socket.io');

const app = express();

//Importamos las estrategias de autenticación
require('../lib/estrategias');

//Settings
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'../views'));
app.set('view engine','ejs');


//Middleware
//Configuramos la sesión
app.use(morgan('dev'));
app.use(session({
    secret: 'redsocial1029384756',
    saveUninitialized: false,
    resave: false,
    store: new StorageMYSQL(database)
}))
app.use(flash());
app.use(express.static(path.join(__dirname,'../public')));
/* app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); */
app.use(express.urlencoded({extended : true}));
app.use(express.json());

const storage = multer.diskStorage({
    filename: (req,file,cb)=>{
        cb(null,file.originalname)
    },
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/img/portada'));
    }
})

const storagePerfil = multer.diskStorage({
    filename: (req,file,cb)=>{
        cb(null,file.originalname)
    },
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/img/perfil'));
    }
})

const storagePost = multer.diskStorage({
    filename: (req,file,cb)=>{
        cb(null,file.originalname)
    },
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/img/post'));
    }
})

app.use('/profile/:username/updatecover',multer({
    storage
}).single('image'));

app.use('/profile/:username/updateavatar',multer({
    storage: storagePerfil
}).single('image'));

app.use('/newpost',multer({
    storage: storagePost
}).single('image'));

app.use(passport.initialize());
app.use(passport.session());

//Variables globales

app.use((req,res,next)=>{
    app.locals.loginUsername = req.flash('loginUsername');
    app.locals.loginPassword = req.flash('loginPassword');
    next();
})

//Routes
app.use(require('../routes/login/index'));
app.use(require('../routes/profile/index'));
app.use(require('../routes/post/index'));
app.use(require('../routes/inicio/index'));
app.use(require('../routes/nav/index'));
//Server
const server = app.listen(app.get('port'),()=>{
    console.log(`Escuchando en el puerto ${app.get('port')}`);
})


const io = SocketIO(server);

require('../controllers/socket/index')(io);
