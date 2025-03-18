import Autosuggest from 'react-autosuggest';
import "../../styles/autosugest.css"
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
        suggestions: []
      };    
    }
   
    componentDidMount(){
      this.loadFromLocalStorage()
    }
    loadFromLocalStorage=(state)=>{
 
      try{
    
    const serializedState = localStorage.getItem("puntoVenta")
    
    if(serializedState === null) return undefined
        
    let parsedState = JSON.parse(serializedState)
 
    if(parsedState.UserSelect){
   
      this.setState({value:parsedState.usuario})
    }
   

  
      } catch(e){
        
        return undefined
      }
    }
    renderSuggestion=(suggestion) => {

      return (
        <span key={suggestion._id} className="customsuggest" onClick={()=>{this.props.sendClick(suggestion)
                            this.setState({ value: '',
                            suggestions: []})
        }}>{suggestion.Usuario}</span>
      );
    }
    onChange = (event, { newValue, method }) => {
      this.setState({
        value: newValue
      });

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
        value:"",
        suggestions: []
      });
    };
  
    render() {
      console.log(this.state)
      const { value, suggestions } = this.state;
      const inputProps = {
        placeholder: this.props.placeholder,
        value,
        onChange: this.onChange
      };
  
      return (
      <div className="contSuggester">
     
<Autosuggest 



suggestions={suggestions}
onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
onSuggestionsClearRequested={this.onSuggestionsClearRequested}
getSuggestionValue={getSuggestionValue}
renderSuggestion={this.renderSuggestion}
inputProps={inputProps} />



<button type="button" className="btn btn-outline-danger"
onClick={()=>{

  this.setState({value:""})
  this.props.resetData()

}


}
>X</button>

<style >{` 
.customsuggest{
  width: 100%;
}

`}</style>
      </div>
    
      );
    }
  }
  
 
  export default Suggestioncompo