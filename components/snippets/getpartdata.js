  getPartData=()=>{
   
    let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                        Tipo: this.props.state.userReducer.update.usuario.user.Tipo}}
    let lol = JSON.stringify(datos)
    let settings = {
      method: 'POST', // or 'PUT'
      body: lol, // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        "x-access-token": this.props.state.userReducer.update.usuario.token
      }
    }
    fetch("/cuentas/getpartdata1", settings).then(res => res.json())
    .catch(error => {console.error('Error:', error);
           })
    .then(response => {  
      console.log(response)
      if(response.status == 'error'){}
    else if(response.status == 'Ok'){
      console.log("resArts")
      this.props.dispatch(getArts(response.articulosHabiles.reverse()));
    }

    })
    .then(res =>{
      fetch("/cuentas/getpartdata2", settings).then(res => res.json())
      .catch(error => {console.error('Error:', error);
             })
      .then(response => {  
        console.log(response)
        if(response.status == 'error'){}
      else if(response.status == 'Ok'){

        this.props.dispatch(gettipos(response.tiposHabiles));
        this.props.dispatch(getcuentas(response.cuentasHabiles)); 
        this.props.dispatch(getcats(response.catHabiles)); 
        this.props.dispatch(getClients(response.clientesHabiles));
        this.props.dispatch(addFirstRegs(response.regsHabiles)); 
        this.props.dispatch(getAllcuentas(response.allCuentasHabiles));
      }
  
      })
      .then(res =>{
        fetch("/cuentas/getpartdata3", settings).then(res => res.json())
        .catch(error => {console.error('Error:', error);
               })
        .then(response => {  
          console.log(response)
          if(response.status == 'error'){
            
          }
        else if(response.status == 'Ok'){
          this.props.dispatch(getCounter(response.contadoresHabiles[0]));
          this.props.dispatch(getCompras(response.comprasHabiles));
          this.props.dispatch(getVentas(response.ventasHabiles.reverse()));       
          this.props.dispatch(getDistribuidor(response.distriHabiles)); 
          this.props.dispatch(getRepeticiones(response.repsHabiles)); 

        }
    
        })
      } )
    } )
         
        

    }