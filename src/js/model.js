//MODEL part contains contains application data like business logic that manipulates the data like -
//HTTP library that interacts with data from the web (APIs, back-end)
//STATE of the application: bookmarks, search results, recipe

import { async } from 'regenerator-runtime';

import { API_URL, API_KEY } from './config.js';
import { AJAX } from './helpers.js';
import { RES_PER_PAGE } from './config.js';

//the state object gets updated when 'loadRecipe' function runs and gets the data from an API
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function(data) {
  const { recipe } = data.data;
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && {key: recipe.key}),
    };
}

//receives data from an API and populates the 'state' object that will be
//passed into methods and functions
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data)
    
    // This check makes sure we do not lose a bookmark of already bookmarked recipe, because by default, when 'loadRecipe' is called
    // all displayed recipes are loaded from an API which deletes the 'bookmarked' property from the 'state' object
    // checks if a recipe that gets displayed was already bookmarked (is in the 'state.bookmarks' array)
    // if yes, state.bookmarked becomes true, if not, it becomes false

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe)
  } catch (error) {
    // in order to show the error in the controller.js where the 'controlRecipes' function is called
    // we have to manually 'throw' the error after catching it so we can use it in 'recipeView.renderError()'
    // method to show the error to the user
    throw error;
  }
};

// 1. receives the 'query' text from 'searchView.getQuery()' method from 'searchView.js' which is called in 'controller.js' by 'controlSearchResults' function
// 2. adds the 'query' text to the 'state.search' object as a query property
// 3. gets the 'data' from 'API_URL' based on the search query
// 4. populates the object properties of 'state.search.results' array with all search results based on the 'query' text
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && {key: recipe.key}),
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

// a function that that gets only first 10 search results to render
// no need for this function to be a async function because we already have the search result data loaded
export const getSearchResultsPage = function (page = state.search.page) {
  // number that is used to display the page number on the navigation buttons
  // is passed in from 'controlPagination()' from 'controller.js'
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  // console.log(start, end);
  return state.search.results.slice(start, end);
};

//
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });
  // update the number of servings in the 'state' object
  state.recipe.servings = newServings;
};

// store bookmarks to a local browser storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// when adding a bookmark we get all tah data (recipe object) because we need to store it in an array
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // saves the bookmarks
  persistBookmarks();
};

// when removing data we usually only need a part of data to find the object to remove
// in this case it is going to be the 'id' property
export const deleteBookmark = function (id) {
  const bookmarkIndex = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(bookmarkIndex, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// initialization function that loads saved bookmarks when page loads
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// a function to clear all bookmarks
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//Upload recipe
//The 'newRecipe' data is passed in from 'controlAddRecipe' in 'controller.js' via 'addHandlerUpload' method from
// 'addRecipeView.js'
// this data is an object at first that contains all the data from the form
// 1. We convert it to an array
// 2. Filter only for entries (arrays) where the first element contains 'ingredient' and the second
// element is NOT an empty string
// 3. We 'map' over these entries replacing any white space first
// 4. We split them with a comma
// 5. Deconstruct them into variables
// 6. Return an object
// 7.

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArray = ing[1].replace(' ', '').split(',');
        // throws an error when the recipe format is wrong
        if (ingArray.length !== 3) throw new Error('Wrong ingredient format');
        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // create an object  for the API
    // has to be the same format as we received it when we load the recipes
    const recipeToUpload = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipeToUpload);
    // displays the uploaded recipe
    state.recipe = createRecipeObject(data)
    // adds the uploaded recipe as a bookmark
    addBookmark(state.recipe)
    console.log(data)
    
  } catch (error) {
    throw error;
  }
};
