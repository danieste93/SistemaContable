// cargamos express e iniciamos una aplicación
const express = require('express');
const path = require('path');
const url = require('url');
const app = require('express')()



// creamos un servidor HTTP desde de nuestra aplicación de Express

// creamos una aplicación de socket.io desde nuestro servidor HTTP

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


  //base de datos 
  const CONNECTION_Test = process.env.REACT_DATA_BASE
  mongoose.connect(CONNECTION_Test,  { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) =>{
    if (err) {
      console.log("Error conectando a la base de datos:", err.message);
    } else {
      console.log("coneccion a la base datos funcionando");
    }
})

 app.listen(port, '0.0.0.0', (err) => {
  // si ocurre un error matamos el proceso
  if (err) process.exit(0)
  // si todo está bien dejamos un log en consola
  console.log(`Escuchando en el puerto ${port}`)
})
})
	// iniciamos el servidor HTTP en el puerto 3000
