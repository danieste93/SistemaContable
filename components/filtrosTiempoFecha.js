
const DiaryFilter=(regs)=>{
    let fecha = new Date()
   
            let fechaini = fecha.setHours(0, 0, 0)- 650
            console.log(fechaini)
            console.log(new Date(fechaini))
            let fechafin = fecha.setHours(23, 59, 59)
           
            if(regs.length >0){
              let misregs = regs.filter(regs=> regs.Tiempo >= fechaini && regs.Tiempo <= fechafin  )
              return misregs
            }else{
              return regs
            }
  }

export { DiaryFilter  };