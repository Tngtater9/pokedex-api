const app = require('./pokedex.js');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening`);
})