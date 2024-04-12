
            let razon = "Flor Pantoja Daniel Esteban"
            let nombreComercial = "iGlass"
            let ruc = "1726365727001"
            let codDoc = "01"
            let estab ="001"
            let ptoEmi= "001"
            let secuencial="000000005"
            let dirMatriz="Av.Eloy Alfaro N47 y Mortiños "         
            let dirEstablecimiento="v.Eloy Alfaro N47 y Mortiños "
            let obligadoContabilidad ="NO"
            let tipoIdentificacionComprador = "07" // 04--ruc  05--cedula  06--pasaporte  07-VENTA A CONSUMIDOR FINAL  08--IDENTIFICACION DELEXTERIOR*//
            let razonSocialComprador ='CONSUMIDOR FINAL'
            let identificacionComprador ="9999999999999"
            let direccionComprador = "alamos y aripos"
            let totalSinImpuestos = SubTotal.toFixed(2)
            let totalDescuento ="0.00"
            let codigo ="2" //IVA:2 ICE:3 IRBPNR:5
            let codigoPorcentaje ="2" // 0:0%  2:12%  3:14%
            let baseImponible =  SubTotal.toFixed(2)
            let valorIVA = IvaEC.toFixed(2)
            let propina ="0.00"
            let importeTotal= SuperTotal.toFixed(2)
            let ambiente = "1"
            let serie = "001001"
            let codNum ="12345678"//8 digitos
            let tiempo = new Date()    
            let mes = this.addCero(tiempo.getMonth()+1)
            let dia = this.addCero(tiempo.getDate())
            var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
            let fechaEmision =date
            let fechaEmision2 = "2022-10-11T20:03:14-05:00"
            let tipoEmision  = "1"
            let claveAcceso = dia+""+mes+""+tiempo.getFullYear()+""+codDoc+""+ruc+""+ambiente+""+serie+""+secuencial+""+codNum+""+tipoEmision
            console.log(claveAcceso)

            let digVerificador =(claveAcceso)=>{

                let suma = 0
                let fact = 2
                for (let i =0;i<claveAcceso.length;i++){
                    suma += claveAcceso[i] * fact
                    if(fact == 7){
                        fact = 2
                    }else{
                        fact++
                    }
                }

                let dv = (11-(suma%11))
                if(dv ==10){
                    return 1
                }else if(dv ==11 ){
                    return 0
                }else{
                    return dv
                }



            }


            let digitoverificador = digVerificador(claveAcceso)
            let clavefinal = claveAcceso +""+digitoverificador
            console.log(clavefinal)
            let xmlgenerator = 
            
            "<?xml version='1.0' encoding='UTF-8'?>"+
            "<factura id='comprobante' version='1.0.0'>" +
            "<infoTributaria>" +
            `<ambiente>${ambiente}</ambiente>` +
            `<tipoEmision>${tipoEmision}</tipoEmision>`+
            `<razonSocial>${razon}</razonSocial>`+
            `<nombreComercial>${nombreComercial}</nombreComercial>`+
            `<ruc>${ruc}</ruc>`+
            `<claveAcceso>${clavefinal}</claveAcceso>`+        
            `<codDoc>${codDoc}</codDoc>`+
            `<estab>${estab}</estab>`+
            `<ptoEmi>${ptoEmi}</ptoEmi>`+
            `<secuencial>${secuencial}</secuencial>`+
            `<dirMatriz>${dirMatriz}</dirMatriz>`+
            "<contribuyenteRimpe>CONTRIBUYENTE RÉGIMEN RIMPE</contribuyenteRimpe>"+
            `</infoTributaria>`+

            `<infoFactura>`+
            `<fechaEmision>${fechaEmision}</fechaEmision>`+
            `<dirEstablecimiento>${dirEstablecimiento}</dirEstablecimiento>`+
            `<obligadoContabilidad>${obligadoContabilidad}</obligadoContabilidad>`+
            `<tipoIdentificacionComprador>${tipoIdentificacionComprador}</tipoIdentificacionComprador>`+
            `<razonSocialComprador>${razonSocialComprador}</razonSocialComprador>`+
            `<identificacionComprador>${identificacionComprador}</identificacionComprador>`+
          //  `<direccionComprador>${direccionComprador}</direccionComprador>`+

            `<totalSinImpuestos>${totalSinImpuestos}</totalSinImpuestos>`+
            ` <totalDescuento>${totalDescuento}</totalDescuento>`+
            `<totalConImpuestos>`+
            `<totalImpuesto>`+
            `<codigo>${codigo}</codigo>`+
            `<codigoPorcentaje>${codigoPorcentaje}</codigoPorcentaje>`+
            `<baseImponible>${baseImponible}</baseImponible>`+
            `<tarifa>12.00</tarifa>`+
            `<valor>${valorIVA}</valor>`+
            `</totalImpuesto>`+
            `</totalConImpuestos>`+
            `<propina>${propina}</propina>`+
            `<importeTotal>${importeTotal}</importeTotal>`+
            `<moneda>DOLAR</moneda>`+
            "<pagos>"+
            "<pago>"+
            "<formaPago>01</formaPago>"+
            `<total>${importeTotal}</total>`+
           "</pago>"+
           "</pagos>"+
            `</infoFactura>`+

            `<detalles>`+
           this.gendetalles()+
           `</detalles>`+
            "</factura>"
            ;
      
             let newxml=    xmlgenerator.replace(/\r\n/g, '\n')
             console.log(newxml)