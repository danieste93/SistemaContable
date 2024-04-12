const Counter = require("../models/counter")
const counterSchema = require("../models/counterSass")
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')


function getCounter (req, res){
const idCounter ="5eb2272dab0a7fbe1aa2a8f7"


  Counter.find({_id :idCounter},  (err, user) =>{
    if(err) return res.status(500).send({message:"error al buscar"})
  
    res.status(200).send({user: user})
  })

};

function getCounterAddCuentas (req, res){
  const idCounter ="5eb2272dab0a7fbe1aa2a8f7"
  
  
    Counter.find({_id :idCounter},  (err, count) =>{
      if(err) return res.status(500).send({message:"error al buscar"})

      res.status(200).send({Contador:count[0]})
    })
  
  };



function updateCounterCuen (req, res){
const idCounter ="5eb2272dab0a7fbe1aa2a8f7"
let update = { $inc: { Contmascuenta: 1 } }
let options = {new:true} 

  Counter.findByIdAndUpdate(idCounter, update, options, (err, counterUpdated) =>{
    if(err) return res.status(500).send({message:"error al actualizar counter"})
  
    res.status(200).send({counter: counterUpdated})
  })

};
function updateCounterRegs (req, res){
let valorInc = req.body.regupdate+1
  const idCounter ="5eb2272dab0a7fbe1aa2a8f7"
  let update = { ContRegs:valorInc  }
  let options = {new:true} 
  
    Counter.findByIdAndUpdate(idCounter, update, options, (err, counterUpdated) =>{
      if(err) return res.status(500).send({message:"error al actualizar counter"})
    
      res.status(200).send({counter: counterUpdated})
    })
  
  };
  function updateCounterCompra (req, res){
 console.log(req.body)
     let valorInc = req.body.regupdate+1
     let regInc = req.body.idReg + 1
  const idCounter ="5eb2272dab0a7fbe1aa2a8f7"
  let update = { ContCompras:valorInc, ContRegs:regInc  }
  let options = {new:true} 
  Counter.findByIdAndUpdate(idCounter, update, options, (err, counterUpdated) =>{
    if(err) return res.status(500).send({message:"error al actualizar counter"})
  
    res.status(200).send({counter: counterUpdated})
  })
      
  
      };

  function updateCounterRegsyVenta (req, res){
    let valorInc = req.body.regupdate+1
      const idCounter ="5eb2272dab0a7fbe1aa2a8f7"
      let update = { ContRegs:valorInc,  $inc: { ContVentas: 1 }  }
      let options = {new:true} 
      
        Counter.findByIdAndUpdate(idCounter, update, options, (err, counterUpdated) =>{
          if(err) return res.status(500).send({message:"error al actualizar counter"})
        
          res.status(200).send({counter: counterUpdated})
        })
      
      };
      function updateCounterVenta (req, res){
     
          const idCounter ="5eb2272dab0a7fbe1aa2a8f7"
          let update = {  $inc: { ContVentas: 1 }  }
          let options = {new:true} 
          
            Counter.findByIdAndUpdate(idCounter, update, options, (err, counterUpdated) =>{
              if(err) return res.status(500).send({message:"error al actualizar counter"})
            
              res.status(200).send({counter: counterUpdated})
            })
          
          };
  
  
  function updateCounterRep (req, res){

    console.log("funcando dentro de counter")
  const idCounter ="5eb2272dab0a7fbe1aa2a8f7"
  let update = { $inc: { ContadorRep: 1 } }
  let options = {new:true} 
  console.log(update)
    Counter.findByIdAndUpdate(idCounter, update, options, (err, counterUpdated) =>{
      if(err) return res.status(500).send({message:"error al actualizar counter"})
    
      res.status(200).send({counter: counterUpdated})
    })
  
  };

  function updateCounterCompraIndividual (req, res){
    console.log(req.body)
        let valorInc = req.body.regupdate+1
        let regInc = req.body.idReg + 1
        let artInc  = req.body.Eqid + 1
     const idCounter ="5eb2272dab0a7fbe1aa2a8f7"
     let update = { ContCompras:valorInc, ContRegs:regInc, ContArticulos:artInc  }
     let options = {new:true} 
     Counter.findByIdAndUpdate(idCounter, update, options, (err, counterUpdated) =>{
       if(err) return res.status(500).send({message:"error al actualizar counter"})
     
       res.status(200).send({counter: counterUpdated})
     })
         
         };

         
async function getAllCounters (req, res){

  const token = req.headers["x-access-token"]
  if(!token){
    res.status(401).send({status: "error", message: "sin token"});
  }
  try {

  const decode = jwt.verify(token, req.app.get('secretKey') )
  }
  catch(err){
    console.log(err)
    res.status(401).send({status: "error", message: "error al decodificar el token"});
  }
  
  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let contadoresHabiles = await CounterModelSass.find({iDgeneral:9999999})
  res.status(200).send({status: "Ok", message: "maindata", cont:contadoresHabiles[0]});
  };

module.exports = {getAllCounters,updateCounterCompraIndividual,updateCounterCompra, updateCounterVenta,updateCounterRegsyVenta, getCounter, updateCounterCuen,updateCounterRep,getCounterAddCuentas,updateCounterRegs};