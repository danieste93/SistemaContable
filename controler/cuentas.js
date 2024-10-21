const { DOMParser, XMLSerializer } = require('@xmldom/xmldom')
const comprasSchema= require("../models/comprasSass")
const pdf = require('html-pdf');
const clientSchema = require("../models/clientSass")
const accountSchema = require("../models/cuentaSass")
const catSchema = require("../models/catSass")
const tipoSchema  = require("../models/tiposSass")
const repeticionSchema= require("../models/RepeticionSass")
const regSchema= require("../models/registrosSass")
const regSchemaDelete= require("../models/registrosSassDel")
const counterSchema= require("../models/counterSass")
const userModelSchema = require('../models/usersSass');
const tipoSchemaSass = require('../models/tiposSass');
const ArticuloSchema = require("../models/articuloSass")
const ventasSchema = require("../models/ventaSass")
const distriSchema = require('../models/ditribuidorSass');
const jwt = require('jsonwebtoken');
const Cuentasmodel = require("../models/cuenta")
const Regmodel  = require("../models/registros")
const Tipomodel  = require("../models/tipos")
const Catmodel = require("../models/cat")
const Repeticion= require("../models/Repeticion")
const Venta = require("../models/venta")
const Articulo = require("../models/articulo")
const userModel = require('../models/users');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const moment = require('moment');



async function addReg (req, res){

  let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
      let CuentasModelSass = await conn.model('Cuenta', accountSchema);
      let RegModelSass = await conn.model('Reg', regSchema);
      let CounterModelSass = await conn.model('Counter', counterSchema);
      let RepeticionModelSass = await conn.model('Repeticion', repeticionSchema);

    const fixedImport = new mongoose.Types.Decimal128(parseFloat(req.body.Importe).toFixed(2))

 

    let tiempoActual = new Date().getTime()
    
        let tiempoRegistro = req.body.Tiempo
        const session = await mongoose.startSession();  
   
        session.startTransaction();
        try {
          const opts2 = { session, new:true };
          const opts = { session};
    
              let Counterx =     await CounterModelSass.find({iDgeneral:9999999},null, {session} )
              let datareg= { Accion:req.body.Accion,   
                Tiempo:tiempoRegistro,
                IdRegistro:Counterx[0].ContRegs,
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
            
              if(req.body.TipoRep =="No"){

                let tiempoEXE =    0
                if(req.body.Accion === "Ingreso" || req.body.Accion === "Gasto"){
             let Cuentadata = "Noupdate"
                  if(tiempoRegistro <= tiempoActual ){
                    tiempoEXE = req.body.Tiempo

                  let update 
                  if(req.body.Accion === "Ingreso"){
                    update = { $inc: { DineroActual: fixedImport } }
                  }else if(req.body.Accion === "Gasto"){
                    let valornegativo = fixedImport * (-1)
                    update = { $inc: { DineroActual: valornegativo } }
                  }

                   Cuentadata = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect._id, update,opts2)
                  if(Cuentadata == null ){
                    throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
                  } 
                  }
                  let regIngGas ={
                    ...datareg,
                    TiempoEjecucion:tiempoEXE,
                    CuentaSelec:{idCuenta:req.body.CuentaSelect._id,
                      nombreCuenta: req.body.CuentaSelect.NombreC,
                      valorCambiar: req.body.CuentaSelect.DineroActual},
       
                    CatSelect:{idCat:req.body.CatSelect.idCat,
                              urlIcono:req.body.CatSelect.urlIcono,
                                nombreCat:req.body.CatSelect.nombreCat,
                              subCatSelect:req.body.SubCatSelect,
                            _id:req.body.CatSelect._id
                            }
                               

                  }

                  const regCreate = await RegModelSass.create([regIngGas], opts)
                  let updatecounter = { $inc: { ContRegs: 1 } }
                 await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,opts2 )
                 
                  await session.commitTransaction();
                    session.endSession();
                  return res.json({status: "Ok", message: "Exito registroIngGas individual", regCreate,cuenta:Cuentadata});
               
              } else if(req.body.Accion === "Trans"){
               
                let cuenta1 = await  CuentasModelSass.findById(req.body.CuentaSelect1._id, null, {session})
                let cuenta2 =await   CuentasModelSass.findById(req.body.CuentaSelect2._id, null, {session})        
                if(tiempoRegistro <= tiempoActual ){
                  tiempoEXE = req.body.Tiempo

                let valornegativo = fixedImport * (-1)
                let update = { $inc: { DineroActual: valornegativo } }
                let update2 = { $inc: { DineroActual: fixedImport } }

                   cuenta1 = await   CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect1._id, update, opts2)
                   cuenta2 = await   CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect2._id, update2, opts2)
                  
                  let updatecounter = { $inc: { ContRegs: 1 } }
                  let idDataReg = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,opts2 )
                  if(cuenta1 == null || cuenta2 == null|| idDataReg== null){
                    throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
                  }  
                }

                  let regTrans ={
                    ...datareg,
                    TiempoEjecucion:tiempoEXE,
                    CuentaSelec:{idCuenta:req.body.CuentaSelect1._id,
                      nombreCuenta: req.body.CuentaSelect1.NombreC,
                      valorCambiar: req.body.CuentaSelect1.DineroActual},
      
      
          CuentaSelec2:{idCuenta:req.body.CuentaSelect2._id,
                        nombreCuenta: req.body.CuentaSelect2.NombreC,
                        valorCambiar: req.body.CuentaSelect2.DineroActual},
                                

                  }

                  let regCreate = await RegModelSass.create([regTrans ], opts)
                 
                  if( regCreate== null){
                    throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
                  }  
                  await session.commitTransaction();
                        session.endSession();
                 return res.status(200).send({message:"Transferencia genereda", regCreate,cuenta1,cuenta2})

              }//fin trans 
                
              
              }// fin TipoRep =="No"
           
              else if(req.body.TipoRep == "Cuota"){


                let nuevoValor=(fixedImport / parseInt(req.body.Valrep)).toFixed(2)
                const cantidadRep = parseInt(req.body.Valrep)
                let allCreatedRegs = []
                for(let i=0; i< cantidadRep ;i++){
                  let tiempoEXE =    0
                  let ids = parseInt(Counterx[0].ContRegs) + parseInt(i)
                  let mifecha = req.body.Tiempo
                  let fechacambio = new Date(mifecha)
                  let newNota = req.body.Nota + " Total("+(i+1)+"/"+req.body.Valrep+")"
                  if(i >0){ 
                    let nuevomes = fechacambio.getMonth() + i 
                           
                    fechacambio.setMonth(nuevomes)
                    mifecha= new Date(fechacambio).getTime()
                 
                  }
                  let cuentaEdi = 0
                  if(mifecha <= tiempoActual ){
                  let update =""
                  tiempoEXE = req.body.Tiempo
                  if(req.body.Accion === "Ingreso"){
                    update = { $inc: { DineroActual: nuevoValor } }
                 }
                 else if(req.body.Accion === "Gasto"){
                   let valornegativo = nuevoValor * (-1)
                    update = { $inc: { DineroActual: valornegativo } }
                 }
                 let options = {new:true, session}  
                  cuentaEdi = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect._id, update, options)
                 
                 if(cuentaEdi == null ){
                  throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
                } 
                  }

                 let resultReg = await RegModelSass.create([{
                                                                      
                                                                        ...datareg,
                                                                        Tiempo:mifecha,
                                                                        TiempoEjecucion:tiempoEXE,
                                                                        IdRegistro:ids,
                                                                        CuentaSelec:{idCuenta:req.body.CuentaSelect._id,
                                                                                    nombreCuenta: req.body.CuentaSelect.NombreC,
                                                                                    valorCambiar: "cuota"},
                                                                      
                                                                                    CatSelect:{idCat:req.body.CatSelect.idCat,
                                                                                      urlIcono:req.body.CatSelect.urlIcono,
                                                                                        nombreCat:req.body.CatSelect.nombreCat,
                                                                                      subCatSelect:req.body.SubCatSelect,
                                                                                      _id:req.body.CatSelect._id
                                                                                    },
                                                                      
                                                                        Nota:newNota,

                                                                        Importe:nuevoValor,
                                                                    
                                                                        
               
               
               }], {session})
               allCreatedRegs.push(resultReg[0])
                 
               if(i === (cantidadRep-1)){
                let val = resultReg[0].IdRegistro + 1
                let updatecounter = {  ContRegs: val  }
                let idDataReg = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,opts )
                await session.commitTransaction();    
                session.endSession();                    
                return res.send({status: "Ok", message: "cuotas generadas", registrosGenerados:allCreatedRegs   });
                     }
              
              
                }//FIN FOR       

  

                
                  }// fin TipoRep =="Cuota"

                  else if(req.body.TipoRep == "Repetir"){
              
                 
                let yearCurrent =     new Date().getFullYear()
                let yearRegister = new Date(req.body.Tiempo).getFullYear()
                let datosEspecificos 
                if(req.body.Accion === "Ingreso" || req.body.Accion === "Gasto"){
                  datosEspecificos={
                    CuentaSelec:{idCuenta:req.body.CuentaSelect._id,
                      nombreCuenta: req.body.CuentaSelect.NombreC,
                      },
    
                      CatSelect:{idCat:req.body.CatSelect.idCat,
                        urlIcono:req.body.CatSelect.urlIcono,
                          nombreCat:req.body.CatSelect.nombreCat,
                        subCatSelect:req.body.SubCatSelect,
                      _id:req.body.CatSelect._id
                      }
                  }
                }else if(req.body.Accion === "Trans"){

                  datosEspecificos={
                    CuentaSelec:{idCuenta:req.body.CuentaSelect1._id,
                      nombreCuenta: req.body.CuentaSelect1.NombreC,
                      valorCambiar:req.body.CuentaSelect1.DineroActual},
      
              
                    CuentaSelec2:{idCuenta:req.body.CuentaSelect2._id,
                                nombreCuenta: req.body.CuentaSelect2.NombreC,
                                valorCambiar: req.body.CuentaSelect2.DineroActual},
                  }

                } 
                const registroFuturo = async (datosEspecificos)=>{
                 
                  let fechaeje = 0
           
                  let fechabase = new Date(req.body.Tiempo)
                
              
                  let sethorames =new Date(fechabase).setHours(0,5,0)
                  
                  fechaeje = sethorames
                
      
          let futureRep=    await  RepeticionModelSass.create({
                    reg: {
                      ...datareg,
                      ...datosEspecificos
                    
                  },
                    fechaEjecucion: fechaeje
      
                   },(err, resultrep)=>{
                    if(err){  throw new Error("Error al crear Repeticion Futura")}
                   return  res.send({status: "Ok", message: "repeticion futura creada",  resultrep:futureRep });
      
                   })
                }
                if( yearRegister <= yearCurrent  ){
             
                  let mes = new Date(req.body.Tiempo).getMonth()
                  let mesActual = new Date().getMonth()
                        if(mes <= mesActual){
 
      
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
                      
                   let allCreatedRegs=[]
                   
                         
                            for(let i = 0; i < cantidadRegistros; i++){
      
                              let tiempoEXE =    0
                              let ids = parseInt(Counterx[0].ContRegs) + parseInt(i)
                              let fechaset = new Date(req.body.Tiempo).getTime()  
                          
                              if(i >0){
                                const  fechafija = new Date(req.body.Tiempo)
                                if(req.body.Valrep ==="Cada Día"){  
                             
                                  let nuevodia = fechafija.getDate() + i  
                               
                                  if(mes <= mesActual){
                                
                                    let getval =   new Date(req.body.Tiempo).setDate(nuevodia)   
                                      fechaset= new Date(getval).getTime()   
                                   
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
                            
        
                              }else if(req.body.Valrep == "Cada Año"){
                                let nuevoanio = fechafija.getFullYear() + i                            
                                fechacambio.setFullYear(nuevoanio)   
                                fechaset= new Date(fechacambio).getTime() 
        
                              }
                                                  
        
                              }
                              let cuentaUpdate = ""
                         
                          
                              if(fechaset <= tiempoActual ){
                           
                            let update =""
                            tiempoEXE = req.body.Tiempo
                            let options = {new:true, session} 
                            let valornegativo = fixedImport * (-1)
                            if(req.body.Accion === "Ingreso" || req.body.Accion === "Gasto"){
                            if(req.body.Accion === "Ingreso"){
                              update = { $inc: { DineroActual: fixedImport } }
                             
                            }
                            else if(req.body.Accion === "Gasto"){
                          
                          
                           update = { $inc: { DineroActual: valornegativo } }
                            }   
                            cuentaUpdate = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect._id, update, options)
                            
                            if(cuentaUpdate == null ){
                              throw new Error("Cuentas no Encontradas en trans repeticion, Contacte a soporte")
                            } 

                          } else if(req.body.Accion === "Trans"){
                              
                               update = { $inc: { DineroActual: valornegativo } }
                              let update2 = { $inc: { DineroActual: fixedImport } }
                              const cuenta2 = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect2._id, update2, options)
                              if( cuenta2 == null){
                                throw new Error("Cuentas no Encontradas en trans repeticion, Contacte a soporte")
                              } 
                              cuentaUpdate = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect1._id, update, options)
                            
                              if(cuentaUpdate == null ){
                                throw new Error("Cuentas no Encontradas en trans repeticion, Contacte a soporte")
                              } 
                            }
                           
                          }
                            const resultreg = await  RegModelSass.create([
                              { 
                                ...datareg,
                                ...datosEspecificos,
                              Tiempo:fechaset,
                              TiempoEjecucion:tiempoEXE,
                              IdRegistro:ids,
                  
                                
                              Descripcion:req.body.Descripcion+"Repetición "+req.body.Valrep,
                   
                          }], opts2)

                        allCreatedRegs.push(resultreg[0])

                            if(i === (cantidadRegistros-1)){
                          
                              let val = resultreg[0].IdRegistro + 1
                              let updatecounter = {  ContRegs: val  }

                              let fechaeje = 0
                              let fechaRep = new Date()
                            
                              if(req.body.Valrep == "Cada Semana"){
                                let ultimafecha =new Date(fechaset)
      
                                let setdia = ultimafecha.setDate(ultimafecha.getDate() + 7)
                          
                                let sethora =new Date(setdia).setHours(0,5,0)
                          
                                fechaeje = sethora
                             
                              }else if(  req.body.Valrep ==="Cada Mes"){
                                let setmes = fechaRep.setMonth(mesActual + 1)
                                let setdia = new Date(setmes).setDate(1)
                                let sethora =new Date(setdia).setHours(0,5,0)
                                fechaeje = sethora
                              }else if(  req.body.Valrep ==="Cada Día" ){
           
                                let setmes = fechaRep.setMonth(mesActual + 1)
                                let sethora =new Date(setmes).setHours(0,5,0)
                                let setdia = new Date(sethora).setDate(1)
                                               
            
                                fechaeje = setdia
                              }  else if(req.body.Valrep == "Cada Año" ){
                    
                                let setyear = fechaRep.setFullYear(fechaRep.getFullYear() + 1)
                                let setdia = new Date(setyear).setDate(1)
                               let sethora =new Date(setdia).setHours(0,5,0)
                               
                               fechaeje = sethora
                               }
                             
                               const resultrep = await  RepeticionModelSass.create([{
                                reg: {
                                 ...datareg,
                                ...datosEspecificos,
                            
                              },
                                fechaEjecucion: fechaeje
            
                               }], {session})  
                              
                              let idDataReg = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,opts2 )
                              await session.commitTransaction();    
                              session.endSession();                 
                              return res.send({status: "Ok", message: "repeticiones generadas", registrosGenerados:allCreatedRegs  });
                              
                            }
                          
        
                      
                           
                            }//fin del for
             
                          
                        }else{
                               
                                registroFuturo(datosEspecificos)
                              }
                } else{
                   
                     registroFuturo(datosEspecificos)
                    
                    }
              }// fin TipoRep =="Repetir"

 }
 catch(error){
  console.log(error)
  await session.abortTransaction();
  session.endSession();
  return res.json({status: "Error", message: "error al registrar", error });
}
 }

async function editReg(req,res){

    let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
    let RegModelSass = await conn.model('Reg', regSchema);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);
 

    const session = await mongoose.startSession();  
          
    session.startTransaction();

    try {

      let registro = await RegModelSass.findById(req.body.idMongo,null,{session})
      let tiempoActual = new Date().getTime()
      let cuentaUpa ={}
      if(registro.TiempoEjecucion != 0){
      registro.TiempoEjecucion = 0
  
      if(registro.Accion == "Ingreso" || registro.Accion == "Gasto" ){
        if(registro.Accion == "Ingreso"){
          updatex = { $inc: { DineroActual: (registro.Importe *-1) } }

         }else{
           updatex = { $inc: { DineroActual: (registro.Importe) } }
         }
         

        cuentaUpa = await CuentasModelSass.findByIdAndUpdate(registro.CuentaSelec.idCuenta, updatex, {new:true,session})
         if(cuentaUpa == null){
          throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
        } 
    
      }else if(registro.Accion == "Trans"){
        let updateNegativo = { $inc: { DineroActual: (registro.Importe *-1) } }
        let updatePositivo = { $inc: { DineroActual: (registro.Importe ) } }
let cuentax1= await  CuentasModelSass.findByIdAndUpdate(registro.CuentaSelec.idCuenta, updatePositivo, {session})
let cuentax2= await  CuentasModelSass.findByIdAndUpdate(registro.CuentaSelec2.idCuenta, updateNegativo, {session})

if(cuentax1 == null || cuentax2 == null){
  throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
} 

}
}



    let newversiones = req.body.Versiones
const fixedImport = new mongoose.Types.Decimal128(parseFloat(req.body.Importe).toFixed(2));
      if(req.body.Accion === "Ingreso" || req.body.Accion === "Gasto"){

        let genCat = req.body.CatSelect
        genCat.subCatSelect = req.body.SubCatSelect


        let Cuentaup  =await CuentasModelSass.findById(req.body.CuentaSelec.idCuenta, null, {session})
        
            newversiones.push(registro)
        let datareg= { Accion:req.body.Accion,   
          Tiempo:req.body.Tiempo,
          IdRegistro:req.body.iDReg,
          TiempoEjecucion:0,
          CuentaSelec: req.body.CuentaSelec,
         CatSelect:genCat,
          Nota:req.body.Nota,
          Descripcion:req.body.Descripcion,
          Estado:true,
          urlImg:req.body.urlImg,
          Valrep:req.body.Valrep,
          TipoRep:req.body.TipoRep,
          Importe:fixedImport,
          Versiones: newversiones,
          Usuario:{
            Nombre:req.body.Usuario.Usuario,
            Id:req.body.Usuario._id,
            Tipo:req.body.Usuario.Tipo,
        
          }}

          let options = {new:true, session} 
          let update =""
      

          if(req.body.Tiempo <= tiempoActual ){

            datareg.TiempoEjecucion = tiempoActual

            
          if(req.body.Accion === "Ingreso"){

          update = { $inc: { DineroActual: fixedImport } }
         
          }       
            else if(req.body.Accion === "Gasto")
          {
            update = { $inc: { DineroActual: (fixedImport*-1) } }
        
          }
          Cuentaup = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelec.idCuenta, update, options)
          if(Cuentaup == null ){
            throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
          } 
        }
        let regUp =  await  RegModelSass.findByIdAndUpdate(req.body.idMongo, datareg, options)
            if(regUp == null ){
              throw new Error("reg no Encontradas, vuelva intentar en unos minutos")
            } 
          await session.commitTransaction();
          session.endSession();
         
          res.send({status: "Ok", message: "reg y cuenta", registro:regUp, cuenta:Cuentaup, cuentaA:cuentaUpa });

      }

      else if(req.body.Accion === "Trans"){
  
        newversiones.push(registro)
        let dataregTrans = {
          Accion:req.body.Accion,   
          Tiempo:req.body.Tiempo,
          IdRegistro:req.body.iDReg,
          TiempoEjecucion:0,
          CuentaSelec:{idCuenta:req.body.CuentaSelect1.idCuenta,
                      nombreCuenta: req.body.CuentaSelect1.nombreCuenta,
                      valorCambiar: req.body.CuentaSelect1.valorCambiar},
    
    
          CuentaSelec2:{idCuenta:req.body.CuentaSelect2.idCuenta,
                        nombreCuenta: req.body.CuentaSelect2.nombreCuenta,
                        valorCambiar: req.body.CuentaSelect2.valorCambiar},
    
    
          Nota:req.body.Nota,
          Descripcion:req.body.Descripcion,
          Estado:true,
          urlImg:req.body.urlImg,
          Valrep:req.body.Valrep,
          TipoRep:req.body.TipoRep,
          Importe:fixedImport,
          Versiones: newversiones,
          Usuario:{
            Nombre:req.body.Usuario.Usuario,
            Id:req.body.Usuario._id,
            Tipo:req.body.Usuario.Tipo,
    
          }
      }
      let options = {new:true, session} 
      let cuenta1 = await  CuentasModelSass.findById(req.body.CuentaSelect1.idCuenta, null, {session})
      let cuenta2 = await CuentasModelSass.findById(req.body.CuentaSelect2.idCuenta, null, {session})
      if(req.body.Tiempo <= tiempoActual ){

        dataregTrans.TiempoEjecucion = tiempoActual
      let updatexCT = { $inc: { DineroActual: (fixedImport*-1) } } 
      let updatexCT2 = { $inc: { DineroActual: fixedImport} }
      cuenta1 = await  CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect1.idCuenta, updatexCT, options)
      cuenta2 = await  CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelect2.idCuenta, updatexCT2, options)
     
      if(cuenta1 == null || cuenta2 == null){
        throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
      } 
    }

      let regTrans = await RegModelSass.findByIdAndUpdate(req.body.idMongo, dataregTrans, options) 
      if(regTrans == null ){
        throw new Error("Reg Trans no Encontradas, vuelva intentar en unos minutos")
      } 
     
      res.send({status: "Ok", message: "reg y cuenta", registro:regTrans, cuenta1, cuenta2 });    
   
   
   
      await session.commitTransaction();
      session.endSession();
 
    }
 



    }
   catch(error){
      console.log(error)
      await session.abortTransaction();
      session.endSession();
      return res.json({status: "Error", message: "error al registrar", error });
    }
   
  }
  async  function exeRegs (req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let RegModelSass = await conn.model('Reg', regSchema);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);

    const session = await mongoose.startSession();  
   
    session.startTransaction();
    try {

    let tiempoTricked = new Date(new Date().setHours(new Date().getHours() + 1))

let regToexe =[]

   regToexe = await RegModelSass.find({
      
      $and: [
        {TiempoEjecucion: 0},
        {Tiempo: {$lte : new Date().getTime()}}
      ]
    })
    
    let registrosUpdate=[]
if(regToexe.length > 0){
 

  for(let i = 0; i<regToexe.length; i++){
    const fixedImport = new mongoose.Types.Decimal128(parseFloat(regToexe[i].Importe).toFixed(2));
let updateReg ={TiempoEjecucion:new Date().getTime()}

   let regup = await  RegModelSass.findByIdAndUpdate(regToexe[i]._id, updateReg, {session, new:true})

   registrosUpdate.push(regup)
  if(regToexe[i].Accion === "Ingreso" || regToexe[i].Accion === "Gasto"){
    let update
    if(regToexe[i].Accion === "Ingreso"){

      update = { $inc: { DineroActual: fixedImport } }
     
      }       
        else if(regToexe[i].Accion === "Gasto")
      {
        update = { $inc: { DineroActual: (fixedImport*-1) } }
    
      }

   
    await CuentasModelSass.findByIdAndUpdate(regToexe[i].CuentaSelec.idCuenta, update, {session})
    
                } else if(regToexe[i].Accion === "Trans"){
                  console.log("llegamos a trans")
                  let valornegativo = fixedImport * (-1)
                  let update = { $inc: { DineroActual: valornegativo } }
                  let update2 = { $inc: { DineroActual: fixedImport } }
             let cuentaup1 =    await   CuentasModelSass.findByIdAndUpdate(regToexe[i].CuentaSelec.idCuenta, update, {session, new:true})
             let cuentaup2 =       await   CuentasModelSass.findByIdAndUpdate(regToexe[i].CuentaSelec2.idCuenta, update2, {session, new:true})
                 
             if(cuentaup1 == null || cuentaup2 == null ){
              throw new Error(`Error en tranferencia ${regToexe[i]} ` )
            } 

                }
              }

 
}
await session.commitTransaction();
session.endSession();
return res.status(200).send({status: "Ok", message: "exeregs", registrosUpdate});


   
      
  } catch(error){
    console.log(error)
    await session.abortTransaction();
    session.endSession();
    return res.json({status: "Error", message: "error ", error });
  }

  }


  async function addCount (req, res){


    let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);
    let RegModelSass = await conn.model('Reg', regSchema);
      let CounterModelSass = await conn.model('Counter', counterSchema);
      let CatModelSass = await conn.model('Categoria', catSchema);
  
      const session = await mongoose.startSession();  
            
      session.startTransaction();
  
      try {
        const fixedImport = new mongoose.Types.Decimal128(parseFloat(req.body.valores.Dinero).toFixed(2))
  
  let cuentaActualizada = await  CuentasModelSass.create([{
    CheckedA: req.body.valores.checkedA,
    CheckedP: req.body.valores.checkedP,
    Visibility: req.body.valores.visibility,
    Tipo: req.body.valores.Tipo,
    NombreC: req.body.valores.NombreC,
    DineroActual: fixedImport,
    iDcuenta: req.body.valores.idCuenta,
    Descrip: req.body.valores.DescripC,
    Permisos:req.body.Permisos,
    LimiteCredito:req.body.valores.limiteCredito,
    FormaPago:req.body.valores.Fpago,
    Background:{Seleccionado:req.body.valores.fondo,
    urlBackGround:req.body.valores.fondoImagen,
    colorPicked:req.body.valores.colorCuenta},
    urlIcono:req.body.valores.urlIcono
  
      }], {session} )
  
   let tiempo =new Date()
  
  let catApertura = await CatModelSass.findOne({idCat:9999999}, null,{session})
  
  
  
  let datatosend={
    Accion:"Ingreso",
    Tiempo: tiempo.getTime(),
    TiempoEjecucion:tiempo.getTime(),
    IdRegistro:req.body.valores.idReg,
    CuentaSelec:{
      idCuenta:cuentaActualizada[0]._id,
      nombreCuenta: cuentaActualizada[0].NombreC,
    
    },
  
   
  
      CatSelect:{idCat:catApertura.idCat,
        urlIcono:catApertura.urlIcono,
          nombreCat:catApertura.nombreCat,
        subCatSelect:[],
      _id:catApertura._id
      },
  
      
    Descripcion:"",
    Importe:fixedImport,
    Nota:"",
    Usuario:{
      Nombre:req.body.Usuario.Usuario,
      Id:req.body.Usuario._id,
      Tipo:req.body.Usuario.Tipo,
  
    },
    FormaPago:req.body.valores.Fpago,
    LimiteCredito:req.body.valores.limiteCredito
    
  }
  
  let regApe = await RegModelSass.create([datatosend], {session})
  
    let val =  req.body.valores.idReg+ 1
    let updateCuentaval =  req.body.valores.idCuenta + 1
    let updatecounter = {  ContRegs: val, Contmascuenta: updateCuentaval }
    
   await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,{session}  )
    await session.commitTransaction();    
    session.endSession();                    
    return res.send({status: "Ok", message: "Cuenta generado", Cuenta:cuentaActualizada[0], Reg:regApe[0]  });
       }
      catch(error){
       
        await session.abortTransaction();
        session.endSession();
        return res.json({status: "Error", message: "error al registrar", error });
      }
    };
    
    async function editCount  (req,res){
      let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
      let CuentasModelSass = await conn.model('Cuenta', accountSchema);
  
      let update ={
        CheckedA: req.body.valores.checkedA,
        CheckedP: req.body.valores.checkedP,
        Visibility: req.body.valores.visibility,
        Tipo: req.body.valores.Tipo,
        NombreC: req.body.valores.NombreC,
      
        iDcuenta: req.body.valores.idCuenta,
        Descrip: req.body.valores.DescripC,
        FormaPago:req.body.valores.Fpago,
        LimiteCredito:req.body.valores.limiteCredito,
        Permisos:req.body.Permisos,
        urlIcono:req.body.valores.urlIcono,
        Background:{Seleccionado:req.body.valores.fondo,
          urlBackGround:req.body.valores.fondoImagen,
          colorPicked:req.body.valores.colorCuenta},
          urlIcono:req.body.valores.urlIcono,
      
      } 
      let options = {new:true} 
      CuentasModelSass.findByIdAndUpdate(req.body.valores.idCuentaMongo, update, options, (err,cuenta)=>{
             
        if(err) res.status(500).send({"message":"error al registrar"})
      
        res.status(200).send({cuenta})
      })
      
        }
  
        async function deleteReg (req,res){
         
          let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
          let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
          let CuentasModelSass = await conn.model('Cuenta', accountSchema);
          let RegModelSass = await conn.model('Reg', regSchema);
          let RegModelSassDelete = await conn.model('RegDelete', regSchemaDelete);
          const session = await mongoose.startSession();  
           
          session.startTransaction();
      
          try {
         let regdel = await RegModelSass.findByIdAndDelete(req.body.reg._id,{session})
        
            
         if(!regdel) throw new Error('Registro no se pudo eliminar');
         const fixedImport = new mongoose.Types.Decimal128(JSON.stringify(parseFloat(req.body.reg.Importe)))
  

         if(req.body.reg.Accion !="Trans"){
         if(req.body.reg.CatSelect.idCat == 18){

          if(req.body.reg.Descripcion2.articulosVendidos[0].Tipo =="Producto"){
            let valorIncremento = req.body.reg.Descripcion2.articulosVendidos[0].CantidadCompra  
            let update = { $inc: { Existencia: valorIncremento } }
            let artInve=   await  ArticuloModelSass.findByIdAndUpdate(req.body.reg.Descripcion2.articulosVendidos[0]._id,update,{session, new:true})  
            if(artInve == null){
              throw new Error("articulo no encontrado")
            }
            
            let updateInv = { $inc: { DineroActual:fixedImport } }
            let cuentaUpdate=  await CuentasModelSass.findByIdAndUpdate(req.body.reg.CuentaSelec.idCuenta,updateInv,{session, new:true})
           
            if(cuentaUpdate == null){
              throw new Error("Cuenta no encontrada")
            }

            await session.commitTransaction();    
            session.endSession(); 

            return res.json({status: "Ok", message: "Registro de baja Eliminado", registro:regdel, cuenta:cuentaUpdate,
               articulo:artInve})

          }
         }
        }

        let newDeleteReg={
          ...req.body.reg,
          TiempoDelete:req.body.TiempoDel,
          UsuarioDelete:req.body.UsuarioDelete
        }

        let newRegDelete = await RegModelSassDelete.create([newDeleteReg],{session})
        
          if(req.body.reg.Accion =="Ingreso" ||req.body.reg.Accion =="Gasto"  ){
            let valorvariable = req.body.reg.Accion =="Ingreso"?fixedImport* -1:
            req.body.reg.Accion =="Gasto"?fixedImport:0
            let update = { $inc: { DineroActual: valorvariable } }
            let options = {new:true, session} 
             let SelecIDcuenta = req.body.reg.CuentaSelec.idCuenta
             let cuentadel=""
             if(req.body.reg.TiempoEjecucion != 0){
          cuentadel= await CuentasModelSass.findByIdAndUpdate(SelecIDcuenta, update, options)
         if(!cuentadel) throw new Error('Valor en la cuenta no se pudo eliminar');
        }


         await session.commitTransaction();    
         session.endSession();   
  
        return res.json({status: "Ok", message: "Registro Eliminado", registro:regdel, cuenta:cuentadel,
         newRegDelete:newRegDelete[0]})
        }
  
        else if(req.body.reg.Accion =="Trans" ){
          
      let update = { $inc: { DineroActual:  fixedImport } }
      let updatenegativo = { $inc: { DineroActual:  (fixedImport*-1)  } }
      let options = {new:true,session} 
      let SelecIDcuenta = req.body.reg.CuentaSelec.idCuenta
      let SelecIDcuenta2 = req.body.reg.CuentaSelec2.idCuenta
      let cuenta1=""
      let cuenta2=""
      if(req.body.reg.TiempoEjecucion != 0){
       cuenta1= await CuentasModelSass.findByIdAndUpdate(SelecIDcuenta, update, options )
      if(!cuenta1) throw new Error('Valor en la cuenta no se pudo eliminar');
      cuenta2= await CuentasModelSass.findByIdAndUpdate(SelecIDcuenta2, updatenegativo, options )
      if(!cuenta2) throw new Error('Valor en la cuenta no se pudo eliminar');
      }
      await session.commitTransaction();    
      session.endSession();   
     return res.json({status: "Ok", message: "Transferencia Eliminado", registro:regdel, cuenta1, cuenta2,   newRegDelete:newRegDelete[0]})
        }
      
      }
       
  
         catch(error){
          console.log(error.name, error.message);
          await session.abortTransaction();
          session.endSession();
          return res.json({status: "Error", message: error.message , error });
        }
       
        }
  
    async  function deleteCount (req,res){
     
          let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
          let CuentasModelSass = await conn.model('Cuenta', accountSchema);
          let UserModelSass = await conn.model('Usuario', userModelSchema);
     
          const session = await mongoose.startSession();  
            
          session.startTransaction();
          try {
            let results = await UserModelSass.find({IDcuenta: req.body.valores._id},null,{session})
  
            if(results.length > 0)
            {
              let update = {
                IDcuenta:""
                }
              await UserModelSass.findByIdAndUpdate(results[0]._id, update,{session})
              }
  
              let Cuenta = await CuentasModelSass.findByIdAndDelete(req.body.valores._id,{session})
              if(!Cuenta)  throw new Error('Cuenta no encontrada');
            await session.commitTransaction();
            session.endSession();
            return res.send({status: "Ok", message: "cuenta Eliminada", Cuenta});
  
            }   catch(error){
              console.log(error)
              await session.abortTransaction();
              session.endSession();
              return res.json({status: "Error", message: "error al registrar", error });
            }
  
           
       
          }
  
    async function addCat (req, res, next){
          let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
          let CatModelSass = await conn.model('Categoria', catSchema);
          let CounterModelSass = await conn.model('Counter', counterSchema);
          let Counterx =   await CounterModelSass.find({iDgeneral:9999999})
          let updatee = req.body.valores
       
          CatModelSass.create({
          tipocat: updatee.tipocat,
          subCategoria: updatee.subArr,
          idCat:Counterx[0].ContadorCat,
          nombreCat:updatee.nombreCat,
          imagen:updatee.imagenes,
          urlIcono:updatee.urlIcono,
        },async (err, response)=>{
          if (err)  return res.json({status: "Error", message: "error al registrar", err });
          let updatecounter = {   $inc: { ContadorCat: 1}  }
            await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter )
          res.json({status: "Ok", message: "Categoria Creada", categoria:response});
          
  
        
        })
           
        
            }
  
   async  function editCat(req,res){
  
              let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
              let CatModelSass = await conn.model('Categoria', catSchema);
  
              let optionsx = {new:true} 
              let update ={nombreCat:req.body.valores.nombreCat,
                subCategoria:req.body.valores.subArr,
                urlIcono:req.body.valores.urlIcono,
                  imagen:req.body.valores.imagenes
              }
  
              CatModelSass.findByIdAndUpdate(req.body.Id, update, optionsx, (err,cat)=>{
               if(err) return res.json({status: "Error", message: "error al registrar", err });
            
               res.send({status: "Ok", message: "edit Cat", cat });
              })
            }
  
    async function deleteCat (req,res){
  
        let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
        let CatModelSass = await conn.model('Categoria', catSchema);
             
            CatModelSass.findByIdAndDelete(req.body.valores._id,  (err,cat)=>{
              if(err) res.json({status: "Error", message: "error al registrar", err });
          
              return res.status(200).send({status: "Cat Eliminada",Categoria:cat} )
            })
            }
  
    async function addNewTipe (req, res){
  
      let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
  
      let TiposModelSass = await conn.model('tiposmodel', tipoSchemaSass);
      let updatee = req.body.valores
      let updateval =`Tipos`
      let Tipodata = await TiposModelSass.findOne({iDtipe:9999999}, null)
  
      if (!Tipodata)  return res.json({status: "Error", message: "error al registrar" });
      let update = {$push: {[updateval] :  {
        $each: [updatee] ,
        $position: 0
      } }}
      let options = {new:true} 
  
      TiposModelSass.findByIdAndUpdate(Tipodata._id, update, options, (err,user)=>{
     
        if(err)       return res.json({status: "Error", message: "error al registrar", err });
    
        return     res.status(200).send({user})
      })
  
  
    }
  
    async function deleteTipe (req, res){
  
      let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
      let TiposModelSass = await conn.model('tiposmodel', tipoSchemaSass);
      let Tipodata = await TiposModelSass.findOne({iDtipe:9999999}, null)
      if (!Tipodata)  return res.json({status: "Error", message: "error al registrar" });
    
      let updateval =`Tipos`
      let update = {$pull: {[updateval]: req.body.valores}}
      let options = {new:true} 
      TiposModelSass.findByIdAndUpdate(Tipodata._id, update, options, (err,user)=>{
         
        if(err)  return res.json({status: "Error", message: "error al registrar", err });
     
        res.status(200).send({user})
      })
    }
  
    async function editRep(req,res){
  
      let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
      let RepModelSass = await conn.model('Repeticion', repeticionSchema);
  
      const fixedImport = new mongoose.Types.Decimal128(parseFloat(req.body.Importe).toFixed(2))
      fechaeje = req.body.TiempoExe
      if(req.body.Accion == "Ingreso" ||req.body.Accion == "Gasto" ){
        datosrep  = {
          reg: {
            Accion:req.body.Accion,   
            Tiempo:req.body.Tiempo,
         
            CuentaSelec:{idCuenta:req.body.CuentaSelect._id,
              nombreCuenta: req.body.CuentaSelect.NombreC,
           },
           CatSelect:{idCat:req.body.CatSelect.idCat,
            urlIcono:req.body.CatSelect.urlIcono,
              nombreCat:req.body.CatSelect.nombreCat,
            subCatSelect:req.body.SubCatSelect,
          _id:req.body.CatSelect._id
          },
                   
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
        
         }
  
       
        
      }else if(req.body.Accion == "Trans" ){
        datosrep  = {
          reg: {
            Accion:req.body.Accion,   
            Tiempo:req.body.Tiempo,
    
            CuentaSelec:{idCuenta:req.body.CuentaSelect1._id,
              nombreCuenta: req.body.CuentaSelect1.NombreC,
              },
    
      
            CuentaSelec2:{idCuenta:req.body.CuentaSelect2._id,
                        nombreCuenta: req.body.CuentaSelect2.NombreC,
                      },
                   
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
    
         }
      
      }
      let optionsRep = {new:true} 
     
      RepModelSass.findByIdAndUpdate(req.body.Id, datosrep,optionsRep, (err, represult)=>{
        if(err) return res.json({status: "Error", message: "error al registrar", err });
        return res.status(200).send({status: "ok",message:"Repeticion Editada",represult} )
      })
  
    }
  
    async function deleteRepeticion(req,res){
      
      let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
      let RepModelSass = await conn.model('Repeticion', repeticionSchema);
  
      RepModelSass.findByIdAndDelete(req.body.ID,  (err,repe)=>{
  
        if(err) res.status(500).send({"message":"error al eliminare el usuario"})
       
        return res.status(200).send({status: "ok",message:"Repeticion Eliminada",repe} )
      })
    }

 async function addRepeticiones(req,res){
  console.log("addRepeticiones")
 console.log(req.body)
   let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
   let CuentasModelSass = await conn.model('Cuenta', accountSchema);
   let RegModelSass = await conn.model('Reg', regSchema);
   let CounterModelSass = await conn.model('Counter', counterSchema);
   let RepeticionModelSass = await conn.model('Repeticion', repeticionSchema);
   const fixedImport = parseFloat(req.body.Importe.$numberDecimal)
   const session = await mongoose.startSession();  
      
   session.startTransaction();

   try {
    const opts2 = { session, new:true };
    const options = { session};
    let tiempoActual = new Date().getTime()
    
    let Counterx =   await CounterModelSass.find({iDgeneral:9999999},null, {session} )
    function calcularMeses(fechaInicio, fechaFin) {
      // Obtener año y mes de las fechas
    //  console.log(fechaInicio)
    //  console.log(fechaFin)
      const añoInicio = fechaInicio.getFullYear();
      const mesInicio = fechaInicio.getMonth(); // Recuerda que los meses empiezan desde 0 (enero = 0)
      
      const añoFin = fechaFin.getFullYear();
      const mesFin = fechaFin.getMonth();
  
      // Calcular la diferencia de años y meses
      const diferenciaAños = añoFin - añoInicio;
      const diferenciaMeses = mesFin - mesInicio;
  
      // Calcular el total de meses considerando el año
      const totalMeses = (diferenciaAños * 12) + diferenciaMeses;
  
      return totalMeses;
  }

        let datareg= { Accion:req.body.Accion,   
         
          IdRegistro:Counterx[0].ContRegs,
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


        let datosEspecificos 
        if(req.body.Accion === "Ingreso" || req.body.Accion === "Gasto"){
          datosEspecificos={
            CuentaSelec:{idCuenta:req.body.CuentaSelec.idCuenta,
              nombreCuenta: req.body.CuentaSelec.nombreCuenta,
           },

              CatSelect:{idCat:req.body.CatSelect.idCat,
                urlIcono:req.body.CatSelect.urlIcono,
                  nombreCat:req.body.CatSelect.nombreCat,
                subCatSelect:req.body.SubCatSelect,
                _id:req.body.CatSelect._id
              }
          }
        }else if(req.body.Accion === "Trans"){
        
          datosEspecificos={
            CuentaSelec:{idCuenta:req.body.CuentaSelec.idCuenta,
              nombreCuenta: req.body.CuentaSelec.nombreCuenta,
             },

            CuentaSelec2:{idCuenta:req.body.CuentaSelec2.idCuenta,
                        nombreCuenta: req.body.CuentaSelec2.nombreCuenta,
                        },
          }

        } 
      

                   let mesesExtra = calcularMeses(new Date(req.body.Tiempo), new Date()) + 1
                   console.log("mesesExtra" + mesesExtra)
                   console.log("tiempoServer "+new Date())
                  let fechacambio = new Date(req.body.Tiempo)
                  let  cantidadRegistros = 0 
                    if(req.body.Valrep ==="Cada Día"){      
                      let fechaconver = new Date(req.body.Tiempo)
                      
                            
                
                            for(let x=0;x<mesesExtra;x++){    }                
                                            

                                let fechapormodi = fechaconver.setMonth(fechaconver.getMonth()  )
                                let fechamodi = new Date(fechapormodi).setDate(fechaconver.getDate())
                          
                                let dateFechamodi = new Date(fechamodi)
                                var ultimoDia = new Date(dateFechamodi.getFullYear(), dateFechamodi.getMonth() + 1, 0)
                                let diaActual = dateFechamodi.getDate() 
                                let Diasestemes = ultimoDia.getDate()  - diaActual
                             
                                cantidadRegistros += Diasestemes+1
                             
                              
                            
                          

                   
                    }
                    else if(req.body.Valrep == "Cada Semana"){

                      for(let x=0;x<mesesExtra;x++){ }  
                   
                        let fechafind = new Date(req.body.Tiempo)
                        let fechaDinamica = new Date(fechafind.setMonth(fechafind.getMonth()))
                        
                        var year=fechaDinamica.getFullYear();
                        var mesdeSem= fechaDinamica.getMonth() + 1 ;
                        var dia= fechaDinamica.getDate()
                        var cantidadDias = new Date(year, mesdeSem, 0).getDate()
 
                        var diasrestantes = (cantidadDias- dia) + 1
                    
                        var repeticion = Math.ceil(diasrestantes/7)
  
                        cantidadRegistros+= repeticion
                    
                  }
                    else if(req.body.Valrep == "Cada Mes"){

                      cantidadRegistros=  mesesExtra 

                    }
                    else if(req.body.Valrep == "Cada Año"){
                 
                      cantidadRegistros= 1
                      
                    }
              
           let allCreatedRegs=[]
           
           console.log(cantidadRegistros)
                      let cuenta1 =""
                      let cuenta2=""
                    for(let i = 0; i < cantidadRegistros; i++){

                      let tiempoEXE =    0
                      let ids = parseInt(Counterx[0].ContRegs) + parseInt(i)
               
                        const  fechafija = new Date(req.body.Tiempo)
                        if(req.body.Valrep ==="Cada Día"){  
                     
                          let nuevodia = fechafija.getDate() + i   
                               
                            fechaset= fechafija.setDate(nuevodia) 
                          
                      }
                      else if(req.body.Valrep == "Cada Semana"){
                        let nuevodiasem = fechafija.getDate() + (7*i)  
                        fechacambio.setDate(nuevodiasem)   
                        fechaset= new Date(fechacambio).getTime() 

                      } else if(req.body.Valrep == "Cada Mes"){
                                 
                        let nuevomes = fechafija.getMonth() + i  
                        let diaReg = new Date(req.body.TiempoReg).getDate()                          
                        console.log(diaReg)
                        fechaset= new Date(fechacambio.setMonth(nuevomes)).setDate(diaReg)   
                         
                    
                      } else if(req.body.Valrep == "Cada Año"){
                        let nuevoanio = fechafija.getFullYear() + i                            
                        fechacambio.setFullYear(nuevoanio)   
                        fechaset= new Date(fechacambio).getTime() 

                      }
                                          
                      
                     
                    
                      if(fechaset <= tiempoActual ){
                   
                    let update =""
                  
                    tiempoEXE = req.body.Tiempo
                    
                    let valornegativo = fixedImport * (-1)
                  
                    if(req.body.Accion === "Ingreso"){
                      update = { $inc: { DineroActual: fixedImport } }
                     
                    }
                    else if(req.body.Accion === "Gasto"){
                   update = { $inc: { DineroActual: valornegativo } }
                    }   

                    else if(req.body.Accion === "Trans"){
                       update = { $inc: { DineroActual: valornegativo } }
                      let update2 = { $inc: { DineroActual: fixedImport } }
                       cuenta2 = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelec2.idCuenta, update2, opts2)
                      if( cuenta2 == null){
                        throw new Error("Cuentas no Encontradas en trans repeticion, Contacte a soporte")
                      } 
                     
                    }
                    
                    cuenta1 = await CuentasModelSass.findByIdAndUpdate(req.body.CuentaSelec.idCuenta, update, opts2)
                    
                    if(cuenta1 == null ){
                      throw new Error("Cuentas no Encontradas en trans repeticion, Contacte a soporte")
                    } 
                    
                       }

       
                    const resultreg = await  RegModelSass.create([
                      { 
                        ...datareg,
                        ...datosEspecificos,
                      Tiempo:fechaset,
                      TiempoEjecucion:tiempoEXE,
                      IdRegistro:ids,
                      Descripcion:req.body.Descripcion+"Repetición "+req.body.Valrep,
           
                  }], opts2)

                allCreatedRegs.push(resultreg[0])

                    if(i === (cantidadRegistros-1)){
                  
                      let fechaeje = 0
                      let fechaRep = new Date()
                    
                      if(req.body.Valrep == "Cada Semana" ){
                        
                        let ultimafecha =new Date(fechaset)

                        let setdia = ultimafecha.setDate(ultimafecha.getDate() + 7)
                  
                        let sethora =new Date(setdia).setHours(0,5,0)
    
                        fechaeje = sethora
                      }else if(  req.body.Valrep ==="Cada Mes" ){
                        let setmes = fechaRep.setMonth(fechaRep.getMonth() + 1)
                        let setdia = new Date(setmes).setDate(1)
                        let sethora =new Date(setdia).setHours(0,5,0)
                        fechaeje = sethora
                      }else if(  req.body.Valrep ==="Cada Día" ){
   
                        let setmes = fechaRep.setMonth(fechaRep.getMonth() + 1)
                        let sethora =new Date(setmes).setHours(0,5,0)
                        let setdia = new Date(sethora).setDate(1)
                                       
    
                        fechaeje = setdia
                      }  else if(req.body.Valrep == "Cada Año" ){
            
                        let setyear = fechaRep.setFullYear(fechaRep.getFullYear() + 1)
                        let setdia = new Date(setyear).setDate(1)
                       let sethora =new Date(setdia).setHours(0,5,0)
                       
                       fechaeje = sethora
                       }

                       let update3 = {fechaEjecucion: fechaeje }

                       let resultrep= await RepeticionModelSass.findByIdAndUpdate(req.body.Repid, update3, opts2 )
                       if(resultrep == null){
                        throw new Error("rep no Encontradas, vuelva intentar en unos minutos")
                      }

                      
                      let val = resultreg[0].IdRegistro + 1
                      let updatecounter = {  ContRegs: val  }
                      let idDataReg = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,opts2 )
                      await session.commitTransaction();    
                      session.endSession();                 
                      return res.send({status: "Ok", message: "repeticiones generadas ADD",cuenta1,cuenta2, repUpdate:resultrep, registrosGenerados:allCreatedRegs  });
                      
                    }

                    }//fin del for
                 
   }
   catch(error){
    console.log(error)
    await session.abortTransaction();
  
    session.endSession();
    return res.json({status: "Error", message: "error al registrar", error });
  }




}




 async  function getRegs (req, res){
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let RegModelSass = await conn.model('Reg', regSchema);
    let regsHabiles = await RegModelSass.find()
    res.status(200).send({status: "Ok", message: "getRegs", regsHabiles});
  
  }
  async function getRegsTime (req, res) {
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let RegModelSass = await conn.model('Reg', regSchema);
    let regsHabiles= []
    let regs1= []
    let regs2= []
    console.log(req.body)
    if(req.body.diario){
      console.log(req.body.tiempo)
      console.log(new Date(req.body.tiempo))
      let tiempoIni = new Date(req.body.tiempo).setHours(0,0,0,0);
      let tiempoFin =new Date(req.body.tiempo).setHours(23,59,59,999);
      console.log(tiempoIni)
      console.log(tiempoFin)
      regsHabiles = await RegModelSass.find({
        $and: [
          {Tiempo: {$gte : tiempoIni}},
          {Tiempo: {$lte : tiempoFin}},
         
        ]
      })
    

    }else if(req.body.mensual){
      let fechamensual = new Date(req.body.tiempo);
      let tiempoIni = new Date(fechamensual.getFullYear(), fechamensual.getMonth(), 1).setHours(0,0,0,0);
      let tiempoFin = new Date(fechamensual.getFullYear(), fechamensual.getMonth() + 1, 0).setHours(23,59,59,999);
      regsHabiles = await RegModelSass.find({
        $and: [
          {Tiempo: {$gte : tiempoIni}},
          {Tiempo: {$lte : tiempoFin}},
         
        ]
      })
    

    }else if(req.body.periodo){
      let tiempoIni = new Date(req.body.tiempoperiodoini).setHours(0,0,0,0);
      let tiempoFin =new Date(req.body.tiempoperiodofin).setHours(23,59,59,999);
      regsHabiles = await RegModelSass.find({
        $and: [
          {Tiempo: {$gte : tiempoIni}},
          {Tiempo: {$lte : tiempoFin}},
         
        ]
      })
    

    }
    
    return res.status(200).send({status: "Ok", message: "getTimeRegs", regsHabiles});
  }
  async function getCuentasRegs (req, res) {

let conn = await mongoose.connection.useDb(req.body.User.DBname);
let RegModelSass = await conn.model('Reg', regSchema);
let regsHabiles= []
let regs1= []
let regs2= []
console.log(req.body)
if(req.body.mensual){
  let fechamensual = new Date(req.body.tiempo);
  let tiempoIni = new Date(fechamensual.getFullYear(), fechamensual.getMonth(), 1).setHours(0,0,0,0);
  let tiempoFin = new Date(fechamensual.getFullYear(), fechamensual.getMonth() + 1, 0).setHours(23,59,59,999);
  console.log(tiempoIni)
  console.log(tiempoFin)

  regs1 = await RegModelSass.find({
    $and: [
      {Tiempo: {$gte : tiempoIni}},
      {Tiempo: {$lte : tiempoFin}},
      {"CuentaSelec.idCuenta": req.body.cuentaid},
    ]
  })

  regs2 = await RegModelSass.find({
    $and: [
      {Tiempo: {$gte : tiempoIni}},
      {Tiempo: {$lte : tiempoFin}},
      {"CuentaSelec2.idCuenta": req.body.cuentaid},
    ]
  })
  
 

   regsHabiles = regs1.concat(regs2)
  


}


return res.status(200).send({status: "Ok", message: "getCuentasRegs", regsHabiles});


  }

   async function getMontRegs (req, res) {
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let RegModelSass = await conn.model('Reg', regSchema);
 

    let fechamensual = new Date(req.body.tiempo);
    
     let tiempoIni = new Date(fechamensual.getFullYear(), fechamensual.getMonth(), 1).setHours(0,0,0,0);
      let tiempoFin = new Date(fechamensual.getFullYear(), fechamensual.getMonth() + 1, 0).setHours(23,59,59,999);
    

      let regsHabiles = await RegModelSass.find({
        $and: [
          {Tiempo: {$gte : tiempoIni}},
          {Tiempo: {$lte : tiempoFin}}
        ]
      }).sort({ $natural: -1 })
    
      return res.status(200).send({status: "Ok", message: "getMontRegs", regsHabiles});
    
  }


  async  function getTipos (req, res){
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let TiposModelSass = await conn.model('tiposmodel', tipoSchema);
    let tiposHabiles = await TiposModelSass.find({})
    res.status(200).send({status: "Ok", message: "getTipos", tiposHabiles});
  
  }
    
  async function getRCR(req, res){
    
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let TiposModelSass = await conn.model('tiposmodel', tipoSchema);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema); 
  
  
   
    let cuentasHabiles = await CuentasModelSass.find({Permisos:req.body.User.Tipo}).sort({ $natural: -1 })

    let tiposHabiles = await TiposModelSass.find({})  
    
  
  
    res.status(200).send({status: "Ok", message: "maindata", cuentasHabiles,tiposHabiles});
    }

  async function getRCR2(req, res){
    
  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  
  let CatModelSass = await conn.model('Categoria', catSchema); 
   let CounterModelSass = await conn.model('Counter', counterSchema);
   let RepModelSass = await conn.model('Repeticion', repeticionSchema);
   let contadoresHabiles = await CounterModelSass.find({iDgeneral:9999999})
   let repsHabiles = await RepModelSass.find()
   let catHabiles = await CatModelSass.find()
  res.status(200).send({status: "Ok", message: "getRCR2",contadoresHabiles, repsHabiles,catHabiles});
  }
  async function getArmoextraData(req, res){
    
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let DistribuidorModelSass = await conn.model('Distribuidor', distriSchema);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema); 
    let CounterModelSass = await conn.model('Counter', counterSchema);
    let allCuentasHabiles = await CuentasModelSass.find({})
    let contadoresHabiles = await CounterModelSass.find({})
    let distriHabiles = await DistribuidorModelSass.find({})

    res.status(200).send({status: "Ok", message: "getArmoextraData",contadoresHabiles, allCuentasHabiles,distriHabiles});
    }

async function getMainData(req, res){
 

  let conn = await mongoose.connection.useDb(req.body.User.DBname);

  let CuentasModelSass = await conn.model('Cuenta', accountSchema); 
  let CounterModelSass = await conn.model('Counter', counterSchema);
  let CatModelSass = await conn.model('Categoria', catSchema); 
  let DistribuidorModelSass = await conn.model('Distribuidor', distriSchema);
  let ComprasModelSass = await conn.model('Compra', comprasSchema);
  let VentaModelSass = await conn.model('Venta', ventasSchema);
  let ClienteModelSass = await conn.model('Cliente', clientSchema);
  let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
  let TiposModelSass = await conn.model('tiposmodel', tipoSchema);
  let RegModelSass = await conn.model('Reg', regSchema);
  let RepModelSass = await conn.model('Repeticion', repeticionSchema);

  let articulosHabiles = await ArticuloModelSass.find({})
  let contadoresHabiles = await CounterModelSass.find({})
  let distriHabiles = await DistribuidorModelSass.find({})
  
  let cuentasHabiles = await CuentasModelSass.find({Permisos:req.body.User.Tipo}).sort({ $natural: -1 })
  let catHabiles = await CatModelSass.find({})
  let tiposHabiles = await TiposModelSass.find({})
  let regsHabiles = await RegModelSass.find({})
  let repsHabiles = await RepModelSass.find({})
  
  let clientesHabiles = await ClienteModelSass.find({})
  let allCuentasHabiles = await CuentasModelSass.find({}).sort({ $natural: -1 })
  
let comprasHabiles = await ComprasModelSass.find({})
let ventasHabiles = await VentaModelSass.find({})
  
  res.status(200).send({status: "Ok", message: "maindata", comprasHabiles,ventasHabiles,distriHabiles,cuentasHabiles, catHabiles, tiposHabiles,regsHabiles,repsHabiles, contadoresHabiles,articulosHabiles,clientesHabiles,allCuentasHabiles});
  }

  async function getCuentaslim(req, res){
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);  
    let cuentasHabiles = await CuentasModelSass.find({Permisos:req.body.User.Tipo}).sort({ $natural: -1 })
    res.status(200).send({status: "Ok", message: "cuentdata",cuentasHabiles });
  }
  async function getCuentasyCats(req, res){
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let CatModelSass = await conn.model('Categoria', catSchema); 
 
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);  
    let catHabiles = await CatModelSass.find({})
    let cuentasHabiles = await CuentasModelSass.find({Permisos:req.body.User.Tipo}).sort({ $natural: -1 })
    res.status(200).send({status: "Ok", message: "getCuentasyCats",cuentasHabiles, catHabiles});
  }
  async function getInvs(req, res){
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);  
    let cuentasHabiles = await CuentasModelSass.find({Tipo:"Inventario"})
    res.status(200).send({status: "Ok", message: "cuentdata",cuentasHabiles });
  }

  async function getVentasHtml(req, res){
    console.log(req.body)
   let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let VentaModelSass = await conn.model('Venta', ventasSchema);
let ventasHabiles = await VentaModelSass.findById(req.body.datos._id)
res.status(200).send({status: "Ok", message: "venddata",ventasHabiles });
} 

  async function getVentasByTime(req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let VentaModelSass = await conn.model('Venta', ventasSchema);
let tiempoIni
let tiempoFin

if(req.body.dataTime.diario){

  tiempoIni =new Date(req.body.dataTime.tiempo).setHours(0,0,0,0);
  tiempoFin =new Date(req.body.dataTime.tiempo).setHours(23,59,59,999);

}else if(req.body.dataTime.mensual){
  let fechamensual = new Date(req.body.dataTime.tiempo);
   tiempoIni =new Date( new Date(fechamensual.getFullYear(), fechamensual.getMonth(), 1)).setHours(0,0,0,0);
   tiempoFin = new Date( new Date(fechamensual.getFullYear(), fechamensual.getMonth() + 1, 0)).setHours(23,59,59,999);
  
  
}else if(req.body.dataTime.periodo){
  tiempoIni =new Date(req.body.dataTime.tiempo).setHours(0,0,0,0);
  tiempoFin =new Date(req.body.dataTime.tiempoperiodofin).setHours(23,59,59,999);
}


    let ventasHabiles = await VentaModelSass.find({
      $and: [
        {tiempo: {$gte : tiempoIni}},
        {tiempo: {$lte : tiempoFin}}
      ]
    }).sort({ $natural: -1 }).select("-Html")
   
    res.status(200).send({status: "Ok", message: "venddata",ventasHabiles });
  }
  async function getVentas(req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let VentaModelSass = await conn.model('Venta', ventasSchema);
    let ventasHabiles = await VentaModelSass.find().sort({ $natural: -1 }).select("-Html");
    res.status(200).send({status: "Ok", message: "venddata",ventasHabiles });
  }
  async function getCompras(req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let ComprasModelSass = await conn.model('Compra', comprasSchema);
 
    let comprasHabiles = await ComprasModelSass.find().sort({ $natural: -1 }).limit(50)
    res.status(200).send({status: "Ok", message: "venddata",comprasHabiles });
  }
  async function getAllCompras(req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let ComprasModelSass = await conn.model('Compra', comprasSchema);
 
    let comprasHabiles = await ComprasModelSass.find().sort({ $natural: -1 })
    res.status(200).send({status: "Ok", message: "venddata",comprasHabiles });
  }
  async function getArts(req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
    let articulosHabiles = await ArticuloModelSass.find()
 
    res.status(200).send({status: "Ok", message: "getarts", articulosHabiles})
 
  }

  async function getPartData2(req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let TiposModelSass = await conn.model('tiposmodel', tipoSchema);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);  
    let CatModelSass = await conn.model('Categoria', catSchema); 
    let RegModelSass = await conn.model('Reg', regSchema);
    let ClienteModelSass = await conn.model('Cliente', clientSchema);

    let cuentasHabiles = await CuentasModelSass.find({Permisos:req.body.User.Tipo}).sort({ $natural: -1 })
    let tiposHabiles = await TiposModelSass.find({})
    let regsHabiles = await RegModelSass.find({})
    let catHabiles = await CatModelSass.find({})
    let clientesHabiles = await ClienteModelSass.find({})
    let allCuentasHabiles = await CuentasModelSass.find({}).sort({ $natural: -1 })
    res.status(200).send({status: "Ok", message: "maindata", cuentasHabiles,tiposHabiles,regsHabiles,catHabiles,clientesHabiles,allCuentasHabiles})
 
  }
  async function getPartData3(req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
  
    
    let RepModelSass = await conn.model('Repeticion', repeticionSchema);
    let CounterModelSass = await conn.model('Counter', counterSchema);
   let DistribuidorModelSass = await conn.model('Distribuidor', distriSchema);
   
    let VentaModelSass = await conn.model('Venta', ventasSchema);

    let ComprasModelSass = await conn.model('Compra', comprasSchema);
let comprasHabiles = await ComprasModelSass.find({})
  let ventasHabiles = await VentaModelSass.find({})
    let contadoresHabiles = await CounterModelSass.find({})
    let distriHabiles = await DistribuidorModelSass.find({})
    let repsHabiles = await RepModelSass.find({})
 


    res.status(200).send({status: "Ok", message: "maindata",comprasHabiles,ventasHabiles,contadoresHabiles,distriHabiles,repsHabiles, })
 
  }

  async function getCuentas(req, res){
    let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);

   let cuentasgen = await CuentasModelSass.find({Permisos:req.body.Usuario.Tipo}).sort({ $natural: -1 })
    
    res.json({status: "Ok", message: "cuentas", cuentasgen});
  }

  async function getCuentaRegs(req, res){
    
  let cuentas1 =[]
  let cuentas2 =[]
  let rutafind = "CuentaSelec.idCuenta"
  let rutafind2 = "CuentaSelec2.idCuenta"
  let conn = await mongoose.connection.useDb(req.body.User.DBname);
  let RegModelSass = await conn.model('Reg', regSchema);

  RegModelSass.find({[rutafind]:req.body.cuentaid},(err, cuentasgen)=>{
      if (err) console.log(err)
      
      RegModelSass.find({[rutafind2]:req.body.cuentaid},(err, cuentasgen2)=>{
        if (err) console.log(err)
        const arrayt = cuentasgen.concat(cuentasgen2);
  
        res.json({status: "Ok", message: "cuentas", arrayt});
      })
    })
  
  }

  function getTipoCuentas (req, res){

    Tipomodel.find({},(err, cuenta)=>{
  
if(err) console.log(err)


res.status(200).send({cuenta})
})

  }
    function getCat (req, res){
    Catmodel.find({},(err, categorias)=>{
  
      if(err) console.log(err)
      
      
      res.status(200).send({categorias})
      })
  }

  function getRepeticiones(req, res){

    Repeticion.find({},(err, rep)=>{
      
      if(err) console.log(err)
    
      
      res.status(200).send({rep})
      })
  
  }

 
 
 async function findCuenta(req,res){
    let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);
    CuentasModelSass.findById(req.body.idcuenta,(err, cuenta)=>{
      if (err)res.json({status: "Error", message: "error al registrar", err });

      res.json({status: "Ok", message: "cuenta encontrada", cuenta});
    })

  }


  
  async function generarFact(req,res){
    let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);

   

    text = "<factura id='comprobante' version='1.0.0'>" +
    "<infoTributaria>" +
    " <razonSocial>Daniel Flor</razonSocial>" +
    "  <nombreComercial></nombreComercial> "+
    "</infoTributaria>" +
    "</factura>";
    

    const doc = new DOMParser().parseFromString(text, 'text/xml')


  }


     async function generarVenta(req,res){
   

   
       let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
       let CuentasModelSass = await conn.model('Cuenta', accountSchema);
       let RegModelSass = await conn.model('Reg', regSchema);
       let CounterModelSass = await conn.model('Counter', counterSchema);
       let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
       let VentaModelSass = await conn.model('Venta', ventasSchema);
       let CatModelSass = await conn.model('Categoria', catSchema);
    
       const session = await mongoose.startSession();   
       session.startTransaction();
     

     try{
      let data = req.body
      let catGasInv=  await CatModelSass.find({idCat:19}, null,{session, new:true} )
      let catIngInv=  await CatModelSass.find({idCat:data.iDCating}, null,{session, new:true} )
     
      
       let findIdReg = await CounterModelSass.find({iDgeneral:9999999}, null,{session})
       let arrRegs = []
       let arrRegsSend = []
       let arrArtsUpdate = []
       let arrCuentas = []
      let counterRegs = 0
       let getCuentasInv = data.ArticulosVendidos.map(x=> x.Bodega_Inv)
    
       let sinRepetidos = getCuentasInv.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);

       for(let x=0;x<sinRepetidos.length;x++){

        let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:parseInt(sinRepetidos[x])}, null,{session, new:true} )
       
        let getArtsInv = data.ArticulosVendidos.filter((a)=> a.Bodega_Inv == sinRepetidos[x])

        let valorinvertido = 0
        for(let j=0;j<getArtsInv.length;j++){
         
          if(getArtsInv[j].Tipo == "Producto"){
            let findArt = await ArticuloModelSass.findById(getArtsInv[j]._id, null,{session})
            if(findArt == null ){
              throw new Error("Articulo no encontrado, vuelva a iniciar sesion ")
            }

            let cantidadCompra = getArtsInv[j].CantidadCompra
            if(findArt.Existencia < cantidadCompra){
             throw new Error(`Cantidad insuficiente del item ${findArt.Titulo}`)
            }
            let update = { $inc: { Existencia: getArtsInv[j].CantidadCompra * -1 } }

            let artModi2 = await  ArticuloModelSass.findByIdAndUpdate(getArtsInv[j]._id, update,{session, new:true})
            if(artModi2 == null ){
              throw new Error("Articulo no modificado, vuelva intentar en unos minutos")
            }

            arrArtsUpdate.push(artModi2)
           
            valorinvertido += parseFloat((cantidadCompra * getArtsInv[j].Precio_Compra))
          
          
          }
        }

        const fixedImportgas = new mongoose.Types.Decimal128(parseFloat(valorinvertido).toFixed(2))
        let gasInv= { Accion:"Gasto",   
        Tiempo:req.body.Tiempo,
        TiempoEjecucion:req.body.Tiempo,
        IdRegistro:findIdReg[0].ContRegs + counterRegs,
      
        CuentaSelec:{idCuenta:idCuentaInv[0]._id,
          nombreCuenta: idCuentaInv[0].NombreC,
         
          },
      
          CatSelect:{idCat:catGasInv[0].idCat,
            urlIcono:catGasInv[0].urlIcono,
            nombreCat:catGasInv[0].nombreCat,
            subCatSelect:catGasInv[0].subCatSelect,
            _id:catGasInv[0]._id,
          },
        Nota:"Precio-de-Compra Inventario // Venta Física N°"+findIdReg[0].ContVentas ,
        Descripcion2:{articulosVendidos:getArtsInv},
        Estado:false,
        urlImg:[],
        Valrep:"No",
        TipoRep:"",
        Importe:fixedImportgas,
        Usuario:{
          Nombre:"Sistema",
          Id:"999999",
          Tipo:"Sistema",
      
        }
        }
        let updateGas = { $inc: { DineroActual: fixedImportgas * -1 } }
   
        let reg1 =  await RegModelSass.create([gasInv], {session} )
        if(reg1[0] == null){
          throw new Error("No se pudo crear el registro, intente despues")
        }
        counterRegs += 1
        arrRegs.push(reg1[0]._id)
        arrRegsSend.push(reg1[0])
        let cuenta1  = await CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id,updateGas,{session, new:true})
        if(cuenta1 == null ){
          throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
        } 
        arrCuentas.push(cuenta1)
      }
         for(let i=0; i<data.FormasPago.length;i++){
   
    
           const fixedImport = new mongoose.Types.Decimal128(parseFloat(data.FormasPago[i].Cantidad).toFixed(2))
           let datareg= {
          
             Documento:data.Doctype,
             Accion:"Ingreso",   
           Tiempo:data.Tiempo,
           TiempoEjecucion:req.body.Tiempo,
           IdRegistro:findIdReg[0].ContRegs  + counterRegs ,
         
           CuentaSelec:{idCuenta:data.FormasPago[i].Cuenta._id,
                        nombreCuenta: data.FormasPago[i].Cuenta.NombreC,
                      },
         
                      CatSelect:{
                        idCat:catIngInv[0].idCat,
                       urlIcono:catIngInv[0].urlIcono,
                       nombreCat:catIngInv[0].nombreCat,
                       subCatSelect:catIngInv[0].subCatSelect,
                       _id:catIngInv[0]._id,
                  
                     },
         
           Nota:"Venta N°"+ findIdReg[0].ContVentas+" / "+ data.FormasPago[i].Tipo,
           Descripcion:data.FormasPago[i].Detalles,
           Descripcion2:{articulosVendidos:data.ArticulosVendidos},
           Estado:false,
           urlImg:[],
           Valrep:"",
           TipoRep:"No",
           Importe:fixedImport,
           Usuario:{
             Nombre:data.Vendedor.Nombre,
             Id:data.Vendedor.Id,
             Tipo:data.Vendedor.Tipo,
              
           }}
           let update = { $inc: { DineroActual: fixedImport } }
           let reg2 =  await RegModelSass.create([datareg],{session})
           if(reg2[0] == null){
            throw new Error("No se pudo crear el registro, intente despues")
          }
          counterRegs += 1
           arrRegs.push(reg2[0]._id)
           arrRegsSend.push(reg2[0])
           let options = {new:true, session} 
          let cuentaModi = await CuentasModelSass.findByIdAndUpdate(data.FormasPago[i].Cuenta._id, update, options)
          if(cuentaModi == null){
            throw new Error(`No se pudo modificar la cuenta,${cuentaModi.NombreC} intente despues`)
          }
          arrCuentas.push(cuentaModi)
           }
                  
       let dataventa = {
         arrRegs,
         FactAutorizacion:data.numeroAuto,
         FactFechaAutorizacion:data.fechaAuto,
         ClaveAcceso:data.ClaveAcceso,
         Secuencial:data.secuencial,
         Doctype:data.Doctype,
         iDVenta: findIdReg[0].ContVentas,
         iDRegistro: findIdReg[0].ContRegs,
         idCliente: data.UserId,
         nombreCliente: data.UserName,
         telefonoCliente:data.Telefono,
         correoCliente:data.Correo,
         direccionCliente:data.Direccion,
         cedulaCliente:data.Cedula,
         ciudadCliente:data.Ciudad,
         formasdePago:data.FormasPago,
         articulosVendidos:data.ArticulosVendidos,
         tiempo:data.Tiempo,
         PrecioCompraTotal:data.SuperTotal,
         valorDescuento:data.TotalDescuento,
         TipoVenta:"Contado",
         Vendedor:data.Vendedor,
         IvaEC:data.IvaEC,
         baseImponible:data.baseImponible,
         Estado:data.Estado,
         Html:data.html
       }
     
       let ventac = await VentaModelSass.create([dataventa],{session})
    
       if(ventac[0] == null){
        throw new Error(`No se pudo generar la venta`)
        }
    
        let comprobadorSecuencial = data.Doctype == "Factura-Electronica"?{ ContSecuencial:parseInt(data.secuencial) + 1}:{};
    
      
           let adicionador  = counterRegs + findIdReg[0].ContRegs + 1
          
           let updateCounterVenta = { ContRegs:adicionador,
                              $inc: { ContVentas: 1, },
                           ...comprobadorSecuencial
                                    }
   
   
   await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updateCounterVenta,{session} )
   res.json({status: "Ok", message: "Venta generada", VentaGen: ventac, Articulos:arrArtsUpdate,Cuentas:arrCuentas,arrRegsSend});
   if(req.body.Correo != ""){
    
   pdf.create(req.body.html, {
   
   border: {
       top: "0px",            // default is 0, units: mm, cm, in, px
       right: "0px",
       bottom: "0px",
       left: "0px"
     },
     childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toBuffer((err, buffer) => {
   
      if (err) {console.log(err); throw new Error("error al crear pdf")}
       var transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           
                 user: 'iglassmailer2020@gmail.com',
                 pass: process.env.REACT_MAILER_PASS,
            
       
         }
       })
       let subjectstingFactura = `Factura Electrónica ${req.body.allData.nombreComercial} Nº ${req.body.allData.estab}${req.body.allData.ptoEmi}-${req.body.allData.secuencial}  `;
       let subjectstingNota = `Nota de Venta ${req.body.allData.nombreComercial} Nº ${findIdReg[0].ContVentas}  `;
       
       let subjectsting = data.Doctype == "Factura-Electronica"?subjectstingFactura:subjectstingNota
      
       
       let adjuntosFactura = [
       {
           filename: `${req.body.allData.nombreComercial}-${req.body.secuencial}.pdf`, // <= Here: made sure file name match
           content: buffer,
           contentType: 'application/pdf'
       },
       {
         filename: `${req.body.allData.nombreComercial}-${req.body.secuencial}.xml`, // <= Here: made sure file name match
         content: Buffer.from(req.body.xmlDoc),
         contentType: 'application/xml'
     },
   
   ]
   
   let adjuntosNota = [
    {
        filename: `${req.body.allData.nombreComercial}-${findIdReg[0].ContVentas}.pdf`, // <= Here: made sure file name match
        content: buffer,
        contentType: 'application/pdf'
    },
   

]

let adjuntos = data.Doctype == "Factura-Electronica"?adjuntosFactura:adjuntosNota
   
       let textstingdevFactura =
       `<table width="90%" border="1">
       <tbody>
       <tr>
       <td align="center">Estimad@ informamos que su comprobante electronico ha sido emitido exitosamente</td>
       </tr>
       </tbody>
       </table>
       <table width="90%" border="0" cellpadding="0" cellspacing="5">
       <tbody>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       <tr>
       <th align="right">Razón Social:</th>
       <td>${req.body.allData.razon}</td>
       </tr>
       <tr>
       <th align="right">RUC:</th>
       <td>${req.body.allData.ruc}</td>
       </tr>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       <tr>
       <th align="right">Cliente:</th>
       <td>${req.body.allData.razonSocialComprador}</td>
       </tr>
       <tr>
       <th align="right">Identificaci&oacute;n Cliente:</th>
       <td>${req.body.allData.identificacionComprador}</td>
       </tr>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       <tr>
       <th align="right">Ambiente:</th>
       <td>Produccion</td>
       </tr>
       <tr>
       <th align="right">Tipo de Comprobante:</th>
       <td>Factura</td>
       </tr>
       <tr>
       <th align="right">Fecha de Emisi&oacute;n:</th>
       <td>${req.body.allData.fechaAuto}</td>
       </tr>
       <tr>
       <th align="right">Nro. de Comprobante:</th>
       <td>${req.body.allData.estab}${req.body.allData.ptoEmi}-${req.body.allData.secuencial}</td>
       </tr>
       <tr>
       <th align="right">Valor Total:</th>
       <td>${parseFloat(req.body.allData.SuperTotal).toFixed(2)}</td>
       </tr>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       <tr>
       <th align="right">Nro. Autorizacion SRI:</th>
       <td>${req.body.allData.numeroAuto}</td>
       </tr>
       <tr>
       <th align="right">Clave de Acceso:</th>
       <td>${req.body.allData.ClaveAcceso}</td>
       </tr>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       </tbody>
       </table>
       <table width="90%" border="1">
       <tbody>
       <tr>
       <td align="center">Documento Generado por Contalux S.A 2024</td>
       </tr>
       </tbody>
       </table>`
       let textstingdevNota =
       `<table width="90%" border="1">
       <tbody>
       <tr>
       <td align="center">Estimad@ informamos que su comprobante electronico ha sido emitido exitosamente</td>
       </tr>
       </tbody>
       </table>
       <table width="90%" border="0" cellpadding="0" cellspacing="5">
       <tbody>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       <tr>
       <th align="right">Razón Social:</th>
       <td>${req.body.allData.razon}</td>
       </tr>
       <tr>
       <th align="right">RUC:</th>
       <td>${req.body.allData.ruc}</td>
       </tr>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       <tr>
       <th align="right">Cliente:</th>
       <td>${req.body.allData.razonSocialComprador}</td>
       </tr>
       <tr>
       <th align="right">Identificaci&oacute;n Cliente:</th>
       <td>${req.body.allData.identificacionComprador}</td>
       </tr>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       <tr>
       <th align="right">Ambiente:</th>
       <td>Produccion</td>
       </tr>
       <tr>
       <th align="right">Tipo de Comprobante:</th>
       <td>Nota de Venta</td>
       </tr>
       <tr>
       
       </tr>
       <tr>
       <th align="right">Nro. de Comprobante:</th>
       <td>${findIdReg[0].ContVentas}</td>
       </tr>
       <tr>
       <th align="right">Valor Total:</th>
       <td>${parseFloat(req.body.allData.SuperTotal).toFixed(2)}</td>
       </tr>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       <tr>
     
       </tr>
       <tr>
     
  
       </tr>
       <tr>
       <th align="right"></th>
       <td></td>
       </tr>
       </tbody>
       </table>
       <table width="90%" border="1">
       <tbody>
       <tr>
       <td align="center">Documento Generado por Contalux S.A 2022</td>
       </tr>
       </tbody>
       </table>`
       let textstingdev = data.Doctype == "Factura-Electronica"?textstingdevFactura:textstingdevNota 
       if(req.body.allData.Estado == "EN PROCESO"){
   
         subjectsting = `Comprobante temporal ${req.body.allData.nombreComercial} Nº ${req.body.allData.estab}${req.body.allData.ptoEmi}-${req.body.allData.secuencial}  `;
   
         textstingdev = `<table width="90%" border="1">
         <tbody>
         <tr>
         <td align="center">Estimad@ su factura se encuentra proceso, con prontitud se le enviara la autorizada</td>
         </tr>
         </tbody>
         </table>`
   
         adjuntos =  [
           {
               filename: `${req.body.allData.nombreComercial}-${req.body.allData.secuencial}.pdf`, // <= Here: made sure file name match
               content: buffer,
               contentType: 'application/pdf'
           },
         
   
       ]
   
       }   
       var mailOptions = {
         from: 'iglassmailer2020@gmail.com',
         to: req.body.Correo,
         subject: subjectsting,
         html: textstingdev,
         attachments: adjuntos
       }
       
       transporter.sendMail(mailOptions, function (err, res) {
         if(err){
          if (err) {console.log(err)}
         } else {
             console.log('Email Sent');
         }
       })
   
     });
   }
   
   
   await session.commitTransaction();
   session.endSession();
   
   
   
    
         }
     catch(error){
         await session.abortTransaction();
         session.endSession();
         console.log(error, "errr")
         return res.json({status: "Error", message: error.name, error:error.message });
       }
   
     }
 async function generarCredito(req,res){
 console.log(req.body)
    let conn = await mongoose.connection.useDb(req.body.Userdata.DBname);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);
    let RegModelSass = await conn.model('Reg', regSchema);
    let CounterModelSass = await conn.model('Counter', counterSchema);
    let ArticuloModelSass = await conn.model('Articulo', ArticuloSchema);
    let VentaModelSass = await conn.model('Venta', ventasSchema);
    let CatModelSass = await conn.model('Categoria', catSchema);

const session = await mongoose.startSession();   
  session.startTransaction();
  try{
    let catGasInv=  await CatModelSass.find({idCat:19}, null,{session, new:true} )
    let catIngInv=  await CatModelSass.find({idCat:20}, null,{session, new:true} )
    let data = req.body
   
    let findIdReg = await CounterModelSass.find({iDgeneral:9999999}, null,{session})
   
    let arrRegs = []
    let arrRegsSend = []
    let arrArtsUp = []
    let arrCuentas =[]

    let getCuentasInv = data.ArticulosVendidos.map(x=> x.Bodega_Inv)
    let counterRegs = 0
    let sinRepetidos = getCuentasInv.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
    for(let x=0;x<sinRepetidos.length;x++){
      let idCuentaInv  =  await CuentasModelSass.find({iDcuenta:parseInt(sinRepetidos[x])}, null,{session, new:true} )
      let getArtsInv = data.ArticulosVendidos.filter((a)=> a.Bodega_Inv == sinRepetidos[x])
      
      let valorinvertido = 0
        for(let j=0;j<getArtsInv.length;j++){
          if(getArtsInv[j].Tipo == "Producto"){
            let findArt = await ArticuloModelSass.findById(getArtsInv[j]._id, null,{session})
            if(findArt == null ){
              throw new Error("Articulo no encontrado, vuelva a iniciar sesion ")
            }
            let cantidadCompra = getArtsInv[j].CantidadCompra
            if(findArt.Existencia < cantidadCompra){
             throw new Error(`Cantidad insuficiente del item ${findArt.Titulo}`)
            }

            let update = { $inc: { Existencia: getArtsInv[j].CantidadCompra * -1 } }
         
            valorinvertido += getArtsInv[x].Precio_Compra * cantidadCompra
      
      let artModi2 = await  ArticuloModelSass.findByIdAndUpdate(getArtsInv[j]._id, update,{session,new:true})
      if(artModi2 == null ){
        throw new Error("Articulo no modificado, vuelva intentar en unos minutos")
      }
      arrArtsUp.push(artModi2)
      valorinvertido += parseFloat((cantidadCompra * getArtsInv[j].Precio_Compra))
      }
        }
        const fixedImportGas = new mongoose.Types.Decimal128(parseFloat(valorinvertido).toFixed(2))
        let gasInv= { Accion:"Gasto",   
        Tiempo:req.body.Tiempo,
        TiempoEjecucion:req.body.Tiempo,
        IdRegistro:findIdReg[0].ContRegs + counterRegs,
        CuentaSelec:{idCuenta:idCuentaInv[0]._id,
          nombreCuenta: idCuentaInv[0].NombreC,
         
          },
      
          CatSelect:{idCat:catGasInv[0].idCat,
            urlIcono:catGasInv[0].urlIcono,
            nombreCat:catGasInv[0].nombreCat,
            subCatSelect:catGasInv[0].subCatSelect,
            _id:catGasInv[0]._id,
          },
    
      
        Nota:"Precio-de-Compra Inventario // Venta N°"+findIdReg[0].ContVentas,
        Descripcion:"",
         Descripcion2:{articulosVendidos:getArtsInv,},
        Estado:false,
        urlImg:[],
        Valrep:"No",
        TipoRep:"",
        Importe:fixedImportGas,
        Usuario:{
          Nombre:req.body.Vendedor.Nombre,
          Id:req.body.Vendedor.Id,
          Tipo:req.body.Vendedor.Tipo,
      
        }
        }
        let updateGas = { $inc: { DineroActual: fixedImportGas * -1 } }
        let reg2 =  await RegModelSass.create([gasInv], {session} )
        counterRegs += 1
        arrRegs.push(reg2[0]._id)
        
        let cuenta1 =  await CuentasModelSass.findByIdAndUpdate(idCuentaInv[0]._id, updateGas,{session, new:true})
        if(cuenta1 == null ){
          throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
        } 
        arrCuentas.push(cuenta1)
      }

    const fixedImport = new mongoose.Types.Decimal128(parseFloat(data.SuperTotal).toFixed(2))

  

    let datareg= {
      Documento:data.Doctype,
      Accion:"Ingreso",   
    Tiempo:data.Tiempo,
    TiempoEjecucion:req.body.Tiempo,
    IdRegistro:findIdReg[0].ContRegs + counterRegs,
    
    CuentaSelec:{idCuenta:data.UserIdCuenta,
                 nombreCuenta: data.UserName,
              },
    
              CatSelect:{
                idCat:catIngInv[0].idCat,
               urlIcono:catIngInv[0].urlIcono,
               nombreCat:catIngInv[0].nombreCat,
               subCatSelect:catIngInv[0].subCatSelect,
               _id:catIngInv[0]._id,
          
             },
    
    Nota:"Crédito de la Venta N°"+ findIdReg[0].ContVentas,
    Descripcion:"",
    Descripcion2:{articulosVendidos:data.ArticulosVendidos,},
    Estado:false,
    urlImg:[],
    Valrep:"",
    TipoRep:"No",
    Importe:fixedImport,
    Usuario:{
      Nombre:data.Vendedor.Nombre,
      Id:data.Vendedor.Id,
      Tipo:data.Vendedor.Tipo,
    
    }
    }

  
    let regcreado = await  RegModelSass.create([datareg], {session})
    counterRegs += 1
    arrRegs.push(regcreado[0]._id)
    arrRegsSend.push(regcreado[0])
    let creditoNegativo = fixedImport * (-1)

    let updateCuenta = { $inc: { LimiteCredito: creditoNegativo, DineroActual: fixedImport }  }

    let cuentaup =   await CuentasModelSass.findByIdAndUpdate(data.UserIdCuenta, updateCuenta,{session, new:true})
    if(cuentaup == null ){
      throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
    } 
    arrCuentas.push(cuentaup)
let idExtra = 0
   
    
  let dataCred = []
    if(data.Cuotainicial > 0){
      dataCred.push(data.Fcredito[0])
      let fixedcuota = parseFloat(parseFloat(data.Fcredito[0].Cantidad).toFixed(2))
      idExtra = 1
      let dataregCuota= {
        Documento:data.Doctype,
        Accion:"Trans",   
      Tiempo:data.Tiempo,
      TiempoEjecucion:data.Tiempo,
      IdRegistro:findIdReg[0].ContRegs + 1,
      
      CuentaSelec:{idCuenta:data.UserIdCuenta,
        nombreCuenta: data.UserName,
       },

      CuentaSelec2:{idCuenta:data.Fcredito[0].Cuenta._id,
                   nombreCuenta: data.Fcredito[0].Cuenta.NombreC,
                },  
   
    
      Nota:"Abono de Venta N°"+ findIdReg[0].ContVentas,
      Descripcion:data.Fcredito[0].Detalles,
      Descripcion2:{articulosVendidos:data.ArticulosVendidos,},
      Estado:false,
      urlImg:[],
      Valrep:"",
      TipoRep:"No",
      Importe:fixedcuota,
      Usuario:{
        Nombre:data.Vendedor.Nombre,
        Id:data.Vendedor.Id,
        Tipo:data.Vendedor.Tipo,
    
      }
    }
    let regcreadoCuota = await RegModelSass.create([dataregCuota],{session})

    let valornegativo = fixedcuota * (-1)

    let update = { $inc: { DineroActual: fixedcuota} }
    let update2 = { $inc: { DineroActual: valornegativo } }
    let cuenta1 =  await CuentasModelSass.findByIdAndUpdate(data.Fcredito[0].Cuenta._id, update,{session})
    let cuenta2 =   await CuentasModelSass.findByIdAndUpdate(data.UserIdCuenta, update2,{session})
 
  
    if(cuenta1 == null || cuenta2 == null){
      throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
    } 
   
    arrCuentas.push(cuenta1)
    arrCuentas.push(cuenta2)
    arrRegs.push(regcreadoCuota[0]._id)
    arrRegsSend.push(regcreadoCuota[0])
    }



    let creditoC = await VentaModelSass.create([{
      arrRegs,
      iDVenta: findIdReg[0].ContVentas,
      idCliente: data.UserId,
      iDRegistro:findIdReg[0].ContRegs,
      nombreCliente: data.UserName,
      telefonoCliente:data.Telefono,
      correoCliente:data.Correo,
      direccionCliente:data.Direccion,
      cedulaCliente:data.Cedula,
      ciudadCliente:data.Ciudad,
      FormasCredito:dataCred,
      articulosVendidos:data.ArticulosVendidos,
      tiempo:data.Tiempo,
      valorDescuento:data.TotalDescuento,
      PrecioCompraTotal:fixedImport,
      TipoVenta:"Credito",
      CuentaCredito:data.UserIdCuenta,
      CreditoTotal:fixedImport,
      Vendedor:data.Vendedor,
      IvaEC:data.IvaEC,
      baseImponible:data.baseImponible,
    
      Html:data.html
    }], {session})


   
   
      
    let updateCounterVenta = { ContRegs:  findIdReg[0].ContRegs + counterRegs + 1,      
      $inc: { ContVentas: 1, }
    }

await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updateCounterVenta,{session} )
      res.status(200).send({message:"Credito generado", creditoC, arrRegsSend,Cuentas:arrCuentas,Articulos:arrArtsUp})    
      await session.commitTransaction();
      session.endSession();
  
    


  } catch(error){
      await session.abortTransaction();
      session.endSession();
      console.log(error, "errr")
      return res.json({status: "Error", message: "error al registrar", error });
    }

  }
  async function addCierreCaja(req,res){

    let conn = await mongoose.connection.useDb(req.body.Usuario.DBname);
    const session = await mongoose.startSession();  
    let CounterModelSass = await conn.model('Counter', counterSchema);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);
    let RegModelSass = await conn.model('Reg', regSchema);
      
    session.startTransaction();
    try {
      const opts2 = { session, new:true };
      const opts = { session};

let findIdReg = await CounterModelSass.find({iDgeneral:9999999})

      const result = await RegModelSass.create([{
        Accion:"Trans",   
        Tiempo:req.body.Tiempo,
        TiempoEjecucion:req.body.Tiempo,
        IdRegistro:findIdReg[0].ContRegs,
    
        CuentaSelec:{idCuenta:req.body.CuentaSelect1._id,
                    nombreCuenta: req.body.CuentaSelect1.NombreC,
                   },
    
    
        CuentaSelec2:{idCuenta:req.body.CuentaSelect2._id,
                      nombreCuenta: req.body.CuentaSelect2.NombreC,
                      },
    
    
        Nota:req.body.Nota,
        Descripcion:req.body.Descripcion,
        Estado:false,
     
       
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
    
      if(cuenta1 == null || cuenta2 == null){
        throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
      } 
      let updatecounter = { $inc: { ContRegs: 1 } }
      let idDataReg = await CounterModelSass.findOneAndUpdate({iDgeneral:9999999}, updatecounter,opts2 )
      
      await session.commitTransaction();
      session.endSession();
      res.status(200).send({message:"Transferencia genereda", Reg:result})


    }
    catch(error){
      console.log(error)
      await session.abortTransaction();
    
      session.endSession();
      return res.json({status: "Error", message: "error al registrar", error });
    }

  }
  async function deleteTiemporegs(req,res){
   
    let conn = await mongoose.connection.useDb("MauricioTeran-28751");
    let RegModelSass = await conn.model('Reg', regSchema);
    let regUp =  await  RegModelSass.find({})

    let tiempo = new Date()
    let sethora =new Date(tiempo).setHours(0,5,0)
   let setdia = new Date(sethora).setDate(18)



   regUp.forEach(async (item)=>{
    //console.log(new Date(item.Tiempo))

 
    if(item.Tiempo > setdia){

      let regis= await RegModelSass.findById(item._id) 

await regis.remove()
    
    }

   })
    res.json({status: "Ok", message: "regs"});


  }
  async function profesorAdd(req,res){

  }
  async function getRegsbyCuentas(req,res){

let conn = await mongoose.connection.useDb(req.body.User.DBname);
let RegModelSass = await conn.model('Reg', regSchema);


let fechamensual = new Date();
  let tiempoIni = new Date(fechamensual.getFullYear(), fechamensual.getMonth(), 1).setHours(0,0,0,0);
  let tiempoFin = new Date(fechamensual.getFullYear(), fechamensual.getMonth() + 1, 0).setHours(23,59,59,999);

req.body.Cuentas.forEach(async (x,i)=>{
  let regsHabiles= []
  let captureRegs=await RegModelSass.find({
    $and: [
      {Tiempo: {$gte : tiempoIni}},
      {Tiempo: {$lte : tiempoFin}},
      {"CuentaSelec.idCuenta": x._id},
    ]
  }).sort({ $natural: -1 })

  regsHabiles = [...regsHabiles, ...captureRegs]
  
  if((i+1)==req.body.Cuentas.length ){
    res.status(200).send({status: "Ok", message: "getRegsbyCuentas", regsHabiles});
  }

})





  }
  async function getAllReps(req, res){
    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let RepModelSass = await conn.model('Repeticion', repeticionSchema);
    let repsHabiles = await RepModelSass.find()
    res.status(200).send({status: "Ok", message: "allreps",repsHabiles});
  }
  async function addAbono(req, res){

    let conn = await mongoose.connection.useDb(req.body.User.DBname);
    let VentaModelSass = await conn.model('Venta', ventasSchema);
    let CounterModelSass = await conn.model('Counter', counterSchema);
    let CuentasModelSass = await conn.model('Cuenta', accountSchema);
    let RegModelSass = await conn.model('Reg', regSchema);
    const session = await mongoose.startSession();   
    session.startTransaction();
    try{
    
    let findIdReg = await CounterModelSass.find({iDgeneral:9999999}, null,{session})
    let arrRegs = []
  
    let arrpagos = []

    for(let i = 0; i< req.body.valstate.Fpago.length;i++){
      let pagos = req.body.valstate.Fpago[i]
      
      const fixedImport = new mongoose.Types.Decimal128(parseFloat(pagos.Cantidad).toFixed(2))
      let datareg= {
        Documento:"Reg",
        Accion:"Trans",  
      Tiempo:req.body.valstate.Tiempo,
      TiempoEjecucion:req.body.valstate.Tiempo,
      IdRegistro:findIdReg[0].ContRegs + i,
        CuentaSelec:{idCuenta:req.body.valoresCompra.CuentaCredito,
        nombreCuenta: req.body.valoresCompra.nombreCliente,
       },
      CuentaSelec2:{idCuenta:pagos.Cuenta._id,
                   nombreCuenta: pagos.Cuenta.NombreC,
                },      

      
      Nota:"Abono del Crédito N°"+ req.body.valoresCompra.iDVenta ,
      Descripcion:pagos.Detalles,
      Descripcion2:{articulosVendidos:req.body.valoresCompra.ArticulosVendidos,},
      Estado:false,
      urlImg:[],
      Valrep:"",
      TipoRep:"No",
      Importe:fixedImport,
      Usuario:{
        Nombre:req.body.valoresCompra.Vendedor.Nombre,
        Id:req.body.valoresCompra.Vendedor.Id,
        Tipo:req.body.valoresCompra.Vendedor.Tipo,
      
      }
      }  
      let regcreadoCuota = await RegModelSass.create([datareg],{session})
     
      let valornegativo = fixedImport * (-1)

      let update = { $inc: { DineroActual: fixedImport} }
      let update2 = { $inc: { DineroActual: valornegativo } }

    let cuenta1 =  await CuentasModelSass.findByIdAndUpdate(pagos.Cuenta._id, update,{session})
    let cuenta2 = await CuentasModelSass.findByIdAndUpdate(req.body.valoresCompra.CuentaCredito, update2,{session})
      arrRegs.push(regcreadoCuota[0]._id)
   
      if(cuenta1 == null || cuenta2 == null){
        throw new Error("Cuentas no Encontradas, vuelva intentar en unos minutos")
      } 


let dataArr = {...pagos, Tiempo:req.body.valstate.Tiempo}
arrpagos.push(dataArr)
    }    

 
 
    let getVenta =await VentaModelSass.findById(req.body.valoresCompra._id, null,{session})

    if(getVenta == null){
    
        throw new Error("No se pudo encontrar la venta, intente despues")
      
    }

let nuevosFC = getVenta.FormasCredito.concat(arrpagos)
    getVenta.FormasCredito = nuevosFC
    let nuevosRegs = getVenta.arrRegs.concat(arrRegs)  
    getVenta.arrRegs = nuevosRegs

    let updateCredito = await getVenta.save()

   
    res.status(200).send({status: "Ok", message: "addAbono ok", updateCredito,});
    await session.commitTransaction();
    session.endSession();
}catch(error){
  await session.abortTransaction();
  session.endSession();
  console.log(error, "errr")
  return res.json({status: "Error", message: "error al registrar", error });
}

 //   let updateVenta  = await getVenta.save()

    


  }



module.exports = {getVentasHtml,getRegsTime,getRegsbyCuentas,exeRegs,getMontRegs,getCuentasRegs,getInvs,addAbono,getAllReps,getCuentasyCats,getVentas,getVentasByTime,getAllCompras,getArmoextraData,getCompras,getTipos,getRCR2,deleteTiemporegs,getCuentaslim,getPartData3,getArts,getPartData2,addCierreCaja,profesorAdd, generarFact, getRCR,getMainData,findCuenta,generarCredito, generarVenta, editCat, editRep, deleteRepeticion, getRepeticiones,editCount,addCount,getCuentas,getTipoCuentas, addNewTipe,deleteTipe,deleteCount,deleteCat,addReg,getRegs,getCuentaRegs, addCat,getCat,editReg,deleteReg, addRepeticiones};