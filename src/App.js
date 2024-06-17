import { Button, Card, CardContent, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import "./App.css";
import SearchBar from './SearchBar';
import { fetchData } from './api';


const App = () => {
  const [query] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [results, setResults] = useState([]);

  // Function to fetch recipes based on the current query
  const fetchRecipes = useCallback(async () => {
    if (query.trim() !== '') {
      try {
        const response = await axios.get('https://api.edamam.com/search', {
          params: {
            q: query,
            app_id: '1e7d4a2d',
            app_key: 'af3cab9fca8cbeb80cc63f9e97b93123',
            from: 0,
            to: 20,
          },
        });

        setRecipes(response.data.hits);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    } else {
      setRecipes([]); // Clear recipes if query is empty
    }
  }, [query]);

  // Function to fetch popular recipes on initial load
  const fetchPopularRecipes = useCallback(async () => {
    try {
      const response = await axios.get('https://api.edamam.com/search', {
        params: {
          q: 'popular',
          app_id: 'bbc68f20',
          app_key: 'e67203c959a23191ab483e7645267122',
          from: 0,
          to: 20,
        },
      });

      setPopularRecipes(response.data.hits);
    } catch (error) {
      console.error('Error fetching popular recipes:', error);
    }
  }, []);

  useEffect(() => {
    fetchPopularRecipes();
  }, [fetchPopularRecipes]);

  // useEffect to fetch recipes whenever query changes
  useEffect(() => {
    fetchRecipes();
  }, [query, fetchRecipes]);

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseDialog = () => {
    setSelectedRecipe(null);
  };

  const handleSearch = async (query) => {
    const data = await fetchData(query);
    setResults(data.hits); 
  };
  return (
    <Container>
      <div className="App">
  <div style={{ 
    textAlign: 'center',  
    padding: '20px',      
    backgroundColor: '#d4e1ca',  
    borderRadius: '8px', 
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',  
    marginBottom: '20px', 
  }}>
    <h1 
    style={{ marginBottom: '40px', fontSize: '50px', letterSpacing: '3px', textDecorationThickness: '-50%' }}
    className='ultra'
    
    > 
    Recipe Search App</h1>

    <SearchBar onSearch={handleSearch} />
  </div>

  <div className="results-container">
    <Grid container spacing={4}>
      {results.map((recipe, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card
            style={{ 
              width: '100%', 
              height: '100%', 
              cursor: 'pointer',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
            onClick={() => handleCardClick(recipe)}
          >
            <CardMedia
              component="img"
              alt={recipe.recipe.label}
              height="200"
              image={recipe.recipe.image}
              title={recipe.recipe.label}
              style={{ objectFit: 'cover' }}
            />
            <CardContent style={{ height: '140px' }}>
              <Typography variant="h6" gutterBottom style={{ minHeight: '60px' }}>
                {recipe.recipe.label}
              </Typography>
              <Typography variant="body2">
                Calories: {Math.round(recipe.recipe.calories)}
              </Typography>
              <Typography variant="body2">
                Ingredients: {recipe.recipe.ingredientLines.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </div>
</div>

      <Typography variant="h4" gutterBottom>
      </Typography>
      <Grid container spacing={4}>
        {popularRecipes.map((recipe, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card
              style={{ 
                width: '100%', 
                height: '100%', 
                cursor: 'pointer',
                borderRadius: '8px',
                overflow: 'hidden',
                marginTop: "20px"

              }}
              onClick={() => handleCardClick(recipe)}
            >
              <CardMedia
                component="img"
                alt={recipe.recipe.label}
                height="200"
                image={recipe.recipe.image}
                title={recipe.recipe.label}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {recipe.recipe.label}
                </Typography>
                <Typography variant="body2">
                  Calories: {Math.round(recipe.recipe.calories)}
                </Typography>
                <Typography variant="body2">
                  Ingredients: {recipe.recipe.ingredientLines.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" gutterBottom style={{ marginTop: '40px' }}>
      </Typography>
      <Grid container spacing={4}>
        {recipes.map((recipe, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card
              style={{ 
                width: '100%', 
                height: '100%', 
                cursor: 'pointer',
                borderRadius: '8px',
                overflow: 'hidden',
                marginTop: "20px"
              }}
              onClick={() => handleCardClick(recipe)}
            >
              <CardMedia
                component="img"
                alt={recipe.recipe.label}
                height="200"
                image={recipe.recipe.image}
                title={recipe.recipe.label}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {recipe.recipe.label}
                </Typography>
                <Typography variant="body2">
                  Calories: {Math.round(recipe.recipe.calories)}
                </Typography>
                <Typography variant="body2">
                  Ingredients: {recipe.recipe.ingredientLines.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedRecipe} onClose={handleCloseDialog}>
        <DialogTitle>{selectedRecipe?.recipe.label}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Calories: {Math.round(selectedRecipe?.recipe.calories)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Ingredients:
          </Typography>
          <ul>
            {selectedRecipe?.recipe.ingredientLines.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
