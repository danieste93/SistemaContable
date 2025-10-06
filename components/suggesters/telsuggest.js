import Autosuggest from 'react-autosuggest';


import React from "react"
import {Filter} from"../filtros/filtro"

  
// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function getSuggestions(value, props) {
    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');
const returned = props.filter(language => regex.test(language.titulo));


 const filtrores = Filter(props, escapedValue)

 
    return filtrores
  }
  
  function getSuggestionValue(suggestion) {
    return suggestion.titulo;
  }

  
  class Suggestioncompo extends React.Component {
    constructor() {
      super();

      this.state = {
        value: '',
        suggestions: []
      };    
    }
    
 renderSuggestion=(suggestion) => {
   
      return (
        <span onClick={this.props.sendClick}  >{suggestion.titulo}</span>
      );
    }
    onChange = (event, { newValue, method }) => {
      this.setState({
        value: newValue
      });

      this.props.getvalue(newValue)
    };
    
    onSuggestionsFetchRequested = ({ value }) => {
   
      this.setState({
        suggestions: getSuggestions(value, this.props.modelos )
      });
    };
  
    onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: []
      });
    };
  
    render() {
    
      const { value, suggestions } = this.state;
      const inputProps = {
        placeholder: "Escribe el modelo",
        value,
        onChange: this.onChange
      };
  
      return (
        <Autosuggest 



          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps} />
      );
    }
  }
  
 
  export default Suggestioncompo