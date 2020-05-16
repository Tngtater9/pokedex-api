require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require('helmet')
const POKEDEX = require('./pokedex.json')

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev';

app.use(morgan(morganSetting));
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    
    next()
  })

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

function handleGetTypes(req, res) {
    res.json(validTypes);
}

app.get('/types', handleGetTypes);

function handleGetPokemon(req, res) { 
    let pokemonResult = POKEDEX.pokemon;

    if(req.query.name){
        pokemonResult = pokemonResult.filter(pokemon =>
            pokemon.name.toLowerCase().includes(req.query.name.toLowerCase()));
    }

    if(req.query.type){
        pokemonResult = pokemonResult.filter(pokemon =>
             pokemon.type.includes(req.query.type));
    }

    res.json(pokemonResult);
}

app.get('/pokemon', handleGetPokemon);

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response);
})

module.exports = app;