import Autosuggest from 'react-autosuggest';
import "../../styles/autosugestux.css"
import {connect} from 'react-redux';
import React from "react"

import { Animate } from "react-animate-mount";
  
// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function getSuggestions(value, props) {
    console.log(value)
        
    if (value === '') {
      return [];
    }

let userFilter = props.filter(x=> x.Usuario.toLowerCase().includes(value.toLowerCase()))

    return userFilter
  }
  
  function getSuggestionValue(suggestion) {
    return suggestion.Usuario;
  }

  
  class Suggestioncompo extends React.Component {
    constructor() {
      super();

      this.state = {
        value: '',
        suggestions: [],
        UserSelect:false
      };    
    }
   
    componentDidMount(){
      this.loadFromLocalStorage()

      if(this.props.clientData){
console.log(this.props)
        this.setState({UserSelect:this.props.clientData.UserSelect})
 
      if(this.props.clientData.usuario != "Consumidor Final"){
        this.setState({value:this.props.clientData.usuario})
      }

      
      }

    }

 componentDidUpdate(prevProps) {
  console.log(this.props)
    // Verifica si clientData cambió
    if (
      this.props.clientData !== prevProps.clientData &&
      this.props.clientData &&
      this.props.clientData.usuario === "Consumidor Final"
    ) {
      // Acción específica cuando el usuario es "Consumidor Final"
      console.log("Es Consumidor Final");
   this.setState({
        value: "",
          UserSelect:false
      });
      // Aquí puedes ejecutar cualquier lógica adicional
     
    }
  }

    loadFromLocalStorage=(state)=>{
 
      try{
    
    const serializedState = localStorage.getItem("puntoVenta")
    
    if(serializedState === null) return undefined
        
    let parsedState = JSON.parse(serializedState)
 
    if(parsedState.UserSelect){
   if(parsedState.usuario != "Consumidor Final"){
 this.setState({value:parsedState.usuario, UserSelect:true})

   }
     
    }
   

  
      } catch(e){
        
        return undefined
      }
    }
    renderSuggestion=(suggestion) => {

      return (
        <span key={suggestion._id} className="customsuggest" 
        
        onClick={()=>{
          
          this.props.sendClick(suggestion)
                  
          this.setState({
          
                            UserSelect:true,
                            suggestions: []})
        }}>{suggestion.Usuario}</span>
      );
    }
    onChange = (event, { newValue, method }) => {
      if(!this.state.UserSelect){
      this.setState({
        value: newValue
      });
}
     // this.props.getvalue(newValue)
    //  this.props.resetPagination()
    };
    
    onSuggestionsFetchRequested = ({ value }) => {
   
      this.setState({
        suggestions: getSuggestions(value, this.props.sugerencias)
      });
    };
  
    onSuggestionsClearRequested = () => {
      this.setState({
        
        suggestions: []
      });
    };
  
    render() {
      console.log(this.state)
      let activeCliente = this.state.UserSelect?  "active":""
      const { value, suggestions } = this.state;
      const inputProps = {
        placeholder: this.props.placeholder,
        value,
        onChange: this.onChange
      };
  
      return (
      <div 
      className={`contSuggester ${activeCliente}`}
      
      >
     
<Autosuggest 

suggestions={suggestions}
onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
onSuggestionsClearRequested={this.onSuggestionsClearRequested}
getSuggestionValue={getSuggestionValue}
renderSuggestion={this.renderSuggestion}
inputProps={inputProps} />

<div style={{width:"30px"}}>
<Animate show={this.state.UserSelect}>
<button type="button" className="btn btn-outline-danger botoncont"
onClick={()=>{

  this.setState({value:"",UserSelect:false})
  this.props.resetData()

}


}
>x</button>
</Animate>
</div>
<style >{` 
.botoncont{

    display: flex;
    height: 20px;
    width: 20px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    background: red;
    color: white;
    border-bottom: 2px solid black;
}
    .react-autosuggest__container {
    position: relative;
    border-radius: 6px;
    border: 0;
    box-shadow: 0px 3px 7px #418fe2;
    margin: 5px ;
}
.customsuggest{
  width: 100%;
 
}
  .contSuggester{
  display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 15px;
    background: white;
     transition:1s
  }
  .active{
  background:#3c8ae0ba}

`}</style>
      </div>
    
      );
    }
  }
  
 
  export default Suggestioncompo