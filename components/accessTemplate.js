import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import {connect} from 'react-redux';
class AcessBlog extends Component {
    state={}
    componentDidMount(){

    }
render(){
    return (
        <div style={{marginTop:"60px"}}>  

<style >
{`

`}
            </style>
        </div> 
    )
}
}

const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
  export default connect(mapStateToProps, null)(AcessBlog);