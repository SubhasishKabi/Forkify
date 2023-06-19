import icons from '../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);
    if (!id) return;

    //1) render spinner

    recipeView.renderSpinner();

    // 2)) load recipe

    await model.loadRecipe(id);

    // 3) Rendering recipe

    recipeView.render(model.state.recipe);
    //the render method will recieve the data
    //const recipeview = new recipeView(model.state.data) => if we had exported the class
  } catch (err) {
    console.log(err);
    // recipeView.renderError(`${err} 💥💥💥`)
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Initaite Spinner

    resultsView.renderSpinner();

    // Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // load search results
    await model.loadSearchResults(query);

    //render rsults

    //resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultPage());

    //render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //render rsults

  //resultsView.render(model.state.search.results)
  resultsView.render(model.getSearchResultPage(goToPage));

  //render pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  // ADDor DELETE bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //console.log(model.state.recipe);

  // Render the recipe page
  recipeView.render(model.state.recipe);

  //render bookmarks

  bookmarksView.render(model.state.bookmarks);
};

//bookmarks from local storage
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner()
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe)
    recipeView.render(model.state.recipe)

    addRecipeView.renderMessage()

    bookmarksView.render(model.state.bookmarks)

    setTimeout(function(){
      addRecipeView.toggleWindow()
    },2000)
  } catch (err) {
    console.error('💥', err)
    addRecipeView.renderError(err.message)
  }
};
const init = function () {
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addServingsUpdateHandler(controlServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addClickHandler(controlPagination);
  bookmarksView.addRenderHandler(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
