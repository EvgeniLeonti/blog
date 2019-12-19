import React from "react";

import Autosuggest from 'react-autosuggest';
import ReactJson from 'react-json-view'


class SearchSuggestions extends React.Component {
  constructor() {
    super();
    
    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }
  
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };
  
  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: (value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
  
        return this.props.data.filter(item => JSON.stringify(item).toLowerCase().indexOf(value.toLowerCase()) > -1)
        
    
      })(value)
    });
  };
  
  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  
  render() {
    const { value, suggestions } = this.state;
    
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: `Search by fields`,
      value,
      onChange: this.onChange
    };
    
    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={suggestion => (
          <ReactJson src={suggestion} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} name={false} />
        )}
        inputProps={inputProps}
      />
    );
  }
}

export default SearchSuggestions;