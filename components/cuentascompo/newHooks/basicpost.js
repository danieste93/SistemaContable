sendSearch=()=>{
    let datatosend = JSON.stringify({  
      Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
      ...this.state
      })
         
  
  
   let url = "/public/sendSearch"   
  fetch(url, {
  method: 'POST', // or 'PUT'
  body: datatosend, // data can be `string` or {object}!
  headers:{
   'Content-Type': 'application/json',
   "x-access-token": this.props.state.userReducer.update.usuario.token
  }
  }).then(res => res.json()).then(response =>{
   console.log(response)
  
  
   
    
  })
  }