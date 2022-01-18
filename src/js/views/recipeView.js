//VIEW part of the application that contains the presentation logic that interacts with the user
import View from './view';
import icons from 'url:../../img/icons.svg';
// import { Fraction } from 'fractional';
const Fraction = require('fraction.js')

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find this recipe. Please try again.';
  _message = '';

  // listens to recipe hashchange and page load events and then calls a handler function
  // which is the 'controlRecipes' function from 'controller.js' via the 'init' function
  // based on Publisher-Subscriber pattern
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  // event listener for changing the servings number
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--update-servings');
      if (!btn) return;
      // number of servings is from the 'data' html attribute based on the closest 'target' element of '.btn--update-servings' element
      const updateTo = +btn.dataset.updateTo;
      // only calls the handler function if the number of servings is higher than zero
      if(updateTo > 0) handler(updateTo);
    });
  }

  // event listener for clicking the bookmark button
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function(event) {
      const btn = event.target.closest('.btn--bookmark');
      if(!btn) return;
      handler()
    })
  }

  addHandlerDeleteBookmark(handler) {
    this._parentElement.addEventListener('click', function(event) {
      const btn = event.target.closest('.btn--bookmark');
      if(!btn) return;
      handler()
    })
  }

  // generates and returns the HTML markup for any recipe
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? '': 'hidden'}">
       <svg>
           <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">

      ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;
  }

  // generates and returns the HTML markup for the ingredients of the recipes
  _generateMarkupIngredient(ingredient) {
    return `
    <li class="recipe__ingredient">
        <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ingredient.quantity
            ? new Fraction(ingredient.quantity).toFraction(true)
            : ''
        }</div>
        <div class="recipe__description">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.description}
        </div>
    </li>
  `;
  }
}

//this can be used as any name class object in other files
export default new RecipeView();
