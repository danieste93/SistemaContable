const nodemailer = require('nodemailer');


const solicitudllamada = (req, res) =>{
  
 console.log(solicitudllamada)

 res.status(200).send({mesaje:"contactoo"})

 const datoscliente = req.body
 const datosjason = JSON.stringify(datoscliente)
 var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    
          user: 'iglassmailer2020@gmail.com',
          pass: process.env.REACT_MAILER_PASS,
     

  }
})
 var mailOptions = {
   from: 'iglassmailer2020@gmail.com',
   to: 'iglassphone@gmail.com',
   subject: 'Solicitud de contacto ',
   text: datosjason,
 }

 transporter.sendMail(mailOptions, function (err, res) {
   if(err){
       console.log(err);
   } else {
       console.log('Email Sent');
   }
})

 


}
const newsolicitudllamada = (req, res) =>{
  
  console.log(req.body)
 

 
  const datoscliente = req.body
  const datosjason = JSON.stringify(datoscliente)
 
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      
            user: 'iglassmailer2020@gmail.com',
            pass: process.env.REACT_MAILER_PASS,
       
  
    }
  })
  var mailOptions = {
    from: 'iglassmailer2020@gmail.com',
    to: req.body.cuentadestino,
    subject: 'Solicitud de contacto ',
    text: datosjason,
  }
 
  transporter.sendMail(mailOptions, function (err, mailresponse) {
    if(err){
        console.log(err);
    } else {
        console.log('Email Sent');
        res.status(200).send({status: "Ok", message: "exito en el envio"});
    }
 })
 
  
 
 
 }
const repuestoSolicitado = (req, res) =>{
  

  
  const datoscliente = req.body
  const datosjason = JSON.stringify(datoscliente)
 
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        
              user: 'iglassmailer2020@gmail.com',
              pass: 'NewiGlass+-2021EC',
         
  
      }
  })

  var transporterC = nodemailer.createTransport({
    service: 'gmail',
    auth: {
            
      user: 'iglassmailer2020@gmail.com',
      pass: process.env.REACT_MAILER_PASS,
 

}
})
  var mailOptions = {
    from: 'iglassmailer2020@gmail.com',
    to: 'iglassphone@gmail.com',
    subject: 'RepuestoSolicitado ',
    text: datosjason,
  }


  var mailOptionsCliente = {
    from: 'iglassmailer2020@gmail.com',
    to: req.body.Correo,
    subject: 'Solicitud de repuesto',
    text: "Su solicitud esta en proceso, nos pondremos en contacto lo antes posible",
  }

 
  transporter.sendMail(mailOptions, function (err, res) {
    if(err){
        console.log(err);
   
    } else {
        console.log('Email Sent');
     
    }
 })
 
 transporterC.sendMail(mailOptionsCliente, function (err, res) {
  if(err){
    console.log(err);

} else {
    console.log('Email Sent');

}
})
 
res.status(200).send({mesaje:"exito admin"})
 }

 const compraSolicitada = (req, res) =>{
  

 
  res.status(200).send({mesaje:"compra Solicitada"})
 
  const datoscliente = req.body
  const datosjason = JSON.stringify(datoscliente)
 
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        
              user: 'iglassmailer2020@gmail.com',
              pass: 'NewiGlass+-2021EC',
         
  
      }
  })
  var transporterC = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      
            user: 'iglassmailer2020@gmail.com',
            pass: 'NewiGlass+-2021EC',
       

    }
})
  var mailOptions = {
    from: 'iglassmailer2020@gmail.com',
    to: 'iglassphone@gmail.com',
    subject: 'Compra Solicitada ',
    text: datosjason,
  }

  var mailOptionsCliente = {
    from: 'iglassmailer2020@gmail.com',
    to: req.body.Correo,
    subject: 'Gracias por comprar en iGlass',
    text: "Gracias por su compra, nos pondremos en contacto lo antes posible para ",
  }
 
  transporter.sendMail(mailOptions, function (err, res) {
    if(err){
        console.log(err);
    } else {
        console.log('Email Sent');
    }
 })

  transporterC.sendMail(mailOptionsCliente, function (err, res) {
    if(err){
        console.log(err);
    } else {
        console.log('Email Sent');
    }
 })
 
  
 
 
 }

const sendTransfer = (req, res) =>{
  
   
    const datoscliente = req.body




    
    const datosjason = JSON.stringify(datoscliente)

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              
                    user: 'iglassmailer2020@gmail.com',
                    pass: 'NewiGlass+-2021EC',
               
        
            }
        })

        var mailOptions;

        if(req.files.length > 0){
          var attachmentsFiles=[];
          for (var i=0; i<req.files.length;i++){
            attachmentsFiles.push({path:req.files[i].path})
          }
         
          mailOptions = {
            from: 'iglassmailer2020@gmail.com',
            to: req.body.DireccionMail,
            subject: 'Comprobante de transferencia',
            text: datosjason,
            attachments: attachmentsFiles
           
        }
        } else{
          mailOptions = {
            from: 'iglassmailer2020@gmail.com',
            to: req.body.DireccionMail,
            subject: 'Comprobante de transferencia',
            text: datosjason
           
        }

        }

        transporter.sendMail(mailOptions, function (err, res) {
          if(err){
              console.log(err);
          } else {
              console.log('Email Sent');
          }
      })


}

const updateAdminOrder=(req, res)=>{
  res.status(200).send({repuestos:"mensaje recibido"})
  console.log(req.body)

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      
            user: 'iglassmailer2020@gmail.com',
            pass: 'NewiGlass+-2021EC',
       

    }
})
let subjectsting = `Actualización de estado de carrito de  compras Nº ${req.body.carrito}`
let textsting = req.body.estado ==="No-pagado"? `El estado de su carrito de compras Nº ${req.body.carrito} es inpago, porfavor continue el proceso.`:
                req.body.estado ==="Pagado"?`Se ha recibido el pago por de su carrito de compras Nº ${req.body.carrito}, se procedera con el envío o reservación.`:   
                req.body.estado ==="Revision-de-pago"?`El pago por su carrito de compras Nº ${req.body.carrito} se encuentra en revición, porfavor espere.`:  
                req.body.estado ==="Concluido"?`La compra de su carrito Nº ${req.body.carrito} ha sido concluida, estamos pendientes ante cualquier problema, un gusto servirle.`:  
                ""

let mailOptions = {
  from: 'iglassmailer2020@gmail.com',
  to: req.body.DireccionMail,
  subject: subjectsting,
  text: textsting,

}

transporter.sendMail(mailOptions, function (err, res) {
  if(err){
      console.log(err);
  } else {
      console.log('Email Sent');
      res.status(200).send({repuestos:"mensaje recibido"})
  }
})
}

const updateAdminRep=(req, res)=>{
  res.status(200).send({repuestos:"mensaje recibido"})
  console.log(req.body)

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      
            user: 'iglassmailer2020@gmail.com',
            pass: 'NewiGlass+-2021EC',
       

    }
})
let subjectsting = `Actualización de estado de tu solicitud Nº ${req.body.Solicitud}`
let textsting = req.body.estado ==="Disponible"? `El estado de  tu solicitud Nº ${req.body.Solicitud}, se encuentra disponible. Comunícate para agendar una cita y reservar tu repuesto.`:
                req.body.estado ==="No-disponible"?`Tu solicitud Nº  ${req.body.Solicitud} no se encuentra disponible por el momento, te avisaremos al adquirir disponibilidad.`: 
                req.body.estado ==="Revicion-rep"?`Tu solicitud Nº  ${req.body.Solicitud} esta volviendo a ser revisada.` :
                ""
               

let mailOptions = {
  from: 'iglassmailer2020@gmail.com',
  to: req.body.mail,
  subject: subjectsting,
  text: textsting,

}

transporter.sendMail(mailOptions, function (err, res) {
  if(err){
      console.log(err);
  } else {
      console.log('Email Sent');
  }
})
}

const sendIssue=(req, res)=>{
  res.status(200).send({repuestos:"queja recibido"})
  console.log(req.body)

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      
            user: 'iglassmailer2020@gmail.com',
            pass: 'NewiGlass+-2021EC',
       

    }
})
let subjectsting = `queja del cliente, Carrito Nº${req.body.CarritoNumero}`;
let textsting = req.body.Queja +" // "+ req.body.Mail+ " // " + req.body.Nombre

let mailOptions = {
  from: 'iglassmailer2020@gmail.com',
  to: "iglassphone@gmail.com",
  subject: subjectsting,
  text: textsting,

}

transporter.sendMail(mailOptions, function (err, res) {
  if(err){
      console.log(err);
  } else {
      console.log('Email Sent');
  }
})
}



const sendValidation=(req, res)=>{
  res.status(200).send({repuestos:"veriticacion enviada"})
  console.log(req.body)

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      
            user: 'iglassmailer2020@gmail.com',
            pass: 'NewiGlass+-2021EC',
       

    }
})

let subjectsting = `Verificacion de cuenta de usuario ${req.body.Usuario}`;
let textsting =
`<p>Su registro a iGlass fue exitoso</p> <p>para verificar su cuenta  <a href="https://iglass4.herokuapp.com/usuarios/verificacion/${req.body._id}">CLICK AQUÍ</a></p>`
  
let textstingdev =
`<p>Su registro a iGlass fue exitoso</p> <p>para verificar su cuenta  <a href="http://localhost:3000/usuarios/verificacion/${req.body._id}">CLICK AQUÍ</a></p>`
  


let mailOptions = {
  from: 'iglassmailer2020@gmail.com',
  to: req.body.Email,
  subject: subjectsting,
  html: textsting,

}

transporter.sendMail(mailOptions, function (err, res) {
  if(err){
      console.log(err);
  } else {
      console.log('Email Sent');
  }
})


}


  module.exports = {newsolicitudllamada, sendTransfer,updateAdminOrder, updateAdminRep ,sendIssue, sendValidation, solicitudllamada, repuestoSolicitado,compraSolicitada};