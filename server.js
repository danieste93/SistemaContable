// cargamos express e iniciamos una aplicación
const express = require('express');
const path = require('path');
const url = require('url');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// creamos un servidor HTTP desde de nuestra aplicación de Express
const server = http.createServer(app);

// creamos una aplicación de socket.io desde nuestro servidor HTTP
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://sistemacontable-436626443349.us-central1.run.app"],
    methods: ["GET", "POST"]
  }
});

// cargamos Next.js
const next = require('next')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000;
// verificamos si estamos corriendo en desarrollo o producción
const dev = process.env.NODE_ENV !== 'production'
// iniciamos nuestra aplicación de Next.js
const nextApp = next({ dev })
// obtenemos el manejador de Next.js
const nextHandler = nextApp.getRequestHandler()

require("dotenv").config();


// cuando un usuario se conecte al servidor de sockets


// iniciamos nuestra aplicación de Next.js
nextApp.prepare().then(() => {
  const sslRedirect = require('heroku-ssl-redirect').default;

  app.use(sslRedirect());

  app.set('secretKey', 'CerdadInfinita'); // Clave Secreta para nuestro JWT
  app.use(bodyParser.json({limit: '10mb', extended: true}))
  app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

  app.use(cors())
	

  // para cualquier otra ruta de la aplicación


  app.use('/users',  require('./routes/users'))
  app.use('/cuentas',  require('./routes/cuentas'))
  app.use('/public',  require('./routes/public'))
  
   app.use('/api',  require('./routes/api'))
  // app.use('/api/sri', require('./routes/sri'));
  app.use('/correo',  require('./routes/correos'))
  //app.use(  require('./routes/webpush'))

  app.use('/static', express.static(path.join(__dirname, 'static'), {
    maxAge: dev ? '0' : '365d'
  }));

    // Example server-side routing
    app.get('/a', (req, res) => {
      res.status(200).send({"message":"exito"})
   
    })

    app.get('*', (req, res) => {
      const parsedUrl = url.parse(req.url, true);
  
      nextHandler(req, res, parsedUrl);
    })

  // Hacer io disponible globalmente para los controladores
  app.set('io', io);

  // Configuración de WebSockets para sincronización en tiempo real
  io.on('connection', (socket) => {
    console.log('📡 Usuario conectado via WebSocket:', socket.id);
    
    // Cuando un usuario se une a su sala personal
    socket.on('join-user', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`👤 Usuario ${userId} unido a sala WebSocket (socket: ${socket.id})`);
      console.log(`👥 Salas activas para user-${userId}:`, io.sockets.adapter.rooms.get(`user-${userId}`)?.size || 0, 'conexiones');
    });
    
    // Cuando hay cambios de datos que deben sincronizarse
    socket.on('data-changed', (data) => {
      console.log(`🔄 Sincronizando datos para usuario ${data.userId}:`, data.action);
      const roomSize = io.sockets.adapter.rooms.get(`user-${data.userId}`)?.size || 0;
      console.log(`📤 Enviando a ${roomSize} conexiones en sala user-${data.userId}`);
      socket.to(`user-${data.userId}`).emit('sync-data', data);
    });
    
    // Cuando un usuario se desconecta
    socket.on('disconnect', () => {
      console.log('📡 Usuario desconectado via WebSocket:', socket.id);
    });
  });

  //base de datos 
  const CONNECTION_Test = process.env.REACT_DATA_BASE
  mongoose.connect(CONNECTION_Test,  { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) =>{
    if (err) {
      console.log("Error conectando a la base de datos:", err.message);
    } else {
      console.log("coneccion a la base datos funcionando");
    }
})

 server.listen(port, '0.0.0.0', (err) => {
  // si ocurre un error matamos el proceso
  if (err) process.exit(0)
  // si todo está bien dejamos un log en consola
  console.log(`Escuchando en el puerto ${port}`)
})
})
	// iniciamos el servidor HTTP en el puerto 3000
