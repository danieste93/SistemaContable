if(registrosElegidos.length > 0){
 
  let misregsing = registrosElegidos.filter(regsing => regsing.Accion == "Ingreso")
  
  if(misregsing.length > 0){
    for (let i=0; i < misregsing.length; i++ ){
      sumaingbalance +=  misregsing[i].Importe
  }
}
let misregsgas = registrosElegidos.filter(regsgas => regsgas.Accion == "Gasto")


  if(misregsgas.length > 0){
  for (let i=0; i < misregsgas.length; i++ ){

       sumagasbalance += misregsgas[i].Importe
   
     }
    } 

  let misregstrans = registrosElegidos.filter(regstrans => regstrans.Accion == "Trans")

if(misregstrans.length > 0){
for (let i=0; i < misregstrans.length; i++ ){

if(this.state.cuentaSelect._id ==  misregstrans[i].CuentaSelec.idCuenta){
sumatransgasbalance +=   misregstrans[i].Importe

}
else if(this.state.cuentaSelect._id ==  misregstrans[i].CuentaSelec2.idCuenta){
sumatransingbalance +=   misregstrans[i].Importe
} 
}


}




ingbalance= (sumaingbalance +sumatransingbalance).toFixed(2)
  gasbalance=(sumagasbalance+sumatransgasbalance).toFixed(2)


  
 
}