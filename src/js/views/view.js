import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    // 1. receives 'data' from 'state' object from model.js through the controller.js (where it was imported as 'model') and then called in step 4 by 'controlRecipes' function
    // 2. Then 'data' becomes '#data'
    this._data = data;

    // 3. Generates the HTML of the recipe and its ingredients
    const markup = this._generateMarkup();

    if (!render) return markup;

    // 4. Clears the 'recipe' section (spinner goes away)
    this._clear();

    // 5. Injects the whole HTML markup to 'recipe' section
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // method only updates those elements that actually changed
  update(data) {
    this._data = data;

    // HTML markup we will compare to the markup on page
    const newMarkup = this._generateMarkup();

    // converts 'newMarkup' (which is just a string) to an actual DOM object
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // select all the elements from the 'newDOM' object
    // 'Array.from()' creates an array from the selected node lists
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // selects all current elements that are displayed on page
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    // Loop over each node in 'newElements' array and also get the each 'currentElement'  node based on the 'newElement' index position
    newElements.forEach((newElement, i) => {
      const currentElement = currentElements[i];

      // if the 'newElement' is NOT equal to the 'currentElement' (there was a change) and the TEXT value is not an empty string, the 'currentElement' text content will be replaced with the 'newElement' text content

      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        currentElement.textContent = newElement.textContent;
      }

      // Here we update the data attribute
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach(attribute =>
          currentElement.setAttribute(attribute.name, attribute.value)
        );
      }
    });
  }

  //this removes any HTML code from the the inside the 'recipeContainer'
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // shows an error message on the page
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
            <svg>
            <use href="${icons}#icon-alert-triangle"></use>
            </svg>
        </div>
            <p>${message}</p>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // starting message on the screen
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
            <svg>
            <use href="${icons}#icon-smile"></use>
            </svg>
        </div>
            <p>${message}</p>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
