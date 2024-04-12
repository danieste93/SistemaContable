import Autosuggest from 'react-autosuggest';
import "../../styles/autosugest.css"
import {connect} from 'react-redux';
import React from "react"
import {Filter,Searcher} from"../../components/filtros/filtroeqid"

  
// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function getSuggestions(value, props) {
    console.log(value)
        
    if (value === '') {
      return [];
    }



const Search = Searcher(props, value)


 


    return Search
  }
  
  function getSuggestionValue(suggestion) {
    return suggestion.Titulo;
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
        <span  onClick={this.props.sendClick}>{suggestion.Titulo}</span>
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
        suggestions: getSuggestions(value, this.props.modelos.Articulos )
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
        placeholder: "Busca Artículos",
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