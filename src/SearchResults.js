// SearchResults.js
import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((result) => (
          <li key={result.recipe.uri}>
            <div>
              <h3>{result.recipe.label}</h3>
              <p>Calories: {result.recipe.calories.toFixed(2)}</p>
              <img src={result.recipe.image} alt={result.recipe.label} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default SearchResults;
