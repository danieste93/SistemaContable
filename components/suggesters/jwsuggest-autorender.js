import Autosuggest from 'react-autosuggest';
import "../../styles/autosugest.css"
import {connect} from 'react-redux';
import React from "react"
import {Filtervalue,Searcher} from"../filtros/filtroeqid"
import {Animate} from "react-animate-mount"
  
// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function getSuggestions(value, props) {
  
        
    if (value === '') {
      return [];
    }
    let toset =[]
    console.log(value)
  const valorfiltrado = Filtervalue(props, value)
  const valortTitulo = Searcher(props, value)



  if(valorfiltrado.length > valortTitulo.length){
    toset =valorfiltrado
  }
  else{
    toset = valortTitulo
  }


    return toset
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
        <span key={suggestion._id} className="customsuggest" onClick={()=>{this.props.sendClick(suggestion)
                           
          setTimeout(()=>{
            this.setState({ value: '',
              suggestions: []})
          },5)

        }}>{suggestion.Titulo}</span>
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
        suggestions: getSuggestions(value, this.props.sugerencias )
      });
    };
  
    onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: []
      });
    };
  
    render() {
     console.log(this.state)
      const { value, suggestions } = this.state;
      const inputProps = {
        placeholder: "Busca Productos",
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
<Animate show={this.state.value !== ""}>

<button type="button" className="btn btn-outline-danger"
onClick={()=>{

  this.setState({value:""})
  this.props.resetData()

}


}
>X</button>
</Animate>
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