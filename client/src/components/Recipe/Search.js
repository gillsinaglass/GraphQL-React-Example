import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { Link } from 'react-router-dom'

import {SEARCH_RECIPES} from '../../queries'

class Search extends React.Component{
    handleChange = data => {

    }
    render() {
        return (
     <ApolloConsumer>
     {client => (
        <div className="App">
        <input 
          className="search"
          type="search" 
          placeholder="Search For Recipes" 
          onChange={async event => { 
            event.persist()
            const data = await client.query({
                query: SEARCH_RECIPES,
                variables: {searchTerm: event.target.value }
            });
            this.handleChange(data)
        }}
        /> 
        <ul>
            {[].map(recipe =>(
              <li key={recipe._id}>
                  <Link to={`/recipes/${recipe._id}`}><h4>{recipe.name}</h4></Link>
                  <p>{recipe.likes}</p>
              </li>
              ))}
        </ul>
      </div>    
    )}
    </ApolloConsumer>
        )
    }
}

export default Search