import React, {useState} from 'react'
import ReactJson from 'react-json-view'
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import Autosuggest from "react-autosuggest";



const SearchInput = (props) => {
  let entity = props.entity;

  
  const READ_ALL_QUERY = gql`
      query {
          all${entity.pluralName} (sort: {createdAt: DESC}) {
            id ${entity.manualFields}
      }
      }
  `;
  
  const {data, loading, error} = useQuery(READ_ALL_QUERY);
  
  // get all entities
  if (loading) return (<p>Loading entities...</p>);
  if (error) return (<p>Error getting entities: {JSON.stringify(error)}</p>);
  
  
  console.log("data:")
  console.log(data)
  
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
          getSuggestionValue={suggestion => props.onSuggestionSelected(suggestion)}
          renderSuggestion={suggestion => (
            <ReactJson src={suggestion} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} name={false} />
          )}
          inputProps={inputProps}
          theme={{
            container:                'react-autosuggest__container',
            containerOpen:            'react-autosuggest__container--open',
            input:                    'form-control form-control-user',
            inputOpen:                'react-autosuggest__input--open',
            inputFocused:             'react-autosuggest__input--focused',
            suggestionsContainer:     'react-autosuggest__suggestions-container',
            suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
            suggestionsList:          'react-autosuggest__suggestions-list',
            suggestion:               'react-autosuggest__suggestion',
            suggestionFirst:          'react-autosuggest__suggestion--first',
            suggestionHighlighted:    'react-autosuggest__suggestion--highlighted',
            sectionContainer:         'react-autosuggest__section-container',
            sectionContainerFirst:    'react-autosuggest__section-container--first',
            sectionTitle:             'react-autosuggest__section-title'
          }
          }
        />
      );
    }
  }
  
  return (
    <SearchSuggestions data={data[`all${entity.pluralName}`]}/>
  )
  
};

export default SearchInput;