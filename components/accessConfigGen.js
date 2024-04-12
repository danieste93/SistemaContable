import React, { Component } from 'react'
import postal from 'postal';
import {connect} from 'react-redux';

import { Animate } from 'react-animate-mount/lib/Animate';


import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

 class accessPuntoVenta extends Component {
 
     state={

      tiempo: new Date(),
     }
     channel1 = null;
     componentDidMount(){


     }
   
render(){
 

    return(  <div style={{marginTop:"10vh"}} > 
En Congif

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