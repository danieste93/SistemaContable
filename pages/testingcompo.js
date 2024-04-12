import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Animate } from "react-animate-mount";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import CryptoJS from "crypto-js";
import Forge  from 'node-forge';
import Head from 'next/head';
class purdata extends Component {



    componentDidMount(){

    }
  

    render() {
        
        const handleClose = (event, reason) => {
            let AleEstado = this.state.Alert
            AleEstado.Estado = false
            this.setState({Alert:AleEstado})
           
        }
        const Alert=(props)=> {
            return <MuiAlert elevation={6} variant="filled" {...props} className="uper" />;
          }

          return(
            <div className='contPanelCuentas' style={{marginTop:"15vh"}}>
             
                 <button className='facdata'onClick={()=>{this.downloadFirmData()}}> but</button>
     <style jsx>    {`
     
     `}

     </style>
            </div>

          )

    }


}



const mapStateToProps = state => {


    return {state}
  };
  
  
  export default connect(mapStateToProps)(purdata)