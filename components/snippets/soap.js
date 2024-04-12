soap.createClient(url, {}, function(err, client) {
    client.validarComprobante({xml:req.body.doc}, function(err, result) {
      console.log(result);
      if(result.RespuestaRecepcionComprobante.estado=="RECIBIDA"){
        console.log("OK")
        Authdata()
  
  
    }else {
      let data = result.RespuestaRecepcionComprobante.comprobantes.comprobante
      console.log(JSON.stringify(data))
    }
      
    
    })
  
  })