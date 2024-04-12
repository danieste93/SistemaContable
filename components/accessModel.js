import React, { Component } from 'react'
import postal from 'postal';
import {connect} from 'react-redux';

import { Animate } from 'react-animate-mount/lib/Animate';

import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

 class accessPuntoVenta extends Component {
 
     state={

     }
  
     componentDidMount(){
      

     }
 
render(){
  

    return(  <div style={{marginTop:"10vh"}} > 


     <style jsx>
                {                              
                ` 
                ` } </style>

    </div>)
}
}
const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
  export default connect(mapStateToProps, null)(accessPuntoVenta);