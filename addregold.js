if(req.body.Accion === "Ingreso" || req.body.Accion === "Gasto"){

      if(req.body.TipoRep =="No"){
      
      
        const session = await mongoose.startSession();  
        
        session.startTransaction();

        try {
          const opts2 = { session, new:true };
          const opts = { session};
          let update 
          if(req.body.Accion === "Ingreso"){
            update = { $inc: { DineroActual: fixedImport } }
           }else if(req.body.Accion === "Gasto"){
             let valornegativo = fixedImport * (-1)
             update = { $inc: { DineroActual: valornegativo } }
           }
          const Cuentadata = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect._id, update,opts2)
          if(Cuentadata == null ){
            throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
          } 
         
         
          let datareg= { Accion:req.body.Accion,   
            Tiempo:req.body.Tiempo,
            IdRegistro:req.body.iDReg,
          
            CuentaSelec:{idCuenta:req.body.CuentaSelect._id,
                         nombreCuenta: req.body.CuentaSelect.NombreC,
                         valorCambiar: req.body.CuentaSelect.DineroActual},
          
            CatSelect:{nombreCat:req.body.CatSelect.nombreCat,
                      subCatSelect:req.body.SubCatSelect},
                           
            Nota:req.body.Nota,
            Descripcion:req.body.Descripcion,
            Estado:true,
            urlImg:req.body.urlImg,
            Valrep:req.body.Valrep,
            TipoRep:req.body.TipoRep,
            Importe:fixedImport,
            Usuario:{
              Nombre:req.body.Usuario.Usuario,
              Id:req.body.Usuario._id,
              Tipo:req.body.Usuario.Tipo,
          
            },
          
          }
      
          const regCreate = await RegModelSass.create([datareg], opts)
          
          let updatecounter = { $inc: { ContRegs: 1 } }
          let idDataReg = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,opts2 )
         
          await session.commitTransaction();
            session.endSession();
          return res.json({status: "Ok", message: "Exito registroIngGas individual", regCreate, idreg:idDataReg,cuenta:Cuentadata});
       
     
        }
        catch(error){
          console.log(error)
          await session.abortTransaction();
          session.endSession();
          return res.json({status: "Error", message: "error al registrar", error });
        }

          }//fin reg ING GAS 

             else if(req.body.TipoRep == "Repetir"){
              console.log("en repeticion")
          let tiempoActual = new Date()
          let yearCurrent = tiempoActual.getFullYear()
          let yearRegister = new Date(req.body.Tiempo).getFullYear() 
          const registroFuturo = async ()=>{
            let fechaeje = 0
     
            let fechabase = new Date(req.body.Tiempo)
         
            let sethorames =new Date(fechabase).setHours(0,0,0)
            fechaeje = sethorames


         await  RepeticionModelSass.create({
              reg: {
                Accion:req.body.Accion,   
                Tiempo:req.body.Tiempo,
               
                CuentaSelec:{idCuenta:req.body.CuentaSelect._id,
                  nombreCuenta: req.body.CuentaSelect.NombreC,
                  valorCambiar: req.body.CuentaSelect.DineroActual},

                  CatSelect:{nombreCat:req.body.CatSelect.nombreCat,
                    subCatSelect:req.body.SubCatSelect},
                       
                Nota:req.body.Nota,
                Descripcion:req.body.Descripcion,
               
                urlImg:req.body.urlImg,
                Valrep:req.body.Valrep,
                TipoRep:req.body.TipoRep,
                Importe:fixedImport,
                Usuario:{
                  Nombre:req.body.Usuario.Usuario,
                  Id:req.body.Usuario._id,
                  Tipo:req.body.Usuario.Tipo,
          
                }
            
          
            },
              fechaEjecucion: fechaeje

             },(err, resultrep)=>{
              if(err) res.status(500).send({"message":"error al generar repeticion"})
              res.send({status: "Ok", message: "repeticion futura creada",  resultrep });

             })
          }
          if( yearRegister <= yearCurrent  ){
       
            let mes = new Date(req.body.Tiempo).getMonth()
            let mesActual = new Date().getMonth()
                  if(mes <= mesActual){
                
            
                    try {
                    
                  let fechaeje = 0
                                                   
                  let fechaRep = new Date()
                
                  if(req.body.Valrep == "Cada Semana" || req.body.Valrep == "Cada Mes"){
                
                   let setmes = fechaRep.setMonth(mesActual + 1)
                 

                  let sethora =new Date(setmes).setHours(0,0,0)
                                 

                  fechaeje = sethora
                  }else if(  req.body.Valrep ==="Cada Día" ){
     
                    let setmes = fechaRep.setMonth(mesActual + 1)
                 

                    let sethora =new Date(setmes).setHours(0,0,0)
                    let setdia = new Date(sethora).setDate(1)
                                   

                    fechaeje = setdia
                  } 
                  else if(req.body.Valrep == "Cada Año" ){
              
                   let setyear = fechaRep.setFullYear(fechaRep.getFullYear() + 1)
                  
                  let sethora =new Date(setyear).setHours(0,0,0)
                  fechaeje = sethora
                  }
                
                    const resultrep = await  RepeticionModelSass.create([{
                      reg: {
                        Accion:req.body.Accion,   
                        Tiempo:req.body.Tiempo,
                        CuentaSelec:{idCuenta:req.body.CuentaSelect._id,
                          nombreCuenta: req.body.CuentaSelect.NombreC,
                          valorCambiar: req.body.CuentaSelect.DineroActual},
       
                          CatSelect:{nombreCat:req.body.CatSelect.nombreCat,
                            subCatSelect:req.body.SubCatSelect},
            
                       
                        Nota:req.body.Nota,
                        Descripcion:req.body.Descripcion,
                       
                        urlImg:req.body.urlImg,
                        Valrep:req.body.Valrep,
                        TipoRep:req.body.TipoRep,
                        Importe:fixedImport,
                        Usuario:{
                          Nombre:req.body.Usuario.Usuario,
                          Id:req.body.Usuario._id,
                          Tipo:req.body.Usuario.Tipo,
                  
                        }
                    
                  
                    },
                      fechaEjecucion: fechaeje
  
                     }], {session})  

                     let mesesExtra = (mesActual - mes) + 1
                    let fechacambio = new Date(req.body.Tiempo)
                    let  cantidadRegistros = 0 
                      if(req.body.Valrep ==="Cada Día"){      
                   
                            if(mes < mesActual){
                              let fechaconver = new Date(req.body.Tiempo)
                     
                              for(let x=0;x<mesesExtra;x++){                    
                                              
                                if(x > 0){
                              
                                  let fechapormodi = fechaconver.setMonth(fechaconver.getMonth() + x )
                                  let fechamodi = new Date(fechapormodi).setDate(1)
                            
                            let dateFechamodi = new Date(fechamodi)
                                  var ultimoDia = new Date(dateFechamodi.getFullYear(), dateFechamodi.getMonth() + 1, 0)
                                  let diaActual = dateFechamodi.getDate() 
                                  let Diasestemes = ultimoDia.getDate()  - diaActual
                               
                                  cantidadRegistros += Diasestemes+1
                                }else{
                                  var ultimoDia = new Date(fechaconver.getFullYear(), fechaconver.getMonth() + 1, 0)
                                  let diaActual = fechaconver.getDate() 
        
                                  let Diasestemes = ultimoDia.getDate() - diaActual
                               
                                  cantidadRegistros += Diasestemes+1
                              
        
                                }
                                console.log(cantidadRegistros)
                              }
                            }else{
                      
                              var ultimoDia = new Date(fechacambio.getFullYear(), fechacambio.getMonth() + 1, 0)
                              let cantidadDias = ultimoDia.getDate() - fechacambio.getDate()
                              let cantidadDiasFor = cantidadDias + 1
                                  cantidadRegistros = cantidadDiasFor
                            }

                     
                      }
                      else if(req.body.Valrep == "Cada Semana"){
                        if(mes < mesActual){
                          throw Error("Sin soporte");
                        }
                        else{
                          let fechafind = new Date(req.body.Tiempo)
                          var year=fechafind.getFullYear();
                          var mesdeSem= fechafind.getMonth() + 1;
                          var dia= fechafind.getDate()
                          var cantidadDias = new Date(year, mesdeSem, 0).getDate()
   
                          var diasrestantes = (cantidadDias- dia) + 1
                      
                          var repeticion = Math.ceil(diasrestantes/7)
    
                          cantidadRegistros= repeticion}
                      }
                      else if(req.body.Valrep == "Cada Mes"){
    
                      
                      
                        cantidadRegistros= ( mesesExtra )
  
                      }
                      else if(req.body.Valrep == "Cada Año"){
                        if(yearRegister < yearCurrent){
                          throw Error("Sin soporte");
                        }else{
                        cantidadRegistros= 1
                        }
                      }
                
             
                   console.log(cantidadRegistros,"cantidadRegs") 
                      for(let i = 0; i < cantidadRegistros; i++){

               
                        let ids = req.body.iDReg + i
                        let fechaset = new Date(req.body.Tiempo).getTime()  
                    
                        if(i >0){
                          const  fechafija = new Date(req.body.Tiempo)
                          if(req.body.Valrep ==="Cada Día"){  
                       
                            let nuevodia = fechafija.getDate() + i  
                         
                            if(mes <= mesActual){
                          
                              let getval =   new Date(req.body.Tiempo).setDate(nuevodia)   
                                fechaset= new Date(getval).getTime()   
                              console.log(getval)
                            }else{
                          
                              fechafija.setDate(nuevodia)   
                              fechaset= new Date(fechacambio).getTime() 
                            }

                         
                                                    
                        }
                        else if(req.body.Valrep == "Cada Semana"){
                          let nuevodiasem = fechafija.getDate() + (7*i)  
                          fechacambio.setDate(nuevodiasem)   
                          fechaset= new Date(fechacambio).getTime() 
  
                        } else if(req.body.Valrep == "Cada Mes"){
                       
                  
                          let nuevomes = fechafija.getMonth() + i                            
                          fechacambio.setMonth(nuevomes)   
                          fechaset= new Date(fechacambio).getTime() 
                      
  
                        }
                                            
  
                        }
                       
                     
                     
                      let update =""
                      let options = {new:true, session} 
                      
                      if(req.body.Accion === "Ingreso"){
                        update = { $inc: { DineroActual: fixedImport } }
                       
                      }
                      else if(req.body.Accion === "Gasto"){
                       let valornegativo = fixedImport * (-1)
                    
                     update = { $inc: { DineroActual: valornegativo } }
                      }    
                      const cuentaUpdate = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect._id, update, options)
                      
                      if(cuentaUpdate == null ){
                        throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
                      } 
                      const resultreg = await  RegModelSass.create([
                        { Accion:req.body.Accion,   
                        Tiempo:fechaset,
                        IdRegistro:ids,
                        IdRep:resultrep._id,  

                        CuentaSelec:{idCuenta:req.body.CuentaSelect._id,
                                    nombreCuenta: req.body.CuentaSelect.NombreC,
                                    valorCambiar: "repeticion"},
                  
                        CatSelect:{nombreCat:req.body.CatSelect.nombreCat,
                                  subCatSelect:req.body.SubCatSelect},
                  
                        Nota:req.body.Nota,
                        Descripcion:req.body.Descripcion+"Repetición "+req.body.Valrep,
                        Estado:true,
                        urlImg:req.body.urlImg,
                        Valrep:req.body.Valrep,
                        TipoRep:req.body.TipoRep,
                        Importe:fixedImport,
                        Usuario:{
                          Nombre:req.body.Usuario.Usuario,
                          Id:req.body.Usuario._id,
                          Tipo:req.body.Usuario.Tipo,
                  
                        },
                      
                  
                    }], options)

                      if(i === (cantidadRegistros-1)){
                        let val = resultreg[0].IdRegistro + 1
                        let updatecounter = {  ContRegs: val  }
                        let idDataReg = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,options )
                        await session.commitTransaction();    
                        session.endSession();                    
                        return res.send({status: "Ok", message: "repeticiones generadas", cuenta:cuentaUpdate, idreg:idDataReg  });
                        
                      }
                    
  
                
                     
                      }//fin del for
                   
                    }//fin try

                    catch(error){
                      console.log(error)
                      await session.abortTransaction();
                    
                      session.endSession();
                      return res.json({status: "Error", message: "error al registrar", error });
                    }


                    
                  }else{
                         
                          registroFuturo()
                        }
          } else{
             
               registroFuturo()
              
              }
        }//fin rep
      else if(req.body.TipoRep == "Cuota"){
       
        let fecha = new Date(req.body.Tiempo)
let ids = req.body.iDReg
let nuevoValor=(parseFloat(fixedImport) / parseInt(req.body.Valrep)).toFixed(2)
const session = await mongoose.startSession();  
        
session.startTransaction();
try {
  const cantidadRep = parseInt(req.body.Valrep)
  for(let i=0; i< cantidadRep ;i++){
   
    let mifecha = req.body.Tiempo
    let fechacambio = new Date(mifecha)
    let newNota = req.body.Nota + " Total("+(i+1)+"/"+req.body.Valrep+")"
    if(i >0){ 
      let nuevomes = fechacambio.getMonth() + i 
             
      fechacambio.setMonth(nuevomes)
      mifecha= new Date(fechacambio).getTime()
      ids = parseInt(req.body.iDReg) + parseInt(i)
    }
    let update =""
    if(req.body.Accion === "Ingreso"){
      update = { $inc: { DineroActual: nuevoValor } }
   }
   else if(req.body.Accion === "Gasto"){
     let valornegativo = nuevoValor * (-1)
      update = { $inc: { DineroActual: valornegativo } }
   }
   let options = {new:true, session}  
   let cuentaEdi = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect._id, update, options)
   
   if(cuentaEdi == null ){
    throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
  } 
   
   let resultReg = await RegModelSass.create([{
                                                          Accion:req.body.Accion,   
                                                          Tiempo:mifecha,
                                                          IdRegistro:ids,
                                                        
                                                          CuentaSelec:{idCuenta:req.body.CuentaSelect._id,
                                                                      nombreCuenta: req.body.CuentaSelect.NombreC,
                                                                      valorCambiar: "cuota"},
                                                        
                                                          CatSelect:{nombreCat:req.body.CatSelect.nombreCat,
                                                                    subCatSelect:req.body.SubCatSelect},
                                                        
                                                          Nota:newNota,
                                                          Descripcion:req.body.Descripcion,
                                                          Estado:true,
                                                          urlImg:req.body.urlImg,
                                                          Valrep:req.body.Valrep,
                                                          TipoRep:req.body.TipoRep,
                                                          Importe:nuevoValor,
                                                          Usuario:{
                                                            Nombre:req.body.Usuario.Usuario,
                                                            Id:req.body.Usuario._id,
                                                            Tipo:req.body.Usuario.Tipo,
                                                        
                                                          },
                                                          
 
 
 }], {session})
   
 if(i === (cantidadRep-1)){
  let val = resultReg[0].IdRegistro + 1
  let updatecounter = {  ContRegs: val  }
  let idDataReg = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,options )
  await session.commitTransaction();    
  session.endSession();                    
  return res.send({status: "Ok", message: "cuotas generadas", cuenta:cuentaEdi, idreg:idDataReg  });
       }


  }//FIN FOR
} catch(error){
  console.log(error)
  await session.abortTransaction();        
  session.endSession();
  return res.json({status: "Error", message: "error al registrar", error });
}



      }//fin cuota

  }//fin addReg
  else if(req.body.Accion === "Trans"){

    if(req.body.TipoRep =="No"){
        const session = await mongoose.startSession();  
       
        session.startTransaction();
      try {
        const opts2 = { session, new:true };
        const opts = { session};
        
        let regCreate = await RegModelSass.create([{
          Accion:req.body.Accion,   
          Tiempo:req.body.Tiempo,
          IdRegistro:req.body.iDReg,
      
          CuentaSelec:{idCuenta:req.body.CuentaSelect1._id,
                      nombreCuenta: req.body.CuentaSelect1.NombreC,
                      valorCambiar: req.body.CuentaSelect1.DineroActual},
      
      
          CuentaSelec2:{idCuenta:req.body.CuentaSelect2._id,
                        nombreCuenta: req.body.CuentaSelect2.NombreC,
                        valorCambiar: req.body.CuentaSelect2.DineroActual},
      
      
          Nota:req.body.Nota,
          Descripcion:req.body.Descripcion,
          Estado:true,
          urlImg:req.body.urlImg,
          Valrep:req.body.Valrep,
          TipoRep:req.body.TipoRep,
          Importe:fixedImport,
          Usuario:{
            Nombre:req.body.Usuario.Usuario,
            Id:req.body.Usuario._id,
            Tipo:req.body.Usuario.Tipo,
      
          }
      
      }], opts)
      let valornegativo = fixedImport * (-1)
      let update = { $inc: { DineroActual: valornegativo } }
      let update2 = { $inc: { DineroActual: fixedImport } }

  
        const cuenta1 = await   CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect1._id, update, opts2)
   
        const cuenta2 = await   CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect2._id, update2, opts2)
        let updatecounter = { $inc: { ContRegs: 1 } }
        let idDataReg = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,opts2 )
        if(cuenta1 == null || cuenta2 == null|| idDataReg== null){
          throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
        }  
        
      }
      catch(error){
        console.log(error)
        await session.abortTransaction();
       
        session.endSession();
        return res.json({status: "Error", message: "error al registrar", error });
      }

      }    
   else if(req.body.TipoRep == "Repetir"){
  
        let tiempoActual = new Date()
        let yearCurrent = tiempoActual.getFullYear()
        let yearRegister = new Date(req.body.Tiempo).getFullYear()
        const registroFuturoTrans = async ()=>{
          let fechaeje = 0
   
          let fechabase = new Date(req.body.Tiempo)
         
          let sethorames =new Date(fechabase).setHours(0,0,0)
          fechaeje = sethorames


       await  RepeticionModelSass.create({
            reg: {
              Accion:req.body.Accion,   
              Tiempo:req.body.Tiempo,

              CuentaSelec:{idCuenta:req.body.CuentaSelect1._id,
                nombreCuenta: req.body.CuentaSelect1.NombreC,
                valorCambiar: req.body.CuentaSelect1.DineroActual},

        
              CuentaSelec2:{idCuenta:req.body.CuentaSelect2._id,
                          nombreCuenta: req.body.CuentaSelect2.NombreC,
                          valorCambiar: req.body.CuentaSelect2.DineroActual},
                     
              Nota:req.body.Nota,
              Descripcion:req.body.Descripcion,
             
              urlImg:req.body.urlImg,
              Valrep:req.body.Valrep,
              TipoRep:req.body.TipoRep,
              Importe:fixedImport,
              Usuario:{
                Nombre:req.body.Usuario.Usuario,
                Id:req.body.Usuario._id,
                Tipo:req.body.Usuario.Tipo,
        
              }
          
        
          },
            fechaEjecucion: fechaeje

           },(err, resultrep)=>{
            if(err) {res.json({status: "Error", message: "error al registrar", error });} 
            res.send({status: "Ok", message: "repeticion futura creada",  resultrep });

           })
                                        }
                  if(yearRegister <= yearCurrent  ){
                  
                    let mes = new Date(req.body.Tiempo).getMonth()
                    let mesActual = new Date().getMonth()
                                    if(mes<= mesActual ){
                                      const session4 = await mongoose.startSession();   
                                      session4.startTransaction();
                                      try {
                                      let fechaeje = 0
                                      
                                      let fechaRep = new Date()

                    if(req.body.Valrep == "Cada Semana" || req.body.Valrep == "Cada Mes"){
                  
                     let setmes = fechaRep.setMonth(mesActual + 1)
                   

                    let sethora =new Date(setmes).setHours(0,0,0)
                                   

                    fechaeje = sethora
                    }else if(  req.body.Valrep ==="Cada Día" ){
       
                      let setmes = fechaRep.setMonth(mesActual + 1)
                   

                      let sethora =new Date(setmes).setHours(0,0,0)
                      let setdia = new Date(sethora).setDate(1)
                                     
  
                      fechaeje = setdia
                    } 
                    else if(req.body.Valrep == "Cada Año" ){
                
                     let setyear = fechaRep.setFullYear(fechaRep.getFullYear() + 1)
                    
                    let sethora =new Date(setyear).setHours(0,0,0)
                    fechaeje = sethora
                    }
      
        const resultrep = await  RepeticionModelSass.create([{
          reg: {
            Accion:req.body.Accion,   
            Tiempo:req.body.Tiempo,
        
      
            CuentaSelec:{idCuenta:req.body.CuentaSelect1._id,
              nombreCuenta: req.body.CuentaSelect1.NombreC,
              valorCambiar: req.body.CuentaSelect1.DineroActual},
      
      
            CuentaSelec2:{idCuenta:req.body.CuentaSelect2._id,
                        nombreCuenta: req.body.CuentaSelect2.NombreC,
                        valorCambiar: req.body.CuentaSelect2.DineroActual},
            Nota:req.body.Nota,
            Descripcion:req.body.Descripcion,
          
            urlImg:req.body.urlImg,
            Valrep:req.body.Valrep,
            TipoRep:req.body.TipoRep,
            Importe:fixedImport,
            Usuario:{
              Nombre:req.body.Usuario.Usuario,
              Id:req.body.Usuario._id,
              Tipo:req.body.Usuario.Tipo,
      
            }
        
      
        },
          fechaEjecucion: fechaeje
      
        }], {session: session4, new:true})

        let mesesExtra = (mesActual - mes) + 1
        let  cantidadRegistros = 0 
        if(req.body.Valrep ==="Cada Día"){      
      
              if(mes < mesActual){
                let fechaconver = new Date(req.body.Tiempo)
                
                for(let x=0;x<mesesExtra;x++){                    
                                
                  if(x > 0){
                
                    let fechapormodi = fechaconver.setMonth(fechaconver.getMonth() + x )
                    let fechamodi = new Date(fechapormodi).setDate(1)
              
              let dateFechamodi = new Date(fechamodi)
                    var ultimoDia = new Date(dateFechamodi.getFullYear(), dateFechamodi.getMonth() + 1, 0)
                    let diaActual = dateFechamodi.getDate() 
                    let Diasestemes = ultimoDia.getDate()  - diaActual
                  
                    cantidadRegistros += Diasestemes+1
                  }else{
                    var ultimoDia = new Date(fechaconver.getFullYear(), fechaconver.getMonth() + 1, 0)
                    let diaActual = fechaconver.getDate() 

                    let Diasestemes = ultimoDia.getDate() - diaActual
                  
                    cantidadRegistros += Diasestemes+1
                

                  }
                  console.log(cantidadRegistros)
                }
              }else{
        
                var ultimoDia = new Date(fechacambio.getFullYear(), fechacambio.getMonth() + 1, 0)
                let cantidadDias = ultimoDia.getDate() - fechacambio.getDate()
                let cantidadDiasFor = cantidadDias + 1
                    cantidadRegistros = cantidadDiasFor
              }

        
        }
        else if(req.body.Valrep == "Cada Semana"){
          if(mes < mesActual){
            throw Error("Sin soporte");
          }
          else{
            let fechafind = new Date(req.body.Tiempo)
            var year=fechafind.getFullYear();
            var mesdeSem= fechafind.getMonth() + 1;
            var dia= fechafind.getDate()
            var cantidadDias = new Date(year, mesdeSem, 0).getDate()

            var diasrestantes = (cantidadDias- dia) + 1
        
            var repeticion = Math.ceil(diasrestantes/7)

            cantidadRegistros= repeticion}
        }
        else if(req.body.Valrep == "Cada Mes"){

        
        
          cantidadRegistros= ( mesesExtra)

        }
        else if(req.body.Valrep == "Cada Año"){
          if(yearRegister < yearCurrent){
            throw Error("Sin soporte");
          }else{
          cantidadRegistros= 1
          }
        }

        console.log(cantidadRegistros)
            for(let i = 0; i < cantidadRegistros; i++){

            
            let options = {new:true, session:session4} 
            let ids = req.body.iDReg + i
            let fechaset = req.body.Tiempo
            let fechacambio = new Date(fechaset)
            
            if(i >0){

              if(req.body.Valrep ==="Cada Día"){  
                let fechafija = new Date(req.body.Tiempo)
                let nuevodia = fechafija.getDate() + i  

                if(mes < mesActual){
                
                    let copiafija = new Date(req.body.Tiempo)
                  let getval =  copiafija.setDate(nuevodia)   
                    fechaset= new Date(getval).getTime()   
                  
                }else{
              
                  fechacambio.setDate(nuevodia)   
                  fechaset= new Date(fechacambio).getTime() 
                }

              
                                        
            }
            else if(req.body.Valrep == "Cada Semana"){
              let nuevodiasem = fechacambio.getDate() + (7*i)  
              fechacambio.setDate(nuevodiasem)   
              fechaset= new Date(fechacambio).getTime() 

            } else if(req.body.Valrep == "Cada Mes"){
            
              let fechafija = new Date(req.body.Tiempo)
              let nuevomes = fechafija.getMonth() + i                           
              fechafija.setMonth(nuevomes)   
          
              fechaset= fechafija.getTime() 

            }
                                

            }


            const regis = await  RegModelSass.create([{
              Accion:req.body.Accion,                                                                        
              Tiempo:fechaset, 
              IdRegistro:parseInt(ids),  
              IdRep:resultrep._id,    
              
              CuentaSelec:{idCuenta:req.body.CuentaSelect1._id,
                nombreCuenta: req.body.CuentaSelect1.NombreC,
                valorCambiar: req.body.CuentaSelect1.DineroActual},
    
        
              CuentaSelec2:{idCuenta:req.body.CuentaSelect2._id,
                          nombreCuenta: req.body.CuentaSelect2.NombreC,
                          valorCambiar: req.body.CuentaSelect2.DineroActual},
    
              Nota:req.body.Nota ,
              Descripcion:req.body.Descripcion,
        
              urlImg:req.body.urlImg,
              Valrep:req.body.Valrep,
              TipoRep:req.body.TipoRep,
              Importe:fixedImport,
              Usuario:{
                Nombre:req.body.Usuario.Usuario,
                Id:req.body.Usuario._id,
                Tipo:req.body.Usuario.Tipo,
        
              }
        }], options)
            
      
        let valornegativo = fixedImport * (-1)
        let update = { $inc: { DineroActual: valornegativo } }
        let update2 = { $inc: { DineroActual: fixedImport } }

  const cuenta1 = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect1._id, update, options)
  const cuenta2 = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect2._id, update2, options)
            
  if(cuenta1 == null || cuenta2 == null){
    throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
  } 

  if(i === (cantidadRegistros-1)){
  let val = regis[0].IdRegistro + 1
  let updatecounter = {  ContRegs: val  }
  await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,options )
    await session4.commitTransaction();
    session4.endSession();
    return res.send({status: "Ok", message: "repeticiones generadas"  });

                                }                                          
  
          
          
          }//fin del for 
                                                          
                                                          
                                                          
                                                            }
                                                            catch(error){
                                                              console.log(error)
                                                              await session4.abortTransaction();
                                                              session4.endSession();
                                                              return res.json({status: "Error", message: "error al registrar", error });
                                                                    }
          
                      
                                                          }else if(mes > mesActual){
                                                            console.log("mes mayor registrar a futuro ")
                                                            registroFuturoTrans();
                                                          }
          
          
          
                                        }
                                        else {
                                          console.log("año mayor registrar a futuro")
                                          
                                          registroFuturoTrans()
          
                                        }
                                      }//fin transrep
}