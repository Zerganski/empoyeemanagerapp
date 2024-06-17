import SearchIcon from '@mui/icons-material/Search';
import { Grid, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (query.trim() !== '') {
      onSearch(query);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={9}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search recipes"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <IconButton type="submit" aria-label="search">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchBar;
