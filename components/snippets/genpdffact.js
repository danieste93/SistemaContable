
        let dataexample3 = {
            numeroAuto:0,
             fechaAuto:"",
             secuencial:"",
               SuperTotal:20,                                           
               TotalDescuento:"",
               IvaEC:22.40,
               fechaEmision:"",
               nombreComercial:"iGlass S.A.",
               dirEstablecimiento:"",
               baseImponible:18,
               Doctype: this.state.doctype,
                UserId: this.state.id,
                razon:this.props.state.userReducer.update.usuario.user.Factura.razon ,
                ruc:this.props.state.userReducer.update.usuario.user.Factura.ruc,
                estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab,
                ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
                secuencial:this.ceroMaker(this.state.secuencialGen),
                obligadoContabilidad :this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
                rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?"CONTRIBUYENTE RÉGIMEN RIMPE":"",
                razonSocialComprador:this.state.UserSelect?this.state.usuario:'CONSUMIDOR FINAL',
                identificacionComprador:this.state.UserSelect?this.state.cedula:'9999999999999',
                direccionComprador:this.state.UserSelect?this.state.direccion:'',
                ArticulosVendidos:this.state.ArtVent,
                             
                
                 Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname} , 
                 Estado:"EN PROCESO"
             };
           this.EnviarFactura(dataexample3)