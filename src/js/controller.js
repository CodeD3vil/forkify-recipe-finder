//CONTROLLER contains the application logic
//it CONNECTS the MODEL and the VIEW part of the application

//old browsers support
import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
//imports everything from the model file
import * as model from './model.js';
// imports the class 'RecipeView'
import recipeView from './views/recipeView.js';
// imports the class 'searchView'
import searchView from './views/searchView.js';
// imports the class ResultsView
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SECONDS } from './config.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // 1. get the recipe id from its hash number and remove the hash symbol
    const recipeID = window.location.hash.slice(1);

    // 2. checks if the recipe ID exists
    if (!recipeID) return;

    // 3. shows the loading spinner animated element
    recipeView.renderSpinner();

    // 4. Updates results view to to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // . update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 6. loads the recipe from API
    await model.loadRecipe(recipeID);

    // 7. renders the recipe on the page
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. gets the query text from 'searchView.getQuery()' method from 'searchView.js'
    const query = searchView.getQuery();
    if (!query) return;

    // 2. loads the results by passing the 'query' to 'model.loadSearchResults(query)' in
    // 'model.js' and calling the function
    await model.loadSearchResults(query);

    // 3. Render the search results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. Render the page navigation buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (gotToPage) {
  // 1. Render NEW results (10 results based on the 'goToPage' page number passed from)
  resultsView.render(model.getSearchResultsPage(gotToPage));

  // 2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// newServings number comes from the 'addHandlerUpdateServings' method from 'recipeView.js'
const controlServings = function (newServings) {
  // 1. Update the recipe serving (state object) with the number of servings
  model.updateServings(newServings);
  // 2. Update the recipe view on the page
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// Add bookmarks
const controlAddBookmark = function () {
  // 1. Add bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // or remove bookmark
  else model.deleteBookmark(model.state.recipe.id);
  // 2. update recipe view (bookmark icon filled or empty)
  recipeView.update(model.state.recipe);
  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// renders the bookmarks when the page loads
// called by the 'bookmarksView.addHandlerRender()' method from 'bookmarksView.js'
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show the spinner 
    addRecipeView.renderSpinner()

    // upload new recipe data
    await model.uploadRecipe(newRecipe);

    // renders the uploaded recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // renders the bookmarks in the bookmarks preview window
    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // closes the form window
    setTimeout(function() {
      addRecipeView.toggleHidden();
    }, MODAL_CLOSE_SECONDS * 1000)
    
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

// this method initializes the page on load
const init = function () {
  // calls the 'handler' methods based on Publisher-Subscriber pattern
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
